import { useCallback, useEffect, useState } from "react";

const viteEnvironment = import.meta.env ?? {};
export const LOCAL_HISTORY_CLAIM_KEY = "nursing-hypotheses.pending-local-history-claim.v1";
const isSupabaseConfigured = Boolean(
  String(viteEnvironment.VITE_SUPABASE_URL ?? "").trim()
  && String(viteEnvironment.VITE_SUPABASE_PUBLISHABLE_KEY ?? "").trim(),
);

async function loadSupabase() {
  const module = await import("../lib/supabase-client.js");
  return module.supabase;
}

function confirmationRedirectUrl() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/?auth=confirmed`;
}

export function useAuthSession() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(isSupabaseConfigured ? "loading" : "unavailable");

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    let subscription;

    loadSupabase().then((supabase) => {
      if (!active || !supabase) return;
      ({ data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setStatus("ready");
      }));
      return supabase.auth.getSession();
    }).then((result) => {
      if (!active || !result) return;
      if (result.error) {
        setSession(null);
        setStatus("error");
        return;
      }
      setSession(result.data.session ?? null);
      setStatus("ready");
    }).catch(() => {
      if (active) setStatus("error");
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, code: "sign-in-failed", error };
    return { ok: true, code: "signed-in", session: data.session };
  }, []);

  const signUp = useCallback(async ({ email, password }) => {
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: confirmationRedirectUrl() },
    });
    if (error) return { ok: false, code: "sign-up-failed", error };
    if (data.user?.id && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LOCAL_HISTORY_CLAIM_KEY, JSON.stringify({
          userId: data.user.id,
          createdAt: Date.now(),
        }));
      } catch { /* Cloud account creation still works without local migration. */ }
    }
    return {
      ok: true,
      code: data.session ? "signed-in" : "confirmation-sent",
      session: data.session,
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = await loadSupabase();
    if (!supabase) return { ok: true };
    const { error } = await supabase.auth.signOut({ scope: "local" });
    return error ? { ok: false, error } : { ok: true };
  }, []);

  return {
    configured: isSupabaseConfigured,
    session,
    user: session?.user ?? null,
    status,
    signIn,
    signUp,
    signOut,
  };
}
