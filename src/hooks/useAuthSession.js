import { useCallback, useEffect, useState } from "react";

const viteEnvironment = import.meta.env ?? {};
export const LOCAL_HISTORY_CLAIM_KEY = "nursing-hypotheses.pending-local-history-claim.v1";
export const OAUTH_INTENT_KEY = "nursing-hypotheses.pending-oauth-intent.v1";
const OAUTH_CONSENT_SYNC_KEY = "nursing-hypotheses.pending-oauth-consent.v1";
const ACCOUNT_NOTICE_VERSION = "2026-09-16";
const OAUTH_INTENT_MAX_AGE_MS = 15 * 60 * 1000;
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

function readFreshOAuthIntent() {
  if (typeof window === "undefined") return null;
  try {
    const intent = JSON.parse(window.localStorage.getItem(OAUTH_INTENT_KEY) ?? "null");
    const elapsed = Date.now() - intent?.createdAt;
    const isFresh = intent?.provider === "google"
      && Number.isFinite(intent.createdAt)
      && elapsed >= 0
      && elapsed < OAUTH_INTENT_MAX_AGE_MS;
    if (!isFresh) {
      window.localStorage.removeItem(OAUTH_INTENT_KEY);
      return null;
    }
    return intent;
  } catch {
    return null;
  }
}

function prepareOAuthSession(session) {
  const userId = session?.user?.id;
  const intent = readFreshOAuthIntent();
  const hasOAuthCallback = typeof window !== "undefined"
    && new URLSearchParams(window.location.search).get("auth") === "google";
  if (!userId || !intent || !hasOAuthCallback) return;
  try {
    if (intent.claimLocalHistory) {
      window.localStorage.setItem(LOCAL_HISTORY_CLAIM_KEY, JSON.stringify({
        userId,
        createdAt: Date.now(),
      }));
    }
    window.localStorage.setItem(OAUTH_CONSENT_SYNC_KEY, JSON.stringify({
      userId,
      createdAt: Date.now(),
      learningTermsVersion: ACCOUNT_NOTICE_VERSION,
      privacyNoticeVersion: ACCOUNT_NOTICE_VERSION,
      adultSelfAttestation: "18-or-older",
    }));
    window.localStorage.removeItem(OAUTH_INTENT_KEY);
  } catch { /* The signed-in session remains usable if browser storage is unavailable. */ }
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
        prepareOAuthSession(nextSession);
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
      prepareOAuthSession(result.data.session);
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

  useEffect(() => {
    if (!authEnabled || !session?.user?.id || typeof window === "undefined") return undefined;
    let active = true;
    let consent;
    try {
      consent = JSON.parse(window.localStorage.getItem(OAUTH_CONSENT_SYNC_KEY) ?? "null");
    } catch {
      return undefined;
    }
    if (consent?.userId !== session.user.id) return undefined;
    loadSupabase().then((supabase) => supabase?.auth.updateUser({
      data: {
        learning_terms_version: consent.learningTermsVersion,
        privacy_notice_version: consent.privacyNoticeVersion,
        adult_self_attestation: consent.adultSelfAttestation,
      },
    })).then((result) => {
      if (!active || result?.error) return;
      try { window.localStorage.removeItem(OAUTH_CONSENT_SYNC_KEY); } catch { /* Ignore storage cleanup failure. */ }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [authEnabled, session?.user?.id]);

  const signIn = useCallback(async ({ email, password, claimLocalHistory = false }) => {
    if (!authEnabled) return { ok: false, code: "unavailable" };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, code: "sign-in-failed", error };
    if (claimLocalHistory && data.user?.id && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LOCAL_HISTORY_CLAIM_KEY, JSON.stringify({
          userId: data.user.id,
          createdAt: Date.now(),
        }));
      } catch { /* The account session still works without importing device-local progress. */ }
    }
    return { ok: true, code: "signed-in", session: data.session };
  }, [authEnabled]);

  const signInWithGoogle = useCallback(async ({ claimLocalHistory = false } = {}) => {
    if (!authEnabled || typeof window === "undefined") return { ok: false, code: "unavailable" };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    try { window.localStorage.removeItem(OAUTH_INTENT_KEY); } catch { /* Ignore stale intent cleanup failure. */ }
    try {
      window.localStorage.setItem(OAUTH_INTENT_KEY, JSON.stringify({
        provider: "google",
        claimLocalHistory: Boolean(claimLocalHistory),
        createdAt: Date.now(),
      }));
    } catch { /* OAuth can continue without importing device-local progress. */ }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: appRedirectUrl("google") },
    });
    if (error) {
      try { window.localStorage.removeItem(OAUTH_INTENT_KEY); } catch { /* Ignore storage cleanup failure. */ }
      return { ok: false, code: "oauth-failed", error };
    }
    return { ok: true, code: "oauth-started", url: data.url };
  }, [authEnabled]);

  const signUp = useCallback(async ({ email, password, claimLocalHistory = false }) => {
    if (!authEnabled) return { ok: false, code: "unavailable" };
    const supabase = await loadSupabase();
    if (!supabase) return { ok: false, code: "unavailable" };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: appRedirectUrl("confirmed"),
        data: {
          learning_terms_version: ACCOUNT_NOTICE_VERSION,
          privacy_notice_version: ACCOUNT_NOTICE_VERSION,
          adult_self_attestation: "18-or-older",
        },
      },
    });
    if (error) return { ok: false, code: "sign-up-failed", error };
    if (claimLocalHistory && data.user?.id && typeof window !== "undefined") {
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
    signInWithGoogle,
    signUp,
    requestPasswordReset,
    updatePassword,
    signOut,
  };
}
