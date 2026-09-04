import { useEffect, useState } from "react";
import { CheckCircle, CloudCheck, LockKey, SignIn, SignOut, UserCircle } from "@phosphor-icons/react";

export function AccountPanel({ auth, lang, syncStatus, entitlement, onSignOut }) {
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setEmail("");
    setPassword("");
    setNotice("");
    setMode("sign-in");
  }, [auth.user?.id]);
  const isArabic = lang === "ar";
  const text = isArabic ? {
    eyebrow: "حساب التعلم",
    title: "احفظ تقدمك بين أجهزتك",
    body: "يمكنك الاستمرار محلياً دون حساب، أو تسجيل الدخول لمزامنة محاولاتك المكتملة بشكل خاص.",
    signIn: "تسجيل الدخول",
    create: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    submitSignIn: "دخول ومزامنة التقدم",
    submitCreate: "إنشاء حساب مجاني",
    passwordHint: "استخدم 8 أحرف على الأقل. لا تُحفظ كلمة المرور داخل الموقع.",
    confirmation: "أرسلنا رابط تأكيد إلى بريدك. افتحه ثم عد إلى صفحة التعلم.",
    failure: "تعذر إكمال العملية. تحقق من البيانات وحاول مرة أخرى.",
    unavailable: "المزامنة السحابية غير متاحة في هذه النسخة؛ سيبقى تقدمك على هذا الجهاز.",
    checking: "جارٍ التحقق من جلسة الحساب…",
    signedIn: "مسجل الدخول",
    synced: "تمت المزامنة",
    syncing: "جارٍ مزامنة التقدم",
    syncError: "تعذر التزامن الآن؛ النسخة المحلية ما زالت محفوظة.",
    plan: "الوصول الحالي",
    free: "مجاني",
    signOut: "تسجيل الخروج من هذا الجهاز",
  } : {
    eyebrow: "Learning account",
    title: "Keep your progress across devices",
    body: "Continue locally without an account, or sign in to privately sync completed attempts.",
    signIn: "Sign in",
    create: "Create account",
    email: "Email address",
    password: "Password",
    submitSignIn: "Sign in and sync progress",
    submitCreate: "Create free account",
    passwordHint: "Use at least 8 characters. The site never stores your password itself.",
    confirmation: "We sent a confirmation link to your email. Open it, then return to My learning.",
    failure: "We could not complete that request. Check the details and try again.",
    unavailable: "Cloud sync is unavailable in this build; progress will remain on this device.",
    checking: "Checking your account session…",
    signedIn: "Signed in",
    synced: "Progress synced",
    syncing: "Syncing progress",
    syncError: "Sync is unavailable right now; your local copy is still saved.",
    plan: "Current access",
    free: "Free",
    signOut: "Sign out on this device",
  };

  async function submit(event) {
    event.preventDefault();
    if (!email.trim() || password.length < 8 || busy) return;
    setBusy(true);
    setNotice("");
    try {
      const result = mode === "sign-in"
        ? await auth.signIn({ email: email.trim(), password })
        : await auth.signUp({ email: email.trim(), password });
      setPassword("");
      if (!result.ok) setNotice(text.failure);
      else {
        setEmail("");
        if (result.code === "confirmation-sent") setNotice(text.confirmation);
      }
    } catch {
      setPassword("");
      setNotice(text.failure);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      await onSignOut();
    } finally {
      setBusy(false);
    }
  }

  if (!auth.configured) {
    return <section className="account-panel account-panel-muted"><LockKey size={34} weight="duotone" /><div><p className="eyebrow">{text.eyebrow}</p><h2>{text.title}</h2><p>{text.unavailable}</p></div></section>;
  }

  if (auth.status === "loading") {
    return <section className="account-panel account-panel-muted" aria-live="polite"><CloudCheck size={34} weight="duotone" /><div><p className="eyebrow">{text.eyebrow}</p><h2>{text.checking}</h2></div></section>;
  }

  if (auth.user) {
    const syncLabel = syncStatus === "syncing" ? text.syncing : syncStatus === "error" ? text.syncError : text.synced;
    const entitlementIsCurrent = entitlement?.status === "active"
      && (!entitlement.access_until || Date.parse(entitlement.access_until) > Date.now());
    return <section className="account-panel signed-in-panel"><UserCircle size={39} weight="duotone" /><div className="account-identity"><p className="eyebrow">{text.eyebrow}</p><h2>{text.signedIn}</h2><p>{auth.user.email}</p><span className={`sync-chip ${syncStatus}`}><CheckCircle size={16} weight="fill" />{syncLabel}</span></div><div className="account-plan"><small>{text.plan}</small><strong>{entitlementIsCurrent ? entitlement.plan_code : text.free}</strong></div><button type="button" className="button button-secondary account-signout" onClick={signOut} disabled={busy}><SignOut size={17} />{text.signOut}</button></section>;
  }

  return <section className="account-panel signed-out-panel"><div className="account-intro"><CloudCheck size={39} weight="duotone" /><div><p className="eyebrow">{text.eyebrow}</p><h2>{text.title}</h2><p>{text.body}</p></div></div><div className="account-mode" role="group" aria-label={text.eyebrow}><button type="button" aria-pressed={mode === "sign-in"} className={mode === "sign-in" ? "active" : ""} onClick={() => { setMode("sign-in"); setNotice(""); }}>{text.signIn}</button><button type="button" aria-pressed={mode === "create"} className={mode === "create" ? "active" : ""} onClick={() => { setMode("create"); setNotice(""); }}>{text.create}</button></div><form className="account-form" onSubmit={submit}><label><span>{text.email}</span><input type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label><span>{text.password}</span><input type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /><small>{text.passwordHint}</small></label><button type="submit" className="button button-primary" disabled={busy || !email.trim() || password.length < 8}><SignIn size={18} />{mode === "sign-in" ? text.submitSignIn : text.submitCreate}</button>{notice ? <p className="account-notice" role="status">{notice}</p> : null}</form></section>;
}
