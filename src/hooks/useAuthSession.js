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

function appRedirectUrl(marker) {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/?auth=${marker}`;
}

export function useAuthSession({ enabled = true } = {}) {
  const authEnabled = enabled && isSupabaseConfigured;
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(authEnabled ? "loading" : "ready");
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!authEnabled) {
      setSession(null);
      setStatus("ready");
      setRecoveryMode(false);
      return undefined;
    }
    let active = true;
    let subscription;

    loadSupabase().then((supabase) => {
      if (!active || !supabase) return;
      ({ data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setStatus("ready");
        if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
        if (event === "SIGNED_OUT") setRecoveryMode(false);
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
  }, [authEnabled]);

  const signIn = useCallback(async ({ email, password }) => {
    if (!authEnabled) return { ok: false, code: "unavailable" };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, code: "sign-in-failed", error };
    return { ok: true, code: "signed-in", session: data.session };
  }, [authEnabled]);

  const signUp = useCallback(async ({ email, password }) => {
    if (!authEnabled) return { ok: false, code: "unavailable" };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: appRedirectUrl("confirmed"),
        data: {
          learning_terms_version: "2026-09-05",
          privacy_notice_version: "2026-09-05",
          adult_self_attestation: "18-or-older",
        },
      },
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
  }, [authEnabled]);

  const requestPasswordReset = useCallback(async ({ email }) => {
    if (!authEnabled) return { ok: false, code: "unavailable" };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: appRedirectUrl("recovery"),
    });
    return error ? { ok: false, code: "reset-failed", error } : { ok: true, code: "reset-sent" };
  }, [authEnabled]);

  const updatePassword = useCallback(async ({ password }) => {
    if (!authEnabled) return { ok: false, code: "unavailable" };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { ok: false, code: "update-failed", error };
    setRecoveryMode(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${window.location.pathname}#/learning`);
    }
    return { ok: true, code: "password-updated" };
  }, [authEnabled]);

  const signOut = useCallback(async () => {
    if (!authEnabled) return { ok: true };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: true };
    const { error } = await supabase.auth.signOut({ scope: "local" });
    return error ? { ok: false, error } : { ok: true };
  }, [authEnabled]);

  return {
    configured: authEnabled,
    session,
    user: session?.user ?? null,
    status,
    recoveryMode,
    signIn,
    signUp,
    requestPasswordReset,
    updatePassword,
    signOut,
  };
}
