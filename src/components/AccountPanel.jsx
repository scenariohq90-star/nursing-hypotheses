import { useEffect, useState } from "react";
import {
  CheckCircle,
  CloudCheck,
  DownloadSimple,
  EnvelopeSimple,
  Key,
  LockKey,
  SignIn,
  SignOut,
  UserCircle,
} from "@phosphor-icons/react";

const SUPPORT_EMAIL = "Scenario.hq90@gmail.com";

export function AccountPanel({ auth, lang, syncStatus, onSignOut, onExportLearningData }) {
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyRead, setPrivacyRead] = useState(false);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setEmail("");
    setPassword("");
    setPrivacyRead(false);
    setAdultConfirmed(false);
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
    reset: "استعادة كلمة المرور",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    newPassword: "كلمة المرور الجديدة",
    submitSignIn: "دخول ومزامنة التقدم",
    submitCreate: "إنشاء حساب تعلم",
    submitReset: "إرسال رابط الاستعادة",
    submitNewPassword: "حفظ كلمة المرور الجديدة",
    passwordHint: "استخدم 8 أحرف على الأقل. لا يحفظ الموقع كلمة المرور داخل سجل التعلم.",
    confirmation: "أرسلنا رابط تأكيد إلى بريدك. افتحه ثم عد إلى صفحة التعلم.",
    resetSent: "إذا كان البريد مرتبطاً بحساب، فستصله رسالة استعادة. افحص البريد والرسائل غير المرغوبة.",
    passwordUpdated: "تم تحديث كلمة المرور.",
    failure: "تعذر إكمال العملية. تحقق من البيانات وحاول مرة أخرى.",
    unavailable: "المزامنة السحابية غير متاحة في هذه النسخة؛ سيبقى تقدمك على هذا الجهاز.",
    checking: "جارٍ التحقق من جلسة الحساب…",
    signedIn: "مسجل الدخول",
    synced: "تمت المزامنة",
    syncing: "جارٍ مزامنة التقدم",
    syncError: "تعذر التزامن الآن؛ النسخة المحلية ما زالت محفوظة.",
    signOut: "تسجيل الخروج من هذا الجهاز",
    forgot: "نسيت كلمة المرور؟",
    privacyConsent: "قرأت إشعار الخصوصية وشروط التعلم وأفهم أن الحساب يحفظ سجل تعلم محدوداً.",
    adultConsent: "أؤكد أن عمري 18 سنة أو أكثر.",
    privacy: "إشعار الخصوصية",
    terms: "شروط التعلم",
    export: "تنزيل بيانات تعلمي",
    deletion: "طلب حذف الحساب",
    deletionHint: "يرسل الطلب إلى بريد المشروع للتحقق من ملكية الحساب قبل الحذف.",
    recoveryTitle: "اختر كلمة مرور جديدة",
  } : {
    eyebrow: "Learning account",
    title: "Keep your progress across devices",
    body: "Continue locally without an account, or sign in to privately sync completed attempts.",
    signIn: "Sign in",
    create: "Create account",
    reset: "Reset password",
    email: "Email address",
    password: "Password",
    newPassword: "New password",
    submitSignIn: "Sign in and sync progress",
    submitCreate: "Create learning account",
    submitReset: "Send reset link",
    submitNewPassword: "Save new password",
    passwordHint: "Use at least 8 characters. The password is never stored in the learning record.",
    confirmation: "We sent a confirmation link to your email. Open it, then return to My learning.",
    resetSent: "If that email belongs to an account, a reset message will arrive. Check your inbox and spam folder.",
    passwordUpdated: "Your password has been updated.",
    failure: "We could not complete that request. Check the details and try again.",
    unavailable: "Cloud sync is unavailable in this build; progress will remain on this device.",
    checking: "Checking your account session…",
    signedIn: "Signed in",
    synced: "Progress synced",
    syncing: "Syncing progress",
    syncError: "Sync is unavailable right now; your local copy is still saved.",
    signOut: "Sign out on this device",
    forgot: "Forgot your password?",
    privacyConsent: "I have read the Privacy notice and Learning terms and understand that the account stores a limited learning history.",
    adultConsent: "I confirm that I am 18 years of age or older.",
    privacy: "Privacy notice",
    terms: "Learning terms",
    export: "Download my learning data",
    deletion: "Request account deletion",
    deletionHint: "The request goes to the project email so account ownership can be verified before deletion.",
    recoveryTitle: "Choose a new password",
  };

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (mode === "reset" && !email.trim()) return;
    if (mode !== "reset" && (!email.trim() || password.length < 8)) return;
    if (mode === "create" && (!privacyRead || !adultConfirmed)) return;
    setBusy(true);
    setNotice("");
    try {
      let result;
      if (mode === "sign-in") result = await auth.signIn({ email: email.trim(), password });
      else if (mode === "create") result = await auth.signUp({ email: email.trim(), password });
      else result = await auth.requestPasswordReset({ email: email.trim() });
      setPassword("");
      if (!result.ok) setNotice(text.failure);
      else if (result.code === "confirmation-sent") setNotice(text.confirmation);
      else if (result.code === "reset-sent") setNotice(text.resetSent);
      if (result.ok && result.code !== "signed-in") setEmail("");
    } catch {
      setPassword("");
      setNotice(text.failure);
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword(event) {
    event.preventDefault();
    if (busy || password.length < 8) return;
    setBusy(true);
    setNotice("");
    try {
      const result = await auth.updatePassword({ password });
      setPassword("");
      setNotice(result.ok ? text.passwordUpdated : text.failure);
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

  if (auth.user && auth.recoveryMode) {
    return <section className="account-panel signed-out-panel"><div className="account-intro"><Key size={39} weight="duotone" /><div><p className="eyebrow">{text.reset}</p><h2>{text.recoveryTitle}</h2><p>{text.passwordHint}</p></div></div><form className="account-form" onSubmit={updatePassword}><label><span>{text.newPassword}</span><input type="password" autoComplete="new-password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button type="submit" className="button button-primary" disabled={busy || password.length < 8}><Key size={18} />{text.submitNewPassword}</button>{notice ? <p className="account-notice" role="status">{notice}</p> : null}</form></section>;
  }

  if (auth.user) {
    const syncLabel = syncStatus === "syncing" ? text.syncing : syncStatus === "error" ? text.syncError : text.synced;
    const deletionHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Nursing Hypotheses account deletion request")}&body=${encodeURIComponent(`Account email: ${auth.user.email ?? ""}\n\nPlease verify my identity and delete my learning account and synced learning records.`)}`;
    return <section className="account-panel signed-in-panel"><UserCircle size={39} weight="duotone" /><div className="account-identity"><p className="eyebrow">{text.eyebrow}</p><h2>{text.signedIn}</h2><p>{auth.user.email}</p><span className={`sync-chip ${syncStatus}`}><CheckCircle size={16} weight="fill" />{syncLabel}</span></div><div className="account-controls"><button type="button" className="button button-secondary" onClick={onExportLearningData}><DownloadSimple size={17} />{text.export}</button><a className="button button-secondary" href={deletionHref}><EnvelopeSimple size={17} />{text.deletion}</a><small>{text.deletionHint}</small></div><button type="button" className="button button-secondary account-signout" onClick={signOut} disabled={busy}><SignOut size={17} />{text.signOut}</button></section>;
  }

  const submitDisabled = busy
    || !email.trim()
    || (mode !== "reset" && password.length < 8)
    || (mode === "create" && (!privacyRead || !adultConfirmed));
  return <section className="account-panel signed-out-panel"><div className="account-intro"><CloudCheck size={39} weight="duotone" /><div><p className="eyebrow">{text.eyebrow}</p><h2>{text.title}</h2><p>{text.body}</p></div></div><div className="account-mode" role="group" aria-label={text.eyebrow}><button type="button" aria-pressed={mode === "sign-in"} className={mode === "sign-in" ? "active" : ""} onClick={() => { setMode("sign-in"); setNotice(""); }}>{text.signIn}</button><button type="button" aria-pressed={mode === "create"} className={mode === "create" ? "active" : ""} onClick={() => { setMode("create"); setNotice(""); }}>{text.create}</button></div><form className="account-form" onSubmit={submit}><label><span>{text.email}</span><input type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>{mode !== "reset" ? <label><span>{text.password}</span><input type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /><small>{text.passwordHint}</small></label> : null}{mode === "create" ? <div className="account-consent"><label><input type="checkbox" checked={privacyRead} onChange={(event) => setPrivacyRead(event.target.checked)} /><span>{text.privacyConsent} <a href="#/privacy">{text.privacy}</a> · <a href="#/terms">{text.terms}</a></span></label><label><input type="checkbox" checked={adultConfirmed} onChange={(event) => setAdultConfirmed(event.target.checked)} /><span>{text.adultConsent}</span></label></div> : null}<button type="submit" className="button button-primary" disabled={submitDisabled}><SignIn size={18} />{mode === "sign-in" ? text.submitSignIn : mode === "create" ? text.submitCreate : text.submitReset}</button>{mode === "sign-in" ? <button type="button" className="account-help" onClick={() => { setMode("reset"); setPassword(""); setNotice(""); }}>{text.forgot}</button> : mode === "reset" ? <button type="button" className="account-help" onClick={() => { setMode("sign-in"); setNotice(""); }}>{text.signIn}</button> : null}{notice ? <p className="account-notice" role="status">{notice}</p> : null}</form></section>;
}
