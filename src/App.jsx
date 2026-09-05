import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  Books,
  Brain,
  ChartLineUp,
  Check,
  CheckCircle,
  Circle,
  ClipboardText,
  Clock,
  Database,
  Drop,
  EnvelopeSimple,
  Exam,
  FirstAidKit,
  Globe,
  GraduationCap,
  Gauge,
  Heartbeat,
  Hospital,
  House,
  Info,
  List,
  LockKey,
  Medal,
  Play,
  Pulse,
  ShieldCheck,
  ShieldWarning,
  Stethoscope,
  Target,
  Trash,
  UserCircle,
  Warning,
  Wind,
  X,
} from "@phosphor-icons/react";
import { references, scenarios, selectScenarioVariant } from "./data/scenarios.js";
import {
  examCategories,
  examDifficulties,
  examDomains,
  examReferences,
  examTracks,
  QUESTION_BANK_VERSION,
  questionBank,
} from "./data/question-bank.js";
import {
  analyzePerformance,
  createGuidedQuiz,
  createQuiz,
  getGuidedQuestionPlan,
  getQuestionCategoryInsights,
  gradeQuiz,
} from "./lib/question-engine.js";
import { ExamQuestion } from "./components/ExamQuestion.jsx";
import { AccountPanel } from "./components/AccountPanel.jsx";
import { NursingAssistant } from "./components/NursingAssistant.jsx";
import {
  getConfirmedAnswers,
  isExamSessionExpired,
  useExamSession,
} from "./hooks/useExamSession.js";
import {
  createEmptyProfile,
  getCompletedScenarioCount,
  getCompetencyInsights,
  getScenarioRecommendations,
  gradeAttempt,
  mergeAttempt,
  parseProfile,
  revalidateProfile,
  serializeProfile,
} from "./lib/learning-engine.js";
import { LOCAL_HISTORY_CLAIM_KEY, useAuthSession } from "./hooks/useAuthSession.js";
import {
  addScenarioAttemptMetadata,
  deleteCloudLearningHistory,
  ensureScenarioAttemptMetadata,
  retainAttemptsAfterHistoryClear,
  saveLearningAttempt,
  splitLearningRecords,
  syncLearningHistory,
  updateCloudLanguage,
} from "./lib/progress-repository.js";
import { signOutAndClearLocalLearningCache } from "./lib/local-learning-cache.js";

const PROFILE_STORAGE_KEY = "nursing-hypotheses.learning-profile.v1";
const EXAM_STORAGE_KEY = "nursing-hypotheses.exam-profile.v1";
const EXAM_SESSION_STORAGE_KEY = "nursing-hypotheses.active-exam-session.v1";
const CACHE_OWNER_STORAGE_KEY = "nursing-hypotheses.cache-owner.v1";
const EXAM_PROFILE_VERSION = 1;
const EXAM_SECONDS_PER_QUESTION = 90;
const QUIZ_SIZE_OPTIONS = [5, 10, 15, 25, 30];
const PRODUCT_NAME = { en: "Nursing Hypotheses", ar: "فرضيات تمريضية" };

function examSessionStorageKey(userId) {
  return userId ? `${EXAM_SESSION_STORAGE_KEY}.${userId}` : EXAM_SESSION_STORAGE_KEY;
}

function consumeLocalHistoryClaim(userId) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_HISTORY_CLAIM_KEY) ?? "null");
    const isFresh = Number.isFinite(parsed?.createdAt) && Date.now() - parsed.createdAt < 24 * 60 * 60 * 1000;
    if (!isFresh) {
      window.localStorage.removeItem(LOCAL_HISTORY_CLAIM_KEY);
      return false;
    }
    if (parsed.userId !== userId) return false;
    window.localStorage.removeItem(LOCAL_HISTORY_CLAIM_KEY);
    return true;
  } catch {
    return false;
  }
}

function profileStorageKeyForUser(userId) {
  return `${PROFILE_STORAGE_KEY}.user.${userId}`;
}

function examProfileStorageKeyForUser(userId) {
  return `${EXAM_STORAGE_KEY}.user.${userId}`;
}

const copy = {
  en: {
    skip: "Skip to main content", home: "Home", simulations: "Scenarios", scenarios: "Scenarios", questionBank: "Question bank", learning: "My learning", resources: "References", about: "About",
    menu: "Open navigation", closeMenu: "Close navigation", language: "Language", learner: "Learning account", localProfile: "Learning profile", localProfileShort: "Account",
    privacyStrip: "Draft content pending clinical, legal and Arabic review. Fictional education only — not patient care or emergency use. Never enter patient data; follow local policy.",
    simulation: "Educational simulation", eyebrow: "Clinical judgement, practised safely", heroTitle: "Learn to notice what matters — before the next decision.",
    heroBody: "Branching nursing scenarios for emergency, ward, paediatric, maternity and critical-care decisions. Each draft choice is explained in Arabic and English and names the source set used to author it.",
    explore: "Explore scenarios", continueLearning: "View my learning", evidenceLed: "Scenario-level evidence", evidenceLedBody: "Each scenario names the versioned source set used to author it.",
    bilingual: "Truly bilingual", bilingualBody: "Switch the complete experience without losing your place.", privateDemo: "Private by design", privateDemoBody: "Use device-only progress or sign in to sync minimal completed learning records.",
    scenariosCount: "authored scenarios", practiceContexts: "practice contexts", departmentsCount: "clinical areas", referencesCount: "authoritative sources", startFeatured: "Start featured case", featured: "Featured simulation", featuredKicker: "Emergency Department · 12 min",
    featuredBody: "An older adult arrives breathless. Prioritise assessment, recognise deterioration and deliver a safe handover through six decisions.",
    sourceSet: "Scenario-level source set", opensNewTab: "Opens in a new tab", scenarioNotFound: "This scenario could not be found.",
    howItWorks: "How the learning loop works", stepOne: "Read the changing clinical picture", stepOneBody: "Vital signs and the timeline update at every decision point.",
    stepTwo: "Commit to one nursing action", stepTwoBody: "Choose, confirm, then review immediate feedback and rationale.", stepThree: "Debrief your pattern", stepThreeBody: "See your score, safety flags and evidence-aware learning gaps.",
    learningNotCertification: "Scores support reflection only. They are not a competency assessment, credential, diagnosis or clinical instruction.",
    libraryEyebrow: "Scenario library", libraryTitle: "Choose a clinical situation to practise", libraryBody: "Each fictional case follows a changing patient journey. Decisions are scored for learning, then linked back to their rationale and source set.",
    allDepartments: "All clinical areas", allDifficulties: "All levels", department: "Clinical area", difficulty: "Level", duration: "Estimated time", decisions: "decisions", competencies: "Learning focus",
    start: "Start scenario", practiseAgain: "Practise again", completed: "Completed", noScenarios: "No scenarios match these filters.", resetFilters: "Reset filters",
    patientStatus: "Patient status", scenario: "Scenario", keyVitals: "Key vital signs", clinicalMoment: "Current clinical picture", step: "Step", of: "of", timeline: "Scenario timeline", current: "Current",
    questionIntro: "Select the best nursing response.", choiceGroup: "Response options", confirm: "Confirm selection", chooseFirst: "Choose one response before confirming.", nextDecision: "Next decision", viewDebrief: "View debrief",
    hypothesesTitle: "Prioritise the provided nursing hypotheses", hypothesesInstruction: "Use the active cues to rank each provided learning hypothesis for this moment.", hypothesis: "Learning hypothesis", relatedTo: "Related to", evidenceBy: "Supported by cues", priorityHigh: "High priority", priorityMedium: "Medium priority", priorityLow: "Low priority", selectPriority: "Select a priority", completeHypotheses: "Assign a priority to every learning hypothesis before confirming this decision.", hypothesisFeedback: "Hypothesis-priority review", expectedPriority: "Expected in this exercise", yourPriority: "Your ranking", learningHypothesisNote: "These are provided hypotheses for educational reasoning, not diagnoses or patient-care instructions.",
    selectionLocked: "Your answer is locked for this decision.", feedback: "Decision feedback", rationale: "Why this matters", safe: "Strong response", gap: "Learning gap", delay: "Delayed priority", unsafe: "Safety concern",
    progress: "Your progress", learningProgress: "Scenario progress", evidence: "Scenario source set", decisionRecorded: "Decision recorded", currentDecision: "Current decision", upcoming: "Upcoming", viewSources: "View scenario sources",
    important: "Important", localProtocol: "Use current local protocols, authorised orders and escalation pathways.", educationalOnly: "Educational simulation only. Not for real patient care, diagnosis, treatment, triage or emergency use. Never enter real patient information. In a real emergency, immediately contact your clinical team and local emergency service.",
    debriefEyebrow: "Scenario debrief", debriefTitle: "Review the decisions, not just the number", score: "Learning score", answered: "Decisions answered", safetyFlags: "Safety flags", band: "Learning reflection",
    strongFoundation: "Higher score in this attempt", progressing: "Mid-range score in this attempt", guidedReview: "Lower score in this attempt", safetyReview: "Safety choices to review", notStarted: "Not started", decisionReview: "Decision-by-decision review",
    yourChoice: "Your choice", points: "points", evidenceForCase: "Evidence used for this case", backLibrary: "Back to scenarios", tryAgain: "Try this scenario again",
    noAttempt: "No completed attempt was found for this scenario in your current learning profile.", openScenario: "Open scenario",
    learningEyebrow: "Your learning profile", learningTitle: "See your practice pattern", learningBody: "Your dashboard summarises completed fictional scenarios and highlights where more practice may help. Sign in to sync completed attempts across devices. It never certifies competence.",
    scenariosCompleted: "Unique scenarios completed", totalAttempts: "Completed attempts", averageScore: "Average learning score", competencyMap: "Learning insights",
    competencyBody: "A weakness label appears only after at least three decisions across two scenarios. Until then, the dashboard asks for more evidence.",
    insightInsufficient: "More evidence needed", insightWeakness: "Lower accuracy in this sample", insightDeveloping: "Mixed performance in this sample", insightStrength: "Higher accuracy in this sample", observations: "observations", across: "across", caseSingular: "scenario", casesPlural: "scenarios",
    safetyReviewNeeded: "Contains a safety-critical choice for review.", attemptsHistory: "Latest scenario results", review: "Review", emptyLearning: "Your learning dashboard will populate after your first completed scenario.", chooseFirstScenario: "Choose your first scenario",
    localStorageTitle: "How progress is stored", localStorageBody: "This browser keeps a local cache of your language, completed learning identifiers and active timed-question session. When you sign in, completed attempt identifiers and selected options sync to your private account; scores and learning signals are recalculated from the current authored bank. No patient data or free-text clinical response belongs here. Sign out before leaving a shared device.",
    clearHistory: "Clear learning history", clearHistoryConfirm: "Clear all completed learning attempts from this device and, when signed in, from your learning account? Your selected language and active practice sessions will be kept.", historyCleared: "Learning history cleared. Your language preference and active practice sessions were kept.", historyClearPending: "Learning history is being cleared. Your active practice is preserved; try finishing again in a moment.",
    questionBankEyebrow: "Independent nursing licensure practice", questionBankTitle: "Computer-based practice with transparent reasoning", questionBankBody: "Choose a nursing study path, then use guided practice or build your own fixed set. Every independently authored item includes bilingual reasoning and clinical sources.",
    selectTrack: "Study path", quizCategory: "Learning domain", quizDifficulty: "Difficulty", allCategories: "All learning domains", quizSize: "Questions", beginQuiz: "Begin practice", restartQuiz: "Start a new set", noQuestions: "No questions match these filters. Change a filter and try again.", noFreshGuidedQuestions: "You have completed every new question available for these filters. Change a filter or use manual practice to revisit authored items.",
    practiceMode: "Practice mode", guidedPractice: "Guided practice", guidedPracticeBody: "Builds one fixed set before you begin, weighting lower-accuracy domains while protecting variety and unseen questions.", manualPractice: "Build my own set", manualPracticeBody: "Uses only the study path, domain, difficulty and size you choose.", guidedPlanBaseline: "No completed evidence yet. This set will sample broadly to build a starting baseline.", guidedPlanEvidence: "The evidence is still limited. This set favours unseen questions and broader coverage before calling anything a weakness.", guidedPlanReview: "This set will increase practice in lower-accuracy domains supported by enough completed evidence.", guidedPlanDevelopment: "This set adds more practice in mixed-performance domains while keeping other areas in the rotation.", currentFocus: "Current guided focus", guidedFixedSetNotice: "Guided practice creates a fixed set before it starts. It is not computerized adaptive testing and does not estimate exam readiness.",
    question: "Question", selectOneAnswer: "Select one answer before locking it.", lockAnswer: "Lock answer", nextQuestion: "Next question", finishQuiz: "Finish and review", correctAnswer: "Correct response", incorrectAnswer: "Review this response", unansweredAtTimeout: "Unanswered when time ended", answerLocked: "Answer locked", answerRationale: "Answer rationale", questionSources: "Sources for this item", timeRemaining: "Time remaining", timeExpired: "Time ended — the set was submitted with unanswered items marked incorrect.", sessionSaved: "Progress and the absolute deadline are saved in this browser, so refreshing does not restart the timer.", focusedPracticeTitle: "10-question focused follow-up", focusedPracticeBody: "This new set starts with the lowest-scoring learning domains from this completed attempt and favours questions you have not just answered.", startFocusedSet: "Start focused set",
    quizProgress: "Question progress", quizScore: "Practice score", correctAnswers: "Correct answers", quizDebriefEyebrow: "Question-bank debrief", quizDebriefTitle: "Review what you understood and what to revisit", quizIncomplete: "Complete the current question set to see its debrief.", localExamProgress: "Question practice history", localExamProgressBody: "Completed question sets are kept on this device and sync to your private account when signed in. Scores describe this sample and do not predict an examination result, licensure or professional competence.", setsCompleted: "Completed sets", questionsAnswered: "Questions answered", categoryInsights: "Learning-domain review", morePractice: "Lower accuracy in this sample", developingKnowledge: "Mixed performance in this sample", strongKnowledge: "Higher accuracy in this sample", noExamAttempts: "Your first completed question set will appear here.",
    originalPracticeNotice: "Independent original practice only. No recalled, secure or official examination items are used, and scores do not predict an examination result, licensure or competence.", allDifficultyLevels: "All levels", questionsAvailable: "questions available", practiceSet: "Practice set", newVariation: "New variation", viewQuestionBank: "Open question bank", uniqueItems: "unique questions", completedSetsEvidence: "completed sets", earlyIndicator: "Early learning indicator", categoryEvidenceBody: "A learning-domain signal appears only after at least three unique questions across two completed sets. It describes this sample only.", contextVariant: "Practice context", contextDetails: "Context details", contextVariantNote: "Context changes presentation only; the draft clinical cues, scoring and safest response do not change.", guidedScenarioTitle: "Guided scenario order", guidedScenarioBody: "Completed decisions reorder the library so relevant lower-scoring or safety-flagged learning domains appear more often near the top. New scenarios remain in the mix.", recommendedNext: "Recommended next", recommendationExplore: "Broaden the baseline", recommendationEvidence: "Gather more evidence", recommendationDevelopment: "Practise mixed-performance areas", recommendationReview: "Revisit a lower-accuracy area", recommendationSafety: "Review a safety-critical choice", adaptiveLearningTitle: "Suggested next practice", adaptiveLearningBody: "These suggestions use your completed learning activity from this device and, when signed in, your synced account. They guide practice; they do not measure competence or predict an examination result.", openRecommendedScenario: "Open suggested scenario", startGuidedQuestions: "Start guided questions", examNonAffiliation: "Nursing Hypotheses is an independently developed educational resource. It is not issued, sponsored, endorsed, approved or administered by any nursing regulator, examination owner or test-delivery provider. It contains no recalled or secure examination items. Practice scores describe performance only in this question set and do not predict examination results, licensure or professional competence.",
    includedAccess: "Included practice",
    referencesEyebrow: "Evidence library", referencesTitle: "Go back to the source", referencesBody: "Scenarios use original educational wording and point to official publishers, regulators and professional organisations. Check the current version and your facility policy before practice.",
    source: "Publisher/source page", accessNote: "Access note", aboutEyebrow: "About the platform", aboutTitle: "A rehearsal space for clinical reasoning",
    aboutLead: "Nursing Hypotheses turns realistic but fictional moments into deliberate practice: notice, prioritise, act, reassess and explain.", purpose: "What it is for",
    purposeBody: "Self-directed nursing education, facilitated debrief and discussion of safe decision sequences across clinical areas.", method: "How it is built", methodBody: "Original branching cases, bilingual explanations, transparent scores and references mapped at scenario level.",
    boundaries: "Clinical boundaries", boundariesBody: "It does not replace supervision, local policy, formal education, professional assessment or real-time clinical judgement.", accountModel: "Prototype account model",
    accountModelBody: "Email accounts can sync a deliberately minimised learning history. Database row policies isolate each learner; the resulting scores remain formative and are never authoritative competency records.",
    editorial: "Evidence and editorial approach", editorialBody: "Guidance changes. Each scenario names its source set and uses cautious, non-prescriptive wording where local targets, devices, orders or escalation criteria differ.",
    footerLine: "Learn. Reason. Care.", privacy: "Privacy", terms: "Terms", contact: "Contact & safety", copyright: "Nursing Hypotheses. Educational beta.",
  },
  ar: {
    skip: "انتقل إلى المحتوى الرئيسي", home: "الرئيسية", simulations: "السيناريوهات", scenarios: "السيناريوهات", questionBank: "بنك الأسئلة", learning: "تعلّمي", resources: "المراجع", about: "عن المنصة",
    menu: "فتح قائمة التنقل", closeMenu: "إغلاق قائمة التنقل", language: "اللغة", learner: "حساب التعلم", localProfile: "ملف التعلم", localProfileShort: "الحساب",
    privacyStrip: "محتوى أولي بانتظار المراجعة السريرية والقانونية واللغوية العربية. تعليم خيالي فقط — ليس لرعاية المرضى أو الطوارئ. لا تُدخل بيانات مرضى واتبع السياسة المحلية.", simulation: "محاكاة تعليمية", eyebrow: "تدرّب على الحكم السريري بأمان",
    heroTitle: "تعلّم كيف تلاحظ المهم — قبل القرار التالي.", heroBody: "سيناريوهات تمريضية متفرعة لقرارات الطوارئ والأجنحة والأطفال والولادة والعناية الحرجة. كل اختيار أولي مشروح بالعربية والإنجليزية ويذكر مجموعة المصادر المستخدمة في تأليفه.",
    explore: "استكشف السيناريوهات", continueLearning: "اعرض تقدمي", evidenceLed: "أدلة على مستوى السيناريو", evidenceLedBody: "يسمي كل سيناريو مجموعة المصادر المؤرخة التي استُخدمت في تأليفه.", bilingual: "ثنائي اللغة بالكامل",
    bilingualBody: "بدّل التجربة كاملة من دون أن تفقد موضعك.", privateDemo: "خصوصية مقصودة", privateDemoBody: "استخدم التقدم المحلي فقط أو سجّل الدخول لمزامنة الحد الأدنى من المحاولات المكتملة.",
    scenariosCount: "سيناريوهات مؤلفة", practiceContexts: "سياقات تدريبية", departmentsCount: "مجالات سريرية", referencesCount: "مصدراً موثوقاً", startFeatured: "ابدأ الحالة المختارة", featured: "محاكاة مختارة", featuredKicker: "قسم الطوارئ · 12 دقيقة",
    featuredBody: "يصل بالغ كبير في السن يعاني ضيق التنفس. رتّب التقييم، وتعرّف على التدهور، وقدّم تسليماً آمناً عبر ستة قرارات.", sourceSet: "مجموعة مصادر السيناريو", opensNewTab: "يفتح في علامة تبويب جديدة", scenarioNotFound: "تعذر العثور على هذا السيناريو.", howItWorks: "كيف تعمل دورة التعلم",
    stepOne: "اقرأ الصورة السريرية المتغيرة", stepOneBody: "تتحدث العلامات الحيوية والخط الزمني عند كل نقطة قرار.", stepTwo: "التزم بإجراء تمريضي واحد", stepTwoBody: "اختر وأكّد، ثم راجع التغذية الراجعة والمبرر فوراً.",
    stepThree: "حلّل نمط قراراتك", stepThreeBody: "اطّلع على درجتك وتنبيهات السلامة وفجوات التعلم المرتبطة بالأدلة.", learningNotCertification: "الدرجات للتأمل التعليمي فقط، وليست تقييماً للكفاءة أو اعتماداً أو تشخيصاً أو توجيهاً سريرياً.",
    libraryEyebrow: "مكتبة السيناريوهات", libraryTitle: "اختر موقفاً سريرياً للتدرب", libraryBody: "تتبع كل حالة خيالية رحلة مريض متغيرة. تُقيّم القرارات للتعلم، ثم ترتبط بمبرراتها ومجموعة مصادرها.",
    allDepartments: "كل المجالات السريرية", allDifficulties: "كل المستويات", department: "المجال السريري", difficulty: "المستوى", duration: "الوقت المتوقع", decisions: "قرارات", competencies: "محور التعلم",
    start: "ابدأ السيناريو", practiseAgain: "تدرّب مجدداً", completed: "مكتمل", noScenarios: "لا توجد سيناريوهات مطابقة لهذه المرشحات.", resetFilters: "إعادة ضبط المرشحات",
    patientStatus: "حالة المريض", scenario: "السيناريو", keyVitals: "العلامات الحيوية الأساسية", clinicalMoment: "الصورة السريرية الحالية", step: "الخطوة", of: "من", timeline: "الخط الزمني للسيناريو", current: "الحالية",
    questionIntro: "اختر أفضل استجابة تمريضية.", choiceGroup: "خيارات الاستجابة", confirm: "تأكيد الاختيار", chooseFirst: "اختر استجابة واحدة قبل التأكيد.", nextDecision: "القرار التالي", viewDebrief: "عرض التحليل",
    hypothesesTitle: "ترتيب الفرضيات التمريضية المعروضة", hypothesesInstruction: "استخدم القرائن الحالية لترتيب كل فرضية تعليمية معروضة في هذه اللحظة.", hypothesis: "فرضية تعليمية", relatedTo: "مرتبطة بـ", evidenceBy: "تدعمها القرائن", priorityHigh: "أولوية عالية", priorityMedium: "أولوية متوسطة", priorityLow: "أولوية منخفضة", selectPriority: "حدد الأولوية", completeHypotheses: "حدّد أولوية لكل فرضية تعليمية قبل تأكيد هذا القرار.", hypothesisFeedback: "مراجعة ترتيب الفرضيات", expectedPriority: "المتوقع في هذا التمرين", yourPriority: "ترتيبك", learningHypothesisNote: "هذه فرضيات معروضة للاستدلال التعليمي وليست تشخيصات أو تعليمات لرعاية مريض.",
    selectionLocked: "تم تثبيت إجابتك لهذا القرار.", feedback: "التغذية الراجعة للقرار", rationale: "لماذا يهم هذا؟", safe: "استجابة قوية", gap: "فجوة تعلم", delay: "تأخير للأولوية", unsafe: "تنبيه سلامة",
    progress: "تقدمك", learningProgress: "تقدم السيناريو", evidence: "مجموعة مصادر السيناريو", decisionRecorded: "تم تسجيل القرار", currentDecision: "القرار الحالي", upcoming: "قادم", viewSources: "عرض مصادر السيناريو",
    important: "مهم", localProtocol: "استخدم البروتوكولات المحلية الحالية والأوامر المعتمدة ومسارات التصعيد.", educationalOnly: "محاكاة تعليمية فقط. ليست لرعاية مريض حقيقي أو التشخيص أو العلاج أو الفرز أو استخدام الطوارئ. لا تُدخل معلومات مريض حقيقي. في الطوارئ الحقيقية تواصل فوراً مع فريقك السريري وخدمة الطوارئ المحلية.",
    debriefEyebrow: "تحليل السيناريو", debriefTitle: "راجع القرارات، لا الرقم وحده", score: "درجة التعلم", answered: "القرارات المجاب عنها", safetyFlags: "تنبيهات السلامة", band: "انعكاس التعلم",
    strongFoundation: "درجة أعلى في هذه المحاولة", progressing: "درجة متوسطة في هذه المحاولة", guidedReview: "درجة أقل في هذه المحاولة", safetyReview: "اختيارات سلامة تحتاج مراجعة", notStarted: "لم يبدأ", decisionReview: "مراجعة كل قرار",
    yourChoice: "اختيارك", points: "نقطة", evidenceForCase: "الأدلة المستخدمة في هذه الحالة", backLibrary: "العودة إلى السيناريوهات", tryAgain: "أعد تجربة السيناريو", noAttempt: "لم نعثر على محاولة مكتملة لهذا السيناريو في ملف التعلم الحالي.", openScenario: "فتح السيناريو",
    learningEyebrow: "ملف تعلمك", learningTitle: "شاهد نمط تدريبك", learningBody: "تلخص لوحة التعلم السيناريوهات الخيالية المكتملة وتوضح أين قد يفيد مزيد من التدريب. سجّل الدخول لمزامنة المحاولات المكتملة بين الأجهزة، من دون اعتماد الكفاءة.",
    scenariosCompleted: "السيناريوهات الفريدة المكتملة", totalAttempts: "المحاولات المكتملة", averageScore: "متوسط درجة التعلم", competencyMap: "مؤشرات التعلم",
    competencyBody: "لا تظهر تسمية نقطة تركيز إلا بعد ثلاثة قرارات على الأقل عبر سيناريوهين. قبل ذلك تطلب اللوحة مزيداً من الأدلة.", insightInsufficient: "نحتاج أدلة أكثر", insightWeakness: "دقة أقل في هذه العينة", insightDeveloping: "أداء متباين في هذه العينة", insightStrength: "دقة أعلى في هذه العينة",
    observations: "ملاحظات", across: "عبر", caseSingular: "سيناريو", casesPlural: "سيناريوهات", safetyReviewNeeded: "يتضمن اختياراً حرجاً للسلامة يحتاج إلى مراجعة.", attemptsHistory: "أحدث نتائج السيناريوهات", review: "مراجعة",
    emptyLearning: "ستظهر بيانات لوحة التعلم بعد إكمال السيناريو الأول.", chooseFirstScenario: "اختر أول سيناريو", localStorageTitle: "كيف يُحفظ التقدم؟",
    localStorageBody: "يحتفظ هذا المتصفح بنسخة محلية من اللغة ومعرّفات التعلم المكتمل وجلسة الأسئلة المؤقتة النشطة. عند تسجيل الدخول، تتزامن مع حسابك الخاص معرّفات المحاولات المكتملة والخيارات المحددة، وتُعاد حساب الدرجات ومؤشرات التعلم من البنك المؤلف الحالي. لا تُدخل بيانات مرضى أو نصاً سريرياً حراً. سجّل الخروج قبل مغادرة جهاز مشترك.",
    clearHistory: "مسح سجل التعلم", clearHistoryConfirm: "هل تريد مسح جميع محاولات التعلم المكتملة من هذا الجهاز، ومن حساب التعلم أيضاً عند تسجيل الدخول؟ ستبقى اللغة المختارة وجلسات التدريب النشطة محفوظة.", historyCleared: "تم مسح سجل التعلم مع الاحتفاظ باللغة المختارة وجلسات التدريب النشطة.", historyClearPending: "يجري مسح سجل التعلم. جلسة التدريب النشطة محفوظة؛ حاول إنهاءها مجدداً بعد لحظات.",
    questionBankEyebrow: "تدريب مستقل على ترخيص التمريض", questionBankTitle: "تدريب محوسب مع شرح واضح للقرار", questionBankBody: "اختر مساراً دراسياً تمريضياً، ثم استخدم التدريب الموجّه أو كوّن مجموعة ثابتة بنفسك. لكل سؤال مؤلف بصورة مستقلة شرح ثنائي اللغة ومصادر سريرية.",
    selectTrack: "مسار الدراسة", quizCategory: "مجال التعلم", quizDifficulty: "الصعوبة", allCategories: "كل مجالات التعلم", quizSize: "عدد الأسئلة", beginQuiz: "ابدأ التدريب", restartQuiz: "ابدأ مجموعة جديدة", noQuestions: "لا توجد أسئلة مطابقة لهذه المرشحات. غيّر أحد المرشحات وحاول مجدداً.", noFreshGuidedQuestions: "أكملت كل الأسئلة الجديدة المتاحة لهذه المرشحات. غيّر أحد المرشحات أو استخدم التدريب اليدوي لمراجعة المواد المؤلفة.",
    practiceMode: "نمط التدريب", guidedPractice: "تدريب موجّه", guidedPracticeBody: "ينشئ مجموعة ثابتة قبل البدء، ويزيد وزن المجالات منخفضة الدقة مع الحفاظ على التنوع والأسئلة غير المجابة.", manualPractice: "أكوّن مجموعتي", manualPracticeBody: "يستخدم فقط المسار والمجال والصعوبة والحجم الذي تختاره.", guidedPlanBaseline: "لا توجد أدلة مكتملة بعد. ستأخذ هذه المجموعة عينة واسعة لبناء خط أساس أولي.", guidedPlanEvidence: "ما زالت الأدلة محدودة. تفضّل المجموعة الأسئلة غير المجابة والتغطية الأوسع قبل وصف أي مجال بأنه ضعف.", guidedPlanReview: "ستزيد هذه المجموعة التدريب في المجالات منخفضة الدقة التي يدعمها عدد كافٍ من المحاولات المكتملة.", guidedPlanDevelopment: "تضيف هذه المجموعة تدريباً أكثر في المجالات ذات الأداء المتفاوت، مع إبقاء بقية المجالات ضمن التناوب.", currentFocus: "محور التدريب الموجّه", guidedFixedSetNotice: "ينشئ التدريب الموجّه مجموعة ثابتة قبل أن تبدأ. وهو ليس اختباراً تكيفياً محوسباً ولا يقدّر الجاهزية للاختبار.",
    question: "السؤال", selectOneAnswer: "اختر إجابة واحدة قبل تثبيتها.", lockAnswer: "تثبيت الإجابة", nextQuestion: "السؤال التالي", finishQuiz: "إنهاء ومراجعة", correctAnswer: "استجابة صحيحة", incorrectAnswer: "راجع هذه الاستجابة", unansweredAtTimeout: "لم يُجب عنه عند انتهاء الوقت", answerLocked: "تم تثبيت الإجابة", answerRationale: "مبرر الإجابة", questionSources: "مصادر هذا السؤال", timeRemaining: "الوقت المتبقي", timeExpired: "انتهى الوقت — أُرسلت المجموعة واحتُسبت الأسئلة غير المجابة كإجابات غير صحيحة.", sessionSaved: "يُحفظ التقدم والموعد النهائي للعداد في هذا المتصفح، لذلك لا يعيد تحديث الصفحة بدء الوقت.", focusedPracticeTitle: "متابعة مركزة من 10 أسئلة", focusedPracticeBody: "تبدأ هذه المجموعة الجديدة بمجالات التعلم الأقل نتيجة في المحاولة المكتملة، وتفضّل الأسئلة التي لم تُجب عنها للتو.", startFocusedSet: "ابدأ المجموعة المركزة",
    quizProgress: "تقدم الأسئلة", quizScore: "درجة التدريب", correctAnswers: "الإجابات الصحيحة", quizDebriefEyebrow: "تحليل بنك الأسئلة", quizDebriefTitle: "راجع ما فهمته وما يحتاج إلى عودة", quizIncomplete: "أكمل مجموعة الأسئلة الحالية لعرض التحليل.", localExamProgress: "سجل تدريب الأسئلة", localExamProgressBody: "تُحفظ مجموعات الأسئلة المكتملة على هذا الجهاز وتتزامن مع حسابك الخاص عند تسجيل الدخول. تصف الدرجات أداء هذه العينة ولا تتنبأ بنتيجة اختبار أو ترخيص أو كفاءة مهنية.", setsCompleted: "المجموعات المكتملة", questionsAnswered: "الأسئلة المجاب عنها", categoryInsights: "مراجعة مجالات التعلم", morePractice: "دقة أقل في هذه العينة", developingKnowledge: "أداء متباين في هذه العينة", strongKnowledge: "دقة أعلى في هذه العينة", noExamAttempts: "ستظهر أول مجموعة أسئلة مكتملة هنا.",
    originalPracticeNotice: "تدريب مستقل ومؤلف أصلاً فقط. لا يستخدم أسئلة اختبار متذكَّرة أو سرية أو رسمية، ولا تتنبأ الدرجات بنتيجة اختبار أو ترخيص أو كفاءة.", allDifficultyLevels: "كل المستويات", questionsAvailable: "سؤالاً متاحاً", practiceSet: "مجموعة تدريب", newVariation: "تنويع جديد", viewQuestionBank: "فتح بنك الأسئلة", uniqueItems: "أسئلة فريدة", completedSetsEvidence: "مجموعات مكتملة", earlyIndicator: "مؤشر تعلم مبكر", categoryEvidenceBody: "لا يظهر مؤشر لمجال التعلم إلا بعد ثلاثة أسئلة فريدة على الأقل عبر مجموعتين مكتملتين، وهو يصف هذه العينة فقط.", contextVariant: "سياق التدريب", contextDetails: "تفاصيل السياق", contextVariantNote: "يغير السياق طريقة العرض فقط؛ ولا تتغير المؤشرات السريرية الأولية أو الدرجة أو الاستجابة الأكثر أماناً.", guidedScenarioTitle: "ترتيب موجّه للسيناريوهات", guidedScenarioBody: "تعيد القرارات المكتملة ترتيب المكتبة لتظهر مجالات التعلم ذات الدقة الأقل أو اختيارات السلامة قرب الأعلى بصورة أكثر تكراراً، مع إبقاء السيناريوهات الجديدة ضمن التناوب.", recommendedNext: "مقترح تالٍ", recommendationExplore: "توسيع خط الأساس", recommendationEvidence: "جمع أدلة إضافية", recommendationDevelopment: "التدرب على الأداء المتفاوت", recommendationReview: "مراجعة مجال منخفض الدقة", recommendationSafety: "مراجعة اختيار متعلق بالسلامة", adaptiveLearningTitle: "التدريب التالي المقترح", adaptiveLearningBody: "تستخدم هذه الاقتراحات نشاط التعلم المكتمل على هذا الجهاز، ومن الحساب المتزامن عند تسجيل الدخول. وهي توجه التدريب ولا تقيس الكفاءة أو تتنبأ بنتيجة اختبار.", openRecommendedScenario: "فتح السيناريو المقترح", startGuidedQuestions: "بدء أسئلة موجّهة", examNonAffiliation: "فرضيات تمريضية مورد تعليمي مطوّر بصورة مستقلة. لا يصدر عن أي جهة تنظيمية تمريضية أو مالك اختبار أو مزود تقديم اختبارات، ولا ترعاه أو تؤيده أو تعتمده أو تديره أيٌّ منها. ولا يتضمن أسئلة اختبار متذكَّرة أو سرية. تصف درجات التدريب أداء المتعلم في هذه المجموعة فقط، ولا تتنبأ بنتيجة اختبار أو بالحصول على ترخيص أو بالكفاءة المهنية.",
    includedAccess: "تدريب متاح",
    referencesEyebrow: "مكتبة الأدلة", referencesTitle: "ارجع إلى المصدر", referencesBody: "تستخدم السيناريوهات صياغة تعليمية أصلية وتحيل إلى ناشرين وجهات تنظيمية ومنظمات مهنية رسمية. تحقق من الإصدار الحالي وسياسة منشأتك قبل التطبيق.",
    source: "صفحة الناشر/المصدر", accessNote: "ملاحظة الوصول", aboutEyebrow: "عن المنصة", aboutTitle: "مساحة تدريب للاستدلال السريري", aboutLead: "تحوّل فرضيات تمريضية لحظات واقعية لكنها خيالية إلى تدريب مقصود: لاحظ، ورتّب الأولوية، وتدخل، وأعد التقييم، واشرح.",
    purpose: "لأي غرض؟", purposeBody: "للتعلم التمريضي الذاتي والتحليل الميسر ومناقشة تسلسل القرارات الآمنة عبر المجالات السريرية.", method: "كيف بُنيت؟", methodBody: "حالات متفرعة أصلية، وشروح ثنائية اللغة، ودرجات شفافة، ومراجع مرتبطة على مستوى السيناريو.",
    boundaries: "الحدود السريرية", boundariesBody: "لا تحل المنصة محل الإشراف أو السياسة المحلية أو التعليم الرسمي أو التقييم المهني أو الحكم السريري الفوري.", accountModel: "نموذج الحساب التجريبي",
    accountModelBody: "تستطيع حسابات البريد مزامنة سجل تعلم محدود عمداً. تعزل سياسات قاعدة البيانات صفوف كل متعلم، وتبقى الدرجات الناتجة تكوينية وليست سجلات كفاءة رسمية.",
    editorial: "منهج الأدلة والتحرير", editorialBody: "تتغير الإرشادات. يذكر كل سيناريو مصادره ويستخدم لغة حذرة وغير آمرة عندما تختلف الأهداف أو الأجهزة أو الأوامر أو معايير التصعيد محلياً.",
    footerLine: "تعلّم. استدل. اعتنِ.", privacy: "الخصوصية", terms: "الشروط", contact: "التواصل والسلامة", copyright: "فرضيات تمريضية. نسخة تعليمية تجريبية.",
  },
};

const POLICY_PAGES = {
  en: {
    privacy: {
      eyebrow: "Transparency for the free beta",
      title: "Privacy notice",
      lead: "This notice describes the current educational beta, including optional email accounts and learning-history sync. It remains a draft pending qualified Saudi legal and privacy review before public launch.",
      effective: "Effective 5 September 2026 · draft pending legal review",
      warning: "Do not enter names, record numbers, clinical notes or any information about a real patient anywhere in this website.",
      sections: [
        { title: "Responsible project contact", body: "The responsible project publisher and privacy contact for this beta is Abdulkarim alhejaili, reachable at Scenario.hq90@gmail.com. A formal service address and final controller disclosures remain for qualified counsel to confirm before public launch." },
        { title: "Information used", body: "Without an account, the browser stores language, scenario/question/option identifiers, completed attempts and the active timed session. If you create an account, Supabase processes your email and authentication records, and the site syncs only completed-attempt identifiers, selected option identifiers and completion times. Scores and learning-domain signals are recalculated from the current authored content. Do not enter patient data, clinical free text, payment data, licence numbers or employer information." },
        { title: "Device storage and account separation", body: "Browser storage is not encrypted and can be visible to anyone using the same browser profile. Signed-in learning rows are isolated by database row-level policies. Signing out removes the local learning cache for that account; on a shared device, sign out and clear browser site data. Authentication tokens are managed by the Supabase browser client and are never copied into the learning records." },
        { title: "Processors, location and technical records", body: "The private beta uses OpenAI Sites for page delivery and Supabase for authentication and account sync. The primary Supabase database is located in Frankfurt, Germany. Rights and support emails sent to Scenario.hq90@gmail.com are processed through Google Gmail; never send patient or confidential workplace data. Providers may process standard technical and security logs in additional locations under their own terms. A Saudi cross-border-transfer assessment, processor agreement review, Gmail retention decision and backup-deletion statement remain required before public launch." },
        { title: "AI learning assistant", body: "If you use the optional assistant, the free-text question and selected interface language are sent to the OpenAI API for answer generation and web search. The site sends store: false and does not add the question or answer to browser storage, the learning history or Supabase. OpenAI states that API data is not used to train its models by default unless the account opts in. Its default abuse-monitoring logs may contain prompts and responses and may be retained for up to 30 days unless approved data controls apply. Do not submit patient, workplace-confidential or examination-secure information. Opening a cited source also sends a request to that publisher." },
        { title: "External source links", body: "Opening a reference sends a request to the third-party publisher. That publisher receives technical data and applies its own privacy and cookie policies. Nursing Hypotheses does not control those services." },
        { title: "Purpose and retention", body: "The data is used only to provide the requested educational account, sync completed learning activity, preserve security and respond to support or rights requests. Device data remains until you clear learning history or browser site data. Synced learning rows remain until you clear them or request account deletion. Authentication data remains until the account is deleted. Provider security logs and backups follow provider retention settings and still require final operator documentation before public launch." },
        { title: "Your controls and requests", body: "The learning dashboard lets you download a copy of current learning data and clear completed learning history. For account access, correction or verified deletion, or to raise a privacy concern, email Scenario.hq90@gmail.com from the account address. The project aims to acknowledge privacy requests within five business days; applicable statutory deadlines and identity checks still govern the final response." },
      ],
    },
    terms: {
      eyebrow: "Rules for using the free beta",
      title: "Learning terms",
      lead: "These beta terms set educational and acceptable-use boundaries. They are a working draft and are not a substitute for advice from counsel in the launch jurisdictions.",
      effective: "Effective 5 September 2026 · draft pending legal review",
      warning: "Educational simulation only. Not for real patient care, diagnosis, treatment, triage or emergency use. In a real emergency, contact the responsible clinical team and local emergency service immediately.",
      sections: [
        { title: "Educational scope", body: "The website offers fictional scenarios and independently authored practice questions for self-study and facilitated discussion. It does not provide medical advice, professional supervision, a credential, continuing-education credit, licensure eligibility, a competency decision or a prediction of any examination result." },
        { title: "Clinical responsibility", body: "Current law, regulator requirements, facility policy, authorised orders, scope of practice, the patient's condition and the responsible team's judgement always take priority. Do not delay escalation or use this website during care of a real patient." },
        { title: "AI assistant limitations", body: "Assistant answers are generated automatically, may be incomplete or wrong, and are provided only for general learning. Review every linked source and current local policy. Do not use the assistant for a real patient's diagnosis, treatment, triage, medication dosing or emergency response, and do not submit recalled or secure examination content." },
        { title: "Independent question bank", body: "No recalled, secure or official examination item may be submitted, reconstructed, copied or requested. Similarities to common nursing topics, four-option formats or single-best-answer methods do not make this an official exam product. No regulator or examination owner issues, sponsors, endorses, approves or administers the website." },
        { title: "Acceptable use", body: "Use the beta for lawful personal learning or authorised teaching. Do not enter patient or confidential workplace data; bypass controls; scrape or republish the bank; interfere with service; impersonate a person or organisation; or use the material to provide unsupervised clinical instructions." },
        { title: "Content and external rights", body: "Original site text and presentation remain subject to their applicable rights. Linked publications, names and marks belong to their respective owners. A link is attribution and research traceability, not permission to copy or an endorsement." },
        { title: "Accounts and availability", body: "Optional accounts sync a learner's own formative history; they do not create a credential or verified score. The current project does not offer subscriptions, checkout or payment collection. Draft content may be corrected, withdrawn or unavailable without notice." },
        { title: "Audience and jurisdiction", body: "Accounts are intended only for people aged 18 or older. The initial audience is expected to include Saudi users, but governing-law, dispute and liability clauses remain open for qualified legal review before public launch." },
      ],
    },
    contact: {
      eyebrow: "Content, safety and rights",
      title: "Contact and safety reporting",
      lead: "Report a content, translation, accessibility, copyright or privacy concern to the responsible project contact.",
      effective: "Project contact · 5 September 2026",
      warning: "This email is not an emergency or clinical-advice channel. Never include patient or confidential workplace information.",
      email: "Scenario.hq90@gmail.com",
      sections: [
        { title: "What a report should include", body: "Identify the page, scenario or question; language; content version; and a concise description of the possible clinical, translation, accessibility, copyright or privacy issue. Do not include any patient, learner or confidential workplace information." },
        { title: "Urgent clinical situations", body: "This page is not monitored for emergencies. If a real person may be at risk, follow the authorised local emergency and escalation pathway now. Do not wait for a website response." },
        { title: "Response targets", body: "The project aims to acknowledge ordinary reports within five business days and review a credible urgent content-safety or rights takedown report within two business days. These are operational targets, not an emergency response promise. Final legal escalation and statutory response procedures remain pending qualified review." },
      ],
    },
  },
  ar: {
    privacy: {
      eyebrow: "الشفافية للنسخة التجريبية المجانية",
      title: "إشعار الخصوصية",
      lead: "يصف هذا الإشعار النسخة التعليمية التجريبية الحالية، بما في ذلك حسابات البريد الاختيارية ومزامنة سجل التعلم. ويظل مسودة بانتظار مراجعة قانونية وخصوصية سعودية مؤهلة قبل الإطلاق العام.",
      effective: "يسري من 5 سبتمبر 2026 · مسودة بانتظار المراجعة القانونية",
      warning: "لا تُدخل اسماً أو رقم ملف أو ملاحظة سريرية أو أي معلومات تخص مريضاً حقيقياً في أي موضع من هذا الموقع.",
      sections: [
        { title: "جهة اتصال المشروع المسؤولة", body: "الناشر المسؤول وجهة اتصال الخصوصية لهذه النسخة هو Abdulkarim alhejaili، ويمكن التواصل عبر Scenario.hq90@gmail.com. يبقى عنوان الخدمة الرسمي وإفصاحات المتحكم النهائية للتأكيد من مستشار مؤهل قبل الإطلاق العام." },
        { title: "المعلومات المستخدمة", body: "من دون حساب، يحفظ المتصفح اللغة ومعرّفات السيناريوهات والأسئلة والخيارات والمحاولات المكتملة والجلسة المؤقتة النشطة. عند إنشاء حساب، تعالج Supabase البريد وسجلات المصادقة، ويزامن الموقع فقط معرّفات المحاولات المكتملة والخيارات المحددة وأوقات الإكمال. تُعاد حساب الدرجات ومؤشرات مجالات التعلم من المحتوى المؤلف الحالي. لا تدخل بيانات مرضى أو نصاً سريرياً حراً أو بيانات دفع أو رقم ترخيص أو جهة عمل." },
        { title: "تخزين الجهاز وفصل الحسابات", body: "تخزين المتصفح غير مشفر وقد يراه من يستخدم ملف المتصفح نفسه. تعزل سياسات مستوى الصف سجلات التعلم الخاصة بكل حساب. يؤدي تسجيل الخروج إلى إزالة نسخة التعلم المحلية لذلك الحساب؛ وعلى الجهاز المشترك سجّل الخروج وامسح بيانات الموقع. يدير عميل Supabase رموز المصادقة ولا تُنسخ داخل سجلات التعلم." },
        { title: "المعالجون والموقع والسجلات التقنية", body: "تستخدم النسخة الخاصة OpenAI Sites لتقديم الصفحات وSupabase للمصادقة ومزامنة الحساب. تقع قاعدة بيانات Supabase الأساسية في فرانكفورت بألمانيا. وتُعالج رسائل الحقوق والدعم المرسلة إلى Scenario.hq90@gmail.com عبر Google Gmail؛ فلا ترسل بيانات مريض أو معلومات عمل سرية. وقد يعالج المزودون سجلات تقنية وأمنية معتادة في مواقع أخرى وفق شروطهم. يلزم قبل الإطلاق العام تقييم نقل البيانات عبر الحدود للسعودية ومراجعة اتفاقيات المعالجة وقرار الاحتفاظ في Gmail وبيان حذف النسخ الاحتياطية." },
        { title: "مساعد التعلم بالذكاء الاصطناعي", body: "إذا استخدمت المساعد الاختياري، يُرسل نص السؤال الحر ولغة الواجهة المحددة إلى واجهة OpenAI API لتوليد الإجابة والبحث على الويب. يرسل الموقع store: false ولا يضيف السؤال أو الإجابة إلى تخزين المتصفح أو سجل التعلم أو Supabase. وتوضح OpenAI أن بيانات API لا تُستخدم افتراضياً لتدريب نماذجها ما لم يفعّل الحساب المشاركة، لكن سجلات مراقبة إساءة الاستخدام الافتراضية قد تتضمن السؤال والإجابة وقد تُحتفظ حتى 30 يوماً ما لم تُطبق ضوابط بيانات معتمدة. لا ترسل بيانات مريض أو معلومات عمل سرية أو محتوى اختبار سرياً أو محمياً. كما يؤدي فتح مصدر مستشهد به إلى إرسال طلب إلى ناشره." },
        { title: "روابط المصادر الخارجية", body: "يؤدي فتح مرجع إلى إرسال طلب إلى موقع الناشر الخارجي. يستقبل ذلك الناشر بيانات تقنية ويطبق سياسة الخصوصية وملفات الارتباط الخاصة به. لا تتحكم «فرضيات تمريضية» في تلك الخدمات." },
        { title: "الغرض والاحتفاظ", body: "تُستخدم البيانات فقط لتقديم حساب التعلم المطلوب، ومزامنة النشاط المكتمل، والحفاظ على الأمان، والاستجابة للدعم أو طلبات الحقوق. تبقى بيانات الجهاز حتى تمسح سجل التعلم أو بيانات الموقع من المتصفح. وتبقى صفوف التعلم المزامنة حتى تمسحها أو تطلب حذف الحساب، بينما تبقى بيانات المصادقة حتى حذف الحساب. تخضع سجلات الأمان والنسخ الاحتياطية لإعدادات المزود، وما زال يلزم توثيقها تشغيلياً قبل الإطلاق العام." },
        { title: "ضوابطك وطلباتك", body: "تتيح لوحة التعلم تنزيل نسخة من بيانات التعلم الحالية ومسح سجل التعلم المكتمل. للوصول إلى الحساب أو تصحيحه أو حذفه بعد التحقق، أو لرفع ملاحظة خصوصية، راسل Scenario.hq90@gmail.com من بريد الحساب. يستهدف المشروع تأكيد استلام طلب الخصوصية خلال خمسة أيام عمل، مع بقاء المدد النظامية المطبقة والتحقق من الهوية حاكمة للاستجابة النهائية." },
      ],
    },
    terms: {
      eyebrow: "قواعد استخدام النسخة التجريبية المجانية",
      title: "شروط التعلم",
      lead: "تحدد هذه الشروط التجريبية الحدود التعليمية والاستخدام المقبول. وهي مسودة عمل وليست بديلاً عن استشارة قانونية في مناطق الإطلاق.",
      effective: "يسري من 5 سبتمبر 2026 · مسودة بانتظار المراجعة القانونية",
      warning: "محاكاة تعليمية فقط. ليست لرعاية مريض حقيقي أو التشخيص أو العلاج أو الفرز أو استخدام الطوارئ. في الطوارئ الحقيقية تواصل فوراً مع الفريق السريري المسؤول وخدمة الطوارئ المحلية.",
      sections: [
        { title: "النطاق التعليمي", body: "يقدم الموقع سيناريوهات خيالية وأسئلة تدريبية مؤلفة بصورة مستقلة للتعلم الذاتي والنقاش الميسّر. ولا يقدم نصيحة طبية أو إشرافاً مهنياً أو اعتماداً أو ساعات تعليم مستمر أو أهلية ترخيص أو قرار كفاءة أو توقعاً لنتيجة أي اختبار." },
        { title: "المسؤولية السريرية", body: "يتقدم دائماً النظام الحالي ومتطلبات الجهة المنظمة وسياسة المنشأة والأوامر المعتمدة ونطاق الممارسة وحالة المريض وحكم الفريق المسؤول. لا تؤخر التصعيد ولا تستخدم الموقع أثناء رعاية مريض حقيقي." },
        { title: "حدود مساعد الذكاء الاصطناعي", body: "تُنشأ إجابات المساعد آلياً وقد تكون ناقصة أو خاطئة، وهي للتعلم العام فقط. راجع كل مصدر مرتبط والسياسة المحلية الحالية. لا تستخدم المساعد لتشخيص مريض حقيقي أو علاجه أو فرزه أو حساب جرعته أو الاستجابة لطوارئ، ولا ترسل محتوى اختبار متذكراً أو سرياً أو محمياً." },
        { title: "بنك أسئلة مستقل", body: "يُحظر إرسال أو إعادة بناء أو نسخ أو طلب أي سؤال اختبار متذكَّر أو سري أو رسمي. ولا تجعل الموضوعات التمريضية الشائعة أو صيغة الخيارات الأربعة أو منهج أفضل إجابة واحدة هذا منتج اختبار رسمي. لا تصدر المنصة عن أي جهة تنظيمية أو مالك اختبار ولا ترعاها أو تؤيدها أو تعتمدها أو تديرها أيٌّ منها." },
        { title: "الاستخدام المقبول", body: "استخدم النسخة للتعلم الشخصي المشروع أو التعليم المصرح. لا تدخل بيانات مرضى أو بيانات عمل سرية؛ ولا تتجاوز الضوابط؛ ولا تجمع البنك آلياً أو تعيد نشره؛ ولا تعطل الخدمة؛ ولا تنتحل شخصاً أو جهة؛ ولا تستخدم المحتوى لتقديم توجيهات سريرية دون إشراف." },
        { title: "المحتوى وحقوق الغير", body: "يخضع نص الموقع الأصلي وعرضه للحقوق المطبقة. وتعود المنشورات والأسماء والعلامات المرتبطة إلى أصحابها. الرابط إسناد وتتبع بحثي وليس إذناً بالنسخ أو تأييداً للمنصة." },
        { title: "الحسابات والتوفر", body: "تزامن الحسابات الاختيارية سجل التعلم التكويني الخاص بالمتعلم؛ ولا تنشئ اعتماداً أو درجة موثقة. لا يقدم المشروع الحالي اشتراكات أو شراء أو تحصيل مدفوعات. وقد يُصحح المحتوى الأولي أو يُسحب أو يتعذر دون إشعار." },
        { title: "الجمهور والنطاق النظامي", body: "الحسابات مخصصة فقط لمن يبلغ 18 سنة أو أكثر. يُتوقع أن يشمل الجمهور الأول مستخدمين في السعودية، لكن بنود النظام الحاكم والنزاعات والمسؤولية ما تزال مفتوحة لمراجعة قانونية مؤهلة قبل الإطلاق العام." },
      ],
    },
    contact: {
      eyebrow: "المحتوى والسلامة والحقوق",
      title: "التواصل وبلاغات السلامة",
      lead: "أرسل بلاغاً عن مشكلة في المحتوى أو الترجمة أو إمكانية الوصول أو حقوق النشر أو الخصوصية إلى جهة اتصال المشروع المسؤولة.",
      effective: "جهة اتصال المشروع · 5 سبتمبر 2026",
      warning: "هذا البريد ليس قناة للطوارئ أو للاستشارة السريرية. لا ترسل أي بيانات مريض أو معلومات عمل سرية.",
      email: "Scenario.hq90@gmail.com",
      sections: [
        { title: "ماذا يتضمن البلاغ؟", body: "حدد الصفحة أو السيناريو أو السؤال، واللغة، وإصدار المحتوى، ووصفاً موجزاً للمشكلة السريرية أو اللغوية أو المتعلقة بالوصول أو حقوق النشر أو الخصوصية. لا ترفق أي معلومات مريض أو متعلم أو معلومات عمل سرية." },
        { title: "الحالات السريرية العاجلة", body: "هذه الصفحة غير مراقبة للطوارئ. إذا كان شخص حقيقي معرضاً للخطر فاتبع الآن مسار الطوارئ والتصعيد المحلي المعتمد. لا تنتظر رداً من الموقع." },
        { title: "أهداف الاستجابة", body: "يستهدف المشروع تأكيد استلام البلاغات العادية خلال خمسة أيام عمل، ومراجعة البلاغ الموثوق والعاجل المتعلق بسلامة المحتوى أو سحب مادة بسبب الحقوق خلال يومي عمل. هذه أهداف تشغيلية وليست وعداً بالاستجابة للطوارئ. تبقى إجراءات التصعيد القانوني والمدد النظامية بانتظار مراجعة مؤهلة." },
      ],
    },
  },
};

const NAV_ITEMS = [["home", "home", House], ["scenarios", "simulations", Exam], ["questions", "questionBank", ClipboardText], ["learning", "learning", ChartLineUp], ["resources", "resources", Books], ["about", "about", Info]];

function readProfileFromStorage(storageKey = PROFILE_STORAGE_KEY) {
  if (typeof window === "undefined") return ensureScenarioAttemptMetadata(revalidateProfile(parseProfile(""), scenarios));
  try {
    return ensureScenarioAttemptMetadata(
      revalidateProfile(parseProfile(window.localStorage.getItem(storageKey) ?? ""), scenarios),
    );
  } catch {
    return ensureScenarioAttemptMetadata(revalidateProfile(parseProfile(""), scenarios));
  }
}

function readProfile() {
  const profile = readProfileFromStorage();
  persistProfile(profile);
  return profile;
}

function persistProfile(profile, storageKey = PROFILE_STORAGE_KEY) {
  try { window.localStorage.setItem(storageKey, serializeProfile(profile)); } catch { /* Usable without persistence. */ }
}

function createEmptyExamProfile() {
  return { schemaVersion: EXAM_PROFILE_VERSION, attempts: [] };
}

function revalidateExamAttempt(value, index) {
  if (!value || !Array.isArray(value.questionIds) || !Array.isArray(value.decisions)) return null;
  const questions = value.questionIds
    .map((id) => questionBank.find((question) => question.id === id))
    .filter(Boolean);
  if (!questions.length || questions.length !== value.questionIds.length) return null;
  const answers = Object.fromEntries(
    value.decisions
      .filter((decision) => typeof decision?.questionId === "string" && typeof decision?.selectedOptionId === "string")
      .map((decision) => [decision.questionId, decision.selectedOptionId]),
  );
  const completionReason = value.completionReason === "time-expired" ? "time-expired" : "completed";
  const graded = gradeQuiz(questions, answers, { includeUnanswered: completionReason === "time-expired" });
  if (!graded.isComplete) return null;
  const allowedSelectionModes = new Set(["guided", "manual", "performance-focus"]);
  return {
    ...graded,
    id: typeof value.id === "string" ? value.id.slice(0, 100) : `restored-${index}`,
    examId: questions[0].examId,
    seed: typeof value.seed === "string" ? value.seed.slice(0, 120) : "restored",
    completedAt: typeof value.completedAt === "string" && !Number.isNaN(Date.parse(value.completedAt)) ? value.completedAt : graded.completedAt,
    selectionMode: allowedSelectionModes.has(value.selectionMode) ? value.selectionMode : "manual",
    completionReason,
    bankVersion: QUESTION_BANK_VERSION,
  };
}

function readExamProfileFromStorage(storageKey = EXAM_STORAGE_KEY) {
  if (typeof window === "undefined") return createEmptyExamProfile();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
    const attempts = (Array.isArray(parsed?.attempts) ? parsed.attempts : [])
      .slice(-100)
      .map(revalidateExamAttempt)
      .filter(Boolean);
    return { schemaVersion: EXAM_PROFILE_VERSION, attempts };
  } catch {
    return createEmptyExamProfile();
  }
}

function readExamProfile() {
  return readExamProfileFromStorage();
}

function persistExamProfile(profile, storageKey = EXAM_STORAGE_KEY) {
  try { window.localStorage.setItem(storageKey, JSON.stringify({ schemaVersion: EXAM_PROFILE_VERSION, attempts: profile.attempts.slice(-100) })); } catch { /* Usable without persistence. */ }
}

function createScenarioSession(scenarioId = null, orderSeed = 0) {
  const scenario = scenarios.find((item) => item.id === scenarioId);
  const variant = scenario ? selectScenarioVariant(scenario, orderSeed) : null;
  return { scenarioId, stepIndex: 0, answers: {}, confirmedStepId: null, notice: "", orderSeed, variantId: variant?.id ?? null, submitted: false };
}

function parseRoute() {
  const [page = "home", id = ""] = window.location.hash.replace(/^#\/?/, "").split("/");
  const allowed = new Set(["home", "scenarios", "scenario", "result", "questions", "learning", "resources", "about", "privacy", "terms", "contact"]);
  return allowed.has(page) ? { page, id } : { page: "home", id: "" };
}

function localize(value, lang) { return value && typeof value === "object" ? value[lang] || value.en || value.ar || "" : String(value ?? ""); }
function formatNumber(value, lang, options) { return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", options).format(value); }
function formatCountdown(totalSeconds, lang) {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  const locale = lang === "ar" ? "ar-SA" : "en-US";
  const twoDigits = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false });
  return `${twoDigits.format(minutes)}:${twoDigits.format(seconds)}`;
}
function localizeVitalValue(value, lang) {
  if (value && typeof value === "object") return localize(value, lang);
  if (lang !== "ar") return value;
  return { Alert: "واعٍ", Pacing: "يتحرك بقلق", None: "لا يوجد", "Alert, dizzy": "واعٍ مع دوار", Confused: "مشوش" }[value] || value;
}
function routeSection(route) {
  if (route.page === "scenario" || route.page === "result") return "scenarios";
  if (route.page === "questions") return "questionBank";
  return route.page;
}
function scoreBandKey(band) { return { "strong-foundation": "strongFoundation", progressing: "progressing", "guided-review": "guidedReview", "safety-review": "safetyReview", "not-started": "notStarted" }[band] || "guidedReview"; }
function classificationIcon(value) { return value === "safe" ? CheckCircle : value === "unsafe" ? ShieldWarning : value === "delay" ? Clock : Target; }
const scenarioRecommendationCopy = {
  explore: "recommendationExplore",
  "evidence-building": "recommendationEvidence",
  "targeted-development": "recommendationDevelopment",
  "targeted-review": "recommendationReview",
  "safety-review": "recommendationSafety",
};
const guidedPlanCopy = {
  baseline: "guidedPlanBaseline",
  "evidence-building": "guidedPlanEvidence",
  "targeted-development": "guidedPlanDevelopment",
  "targeted-review": "guidedPlanReview",
};
function vitalIcon(label) {
  const english = label?.en?.toLowerCase?.() || "";
  if (english.includes("spo2") || english.includes("oxygen")) return Gauge;
  if (english.includes("respiratory")) return Wind;
  if (english.includes("blood pressure")) return Drop;
  if (english.includes("conscious") || english.includes("pain") || english.includes("temperature")) return Brain;
  return Heartbeat;
}

function stableHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableShuffle(items, seed) {
  const ordered = [...items];
  let state = stableHash(seed) || 1;
  for (let index = ordered.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  }
  return ordered;
}

function seededIndex(seed, length) {
  if (length <= 1) return 0;
  const state = (Math.imul(stableHash(seed) || 1, 1664525) + 1013904223) >>> 0;
  return state % length;
}

export function deterministicSafePositions(scenario, orderSeed) {
  const positionCount = Math.max(1, ...scenario.steps.map((step) => step.choices.length));
  const counts = Array(positionCount).fill(0);

  return scenario.steps.map((step, stepIndex) => {
    const seed = `${scenario.id}:${step.id}:${orderSeed}:safe-position`;
    const independentTarget = seededIndex(seed, positionCount);
    const softCap = Math.min(
      Math.ceil(scenario.steps.length / 2),
      Math.max(2, Math.ceil((stepIndex + 1) * 0.6)),
    );
    let target = independentTarget;

    if (counts[independentTarget] >= softCap) {
      const alternatives = counts
        .map((count, position) => ({ count, position }))
        .filter(({ count, position }) => position !== independentTarget && count < softCap)
        .map(({ position }) => position);
      if (alternatives.length) target = alternatives[seededIndex(`${seed}:cap-fallback`, alternatives.length)];
    }

    counts[target] += 1;
    return target;
  });
}

function stableChoiceOrder(choices, seed, safeTargetPosition) {
  const ordered = stableShuffle(choices, seed);
  const safeIndex = ordered.findIndex((choice) => choice.classification === "safe");
  const target = safeTargetPosition % ordered.length;
  if (safeIndex >= 0 && safeIndex !== target) {
    [ordered[safeIndex], ordered[target]] = [ordered[target], ordered[safeIndex]];
  }
  return ordered;
}

function AppLink({ to, className = "", children, onNavigate, ...props }) {
  return <a href={`#/${to}`} className={className} onClick={() => onNavigate?.()} {...props}>{children}</a>;
}

function SectionIntro({ eyebrow, title, body }) {
  return <header className="section-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{body ? <p className="section-lead">{body}</p> : null}</header>;
}

function Header({ lang, setLanguage, route, menuOpen, setMenuOpen, t, auth, syncStatus }) {
  const active = routeSection(route);
  const accountLabel = auth.user?.email ?? t("learner");
  const accountStatus = auth.user
    ? syncStatus === "syncing"
      ? (lang === "ar" ? "جارٍ التزامن" : "Syncing")
      : syncStatus === "error"
        ? (lang === "ar" ? "محفوظ محلياً" : "Saved locally")
        : (lang === "ar" ? "متزامن" : "Synced")
    : t("localProfileShort");
  return <>
    <a
      className="skip-link"
      href="#main-content"
      onClick={(event) => {
        event.preventDefault();
        const main = document.getElementById("main-content");
        main?.scrollIntoView({ block: "start" });
        window.setTimeout(() => main?.focus({ preventScroll: true }), 0);
      }}
    >
      {t("skip")}
    </a>
    <header className="site-header">
      <div className="header-inner">
        <AppLink to="home" className="brand" onNavigate={() => setMenuOpen(false)} aria-label={PRODUCT_NAME[lang]}>
          <span className="brand-mark" aria-hidden="true"><Heartbeat size={31} /></span>
          <span className="brand-copy"><span className="brand-name"><span lang="ar">فرضيات تمريضية</span><span className="brand-divider">|</span><span lang="en">Nursing Hypotheses</span></span><span className="brand-tagline">{t("footerLine")}</span></span>
        </AppLink>
        <nav className="desktop-nav" aria-label={lang === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
          {NAV_ITEMS.map(([path, label]) => <AppLink key={path} to={path} className={active === path ? "active" : ""} aria-current={active === path ? "page" : undefined}>{t(label)}</AppLink>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label={t("language")} role="group"><Globe size={19} aria-hidden="true" /><button type="button" className={lang === "ar" ? "selected" : ""} aria-pressed={lang === "ar"} onClick={() => setLanguage("ar")} lang="ar">العربية</button><button type="button" className={lang === "en" ? "selected" : ""} aria-pressed={lang === "en"} onClick={() => setLanguage("en")} lang="en">English</button></div>
          <AppLink to="learning" className="profile-link" aria-label={`${accountLabel} — ${accountStatus}`}><UserCircle size={31} aria-hidden="true" /><span><strong>{accountLabel}</strong><small>{accountStatus}</small></span></AppLink>
          <button type="button" className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t("closeMenu") : t("menu")}>{menuOpen ? <X size={25} /> : <List size={25} />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${menuOpen ? "open" : ""}`} aria-label={lang === "ar" ? "تنقل الهاتف" : "Mobile navigation"}>
        {NAV_ITEMS.map(([path, label, Icon]) => <AppLink key={path} to={path} onNavigate={() => setMenuOpen(false)} className={active === path ? "active" : ""} aria-current={active === path ? "page" : undefined}><Icon size={21} aria-hidden="true" /><span>{t(label)}</span></AppLink>)}
      </nav>
    </header>
    <div className="safety-strip" role="note"><ShieldWarning size={18} weight="fill" aria-hidden="true" /><span>{t("privacyStrip")}</span></div>
  </>;
}

function HomePage({ lang, t, onStart, profile }) {
  const featured = scenarios[0];
  const completedCount = getCompletedScenarioCount(profile);
  const departmentCount = new Set(scenarios.map((scenario) => scenario.departmentId)).size;
  const contextCount = scenarios.reduce((total, scenario) => total + Math.max(1, scenario.contextVariants?.length || 0), 0);
  return <>
    <section className="hero-band"><div className="hero-content">
      <div className="hero-copy"><p className="eyebrow light"><Stethoscope size={18} weight="bold" /> {t("eyebrow")}</p><h1>{t("heroTitle")}</h1><p>{t("heroBody")}</p>
        <div className="hero-actions"><AppLink to="scenarios" className="button button-primary">{t("explore")} {lang === "ar" ? <ArrowLeft size={19} /> : <ArrowRight size={19} />}</AppLink><AppLink to="learning" className="button button-ghost-light"><ChartLineUp size={19} /> {t("continueLearning")}{completedCount > 0 ? <span className="button-count">{formatNumber(completedCount, lang)}</span> : null}</AppLink></div>
      </div>
      <div className="featured-case" aria-label={t("featured")}><div className="featured-topline"><span>{t("featured")}</span><FirstAidKit size={26} weight="duotone" /></div><p className="featured-kicker">{t("featuredKicker")}</p><h2>{localize(featured.title, lang)}</h2><p>{t("featuredBody")}</p>
        <div className="mini-vitals" aria-label={t("keyVitals")}>{featured.steps[1].vitals.slice(0, 3).map((vital) => <span key={vital.label.en}><small>{localize(vital.label, lang)}</small><strong>{localizeVitalValue(vital.value, lang)}</strong></span>)}</div>
        <button type="button" className="text-action light-action" onClick={() => onStart(featured.id)}><Play size={18} weight="fill" /> {t("startFeatured")}</button>
      </div>
    </div></section>
    <section className="home-stats" aria-label={lang === "ar" ? "محتوى المنصة" : "Platform content"}><div><strong>{formatNumber(contextCount, lang)}</strong><span>{t("practiceContexts")}</span></div><div><strong>{formatNumber(departmentCount, lang)}</strong><span>{t("departmentsCount")}</span></div><div><strong>{formatNumber(allQuestionReferences.length, lang)}</strong><span>{t("referencesCount")}</span></div></section>
    <section className="trust-band"><div className="trust-item"><BookOpen size={29} weight="duotone" /><div><h2>{t("evidenceLed")}</h2><p>{t("evidenceLedBody")}</p></div></div><div className="trust-item"><Globe size={29} weight="duotone" /><div><h2>{t("bilingual")}</h2><p>{t("bilingualBody")}</p></div></div><div className="trust-item"><LockKey size={29} weight="duotone" /><div><h2>{t("privateDemo")}</h2><p>{t("privateDemoBody")}</p></div></div></section>
    <section className="content-section learning-loop"><header className="loop-heading"><p className="eyebrow">{t("simulation")}</p><h2>{t("howItWorks")}</h2></header><ol className="loop-list"><li><span>01</span><div><h3>{t("stepOne")}</h3><p>{t("stepOneBody")}</p></div></li><li><span>02</span><div><h3>{t("stepTwo")}</h3><p>{t("stepTwoBody")}</p></div></li><li><span>03</span><div><h3>{t("stepThree")}</h3><p>{t("stepThreeBody")}</p></div></li></ol><div className="boundary-note"><Info size={22} weight="fill" /><p>{t("learningNotCertification")}</p></div></section>
  </>;
}

function ScenarioLibrary({ lang, t, profile, onStart }) {
  const [department, setDepartment] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const departments = useMemo(() => { const map = new Map(); scenarios.forEach((item) => map.set(item.departmentId, item.department)); return [...map.entries()]; }, []);
  const difficulties = useMemo(() => { const map = new Map(); scenarios.forEach((item) => map.set(item.difficultyId, item.difficulty)); return [...map.entries()]; }, []);
  const completedIds = useMemo(() => new Set(profile.attempts.filter((item) => item.isComplete).map((item) => item.scenarioId)), [profile]);
  const recommendations = useMemo(
    () => getScenarioRecommendations(profile, scenarios, { limit: scenarios.length }),
    [profile],
  );
  const recommendationById = useMemo(
    () => new Map(recommendations.map((item, index) => [item.scenarioId, { ...item, rank: index }])),
    [recommendations],
  );
  const filtered = scenarios
    .filter((item) => (department === "all" || item.departmentId === department) && (difficulty === "all" || item.difficultyId === difficulty))
    .sort((left, right) => (recommendationById.get(left.id)?.rank ?? 999) - (recommendationById.get(right.id)?.rank ?? 999));
  const firstRecommendation = filtered.length ? recommendationById.get(filtered[0].id) : null;
  return <div className="page-container"><SectionIntro eyebrow={t("libraryEyebrow")} title={t("libraryTitle")} body={t("libraryBody")} />
    <section className="guided-practice-banner" aria-labelledby="guided-scenario-title"><Brain size={31} weight="duotone" aria-hidden="true" /><div><h2 id="guided-scenario-title">{t("guidedScenarioTitle")}</h2><p>{t("guidedScenarioBody")}</p>{firstRecommendation ? <strong>{t(scenarioRecommendationCopy[firstRecommendation.reason])}: {localize(filtered[0].title, lang)}</strong> : null}</div>{filtered[0] ? <button type="button" className="button button-secondary" onClick={() => onStart(filtered[0].id)}>{t("openRecommendedScenario")}</button> : null}</section>
    <div className="filter-bar" aria-label={lang === "ar" ? "مرشحات السيناريو" : "Scenario filters"}>
      <label><span>{t("department")}</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="all">{t("allDepartments")}</option>{departments.map(([id, label]) => <option key={id} value={id}>{localize(label, lang)}</option>)}</select></label>
      <label><span>{t("difficulty")}</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="all">{t("allDifficulties")}</option>{difficulties.map(([id, label]) => <option key={id} value={id}>{localize(label, lang)}</option>)}</select></label>
      <div className="filter-result"><strong>{formatNumber(filtered.length, lang)}</strong><span>{t("scenariosCount")}</span></div>
    </div>
    {filtered.length > 0 ? <div className="scenario-list">{filtered.map((scenario, index) => { const completed = completedIds.has(scenario.id); const recommendation = recommendationById.get(scenario.id); return <article className="scenario-row" key={scenario.id}>
      <div className="scenario-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div><div className="scenario-main"><div className="scenario-meta"><span><Hospital size={16} />{localize(scenario.department, lang)}</span><span><Target size={16} />{localize(scenario.difficulty, lang)}</span><span><Clock size={16} />{localize(scenario.duration, lang)}</span><span><Pulse size={16} />{formatNumber(Math.max(1, scenario.contextVariants?.length || 0), lang)} {t("practiceContexts")}</span><AccessBadge t={t} />{recommendation?.rank < 3 ? <span className="recommended-badge"><Brain size={15} weight="fill" />{t("recommendedNext")} · {t(scenarioRecommendationCopy[recommendation.reason])}</span> : null}{completed ? <span className="completed-badge"><CheckCircle size={16} weight="fill" />{t("completed")}</span> : null}</div><h2>{localize(scenario.title, lang)}</h2><p>{localize(scenario.summary, lang)}</p><div className="competency-chips" aria-label={t("competencies")}>{scenario.competencies.slice(0, 4).map((item) => <span key={item.slug}>{localize(item.label, lang)}</span>)}</div></div>
      <div className="scenario-action"><span className="decision-count"><strong>{formatNumber(scenario.steps.length, lang)}</strong>{t("decisions")}</span><button type="button" className="button button-secondary" onClick={() => onStart(scenario.id)}><Play size={17} weight="fill" /> {completed ? t("practiseAgain") : t("start")}</button></div>
    </article>; })}</div> : <div className="empty-state"><Exam size={43} weight="duotone" /><h2>{t("noScenarios")}</h2><button type="button" className="button button-secondary" onClick={() => { setDepartment("all"); setDifficulty("all"); }}>{t("resetFilters")}</button></div>}
  </div>;
}

function ProgressSteps({ stepIndex, count, lang, t }) {
  const progressLabel = `${t("step")} ${formatNumber(stepIndex + 1, lang)} ${t("of")} ${formatNumber(count, lang)}`;
  return <div className="step-progress" role="progressbar" aria-label={progressLabel} aria-valuemin="1" aria-valuemax={count} aria-valuenow={stepIndex + 1} aria-valuetext={progressLabel}><strong>{t("step")} <span>{formatNumber(stepIndex + 1, lang)}</span> <small>{t("of")} {formatNumber(count, lang)}</small></strong><ol>{Array.from({ length: count }, (_, index) => <li key={index} className={index < stepIndex ? "done" : index === stepIndex ? "active" : ""} aria-current={index === stepIndex ? "step" : undefined}><span>{index < stepIndex ? <Check size={14} weight="bold" /> : formatNumber(index + 1, lang)}</span></li>)}</ol></div>;
}

function PatientRail({ scenario, step, lang, t }) {
  return <aside className="patient-rail" aria-labelledby="patient-status-title"><div className="rail-heading"><h2 id="patient-status-title">{t("patientStatus")}</h2></div><div className="scenario-identity"><span>{t("scenario")}</span><strong>{localize(scenario.department, lang)}</strong><p>{localize(scenario.title, lang)}</p></div><div className="rail-divider" /><h3>{t("keyVitals")}</h3><dl className="vital-list">{step.vitals.map((vital) => { const Icon = vitalIcon(vital.label); return <div className="vital-item" key={vital.label.en}><Icon size={34} weight="duotone" aria-hidden="true" /><div><dt>{localize(vital.label, lang)}</dt><dd><strong>{localizeVitalValue(vital.value, lang)}</strong> <span>{localize(vital.unit, lang)}</span></dd></div></div>; })}</dl><div className="rail-disclaimer"><ShieldWarning size={19} weight="fill" /><p>{t("educationalOnly")}</p></div></aside>;
}

function LearningRail({ scenario, stepIndex, lang, t }) {
  const percentage = Math.round(((stepIndex + 1) / scenario.steps.length) * 100);
  const caseReferences = scenario.referenceIds.map((id) => references.find((reference) => reference.id === id)).filter(Boolean);
  return <aside className="learning-rail" aria-labelledby="progress-title"><div className="rail-heading"><h2 id="progress-title">{t("progress")}</h2></div><h3>{t("learningProgress")}</h3><div className="progress-meter" role="progressbar" aria-label={t("learningProgress")} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percentage}><span style={{ width: `${percentage}%` }} /></div><div className="progress-copy"><strong>{formatNumber(percentage, lang)}%</strong><span>{t("step")} {formatNumber(stepIndex + 1, lang)} {t("of")} {formatNumber(scenario.steps.length, lang)}</span></div><div className="rail-divider" /><h3>{t("evidence")}</h3><ol className="evidence-steps">{scenario.steps.map((step, index) => <li key={step.id} className={index < stepIndex ? "done" : index === stepIndex ? "active" : ""}><span>{index < stepIndex ? <CheckCircle size={21} weight="fill" /> : <ClipboardText size={21} weight="duotone" />}</span><div><strong>{localize(step.time, lang)}</strong><small>{index < stepIndex ? t("decisionRecorded") : index === stepIndex ? t("currentDecision") : t("upcoming")}</small></div></li>)}</ol><div className="evidence-box"><BookOpen size={25} weight="duotone" /><div><h3>{t("evidence")}</h3><p>{formatNumber(caseReferences.length, lang)} {t("referencesCount")}</p><AppLink to="resources" className="inline-link">{t("viewSources")} {lang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}</AppLink></div></div><div className="protocol-box"><Warning size={24} weight="fill" /><div><h3>{t("important")}</h3><p>{t("localProtocol")}</p></div></div></aside>;
}

function ScenarioContext({ variant, lang, t }) {
  if (!variant) return null;
  return <aside className="scenario-context" aria-label={t("contextVariant")}><div className="context-heading"><Pulse size={21} weight="duotone" aria-hidden="true" /><div><span>{t("contextVariant")}</span><strong>{localize(variant.label, lang)}</strong></div></div><dl>{variant.changes.map((change) => <div key={change.id}><dt>{localize(change.label, lang)}</dt><dd>{localize(change.value, lang)}</dd></div>)}</dl><details className="context-details"><summary>{t("contextDetails")}</summary><p>{localize(variant.setup, lang)}</p><small><Info size={14} weight="fill" aria-hidden="true" />{t("contextVariantNote")}</small></details></aside>;
}

const HYPOTHESIS_PRIORITY_COPY = {
  high: "priorityHigh",
  medium: "priorityMedium",
  low: "priorityLow",
};

function hypothesisAnswerKey(scenarioId, hypothesisId) {
  return `hypothesis:${scenarioId}:${hypothesisId}`;
}

function HypothesisExercise({ scenario, lang, t, answers, confirmed, onChange }) {
  if (!Array.isArray(scenario.hypotheses) || scenario.hypotheses.length === 0) return null;
  return <section className="hypothesis-exercise" aria-labelledby="hypotheses-title">
    <div className="hypothesis-heading"><Brain size={30} weight="duotone" aria-hidden="true" /><div><p className="eyebrow">{t("hypothesisFeedback")}</p><h2 id="hypotheses-title">{t("hypothesesTitle")}</h2><p>{t("hypothesesInstruction")}</p></div></div>
    <p className="hypothesis-boundary"><ShieldWarning size={17} weight="fill" aria-hidden="true" />{t("learningHypothesisNote")}</p>
    <div className="hypothesis-grid">{scenario.hypotheses.map((hypothesis, index) => {
      const answerKey = hypothesisAnswerKey(scenario.id, hypothesis.id);
      const selectedPriority = answers[answerKey] ?? "";
      const isCorrect = confirmed && selectedPriority === hypothesis.correctPriority;
      return <article className={`hypothesis-card ${confirmed ? (isCorrect ? "safe" : "gap") : ""}`} key={hypothesis.id}>
        <span className="hypothesis-index">{t("hypothesis")} {formatNumber(index + 1, lang)}</span>
        <h3>{localize(hypothesis.problem, lang)}</h3>
        <dl><div><dt>{t("relatedTo")}</dt><dd>{localize(hypothesis.etiology, lang)}</dd></div><div><dt>{t("evidenceBy")}</dt><dd>{localize(hypothesis.signs, lang)}</dd></div></dl>
        <label><span>{t("yourPriority")}</span><select value={selectedPriority} disabled={confirmed} onChange={(event) => onChange(answerKey, event.target.value)} required><option value="">— {t("selectPriority")} —</option><option value="high">{t("priorityHigh")}</option><option value="medium">{t("priorityMedium")}</option><option value="low">{t("priorityLow")}</option></select></label>
        {confirmed ? <div className="hypothesis-result" role="status"><strong>{isCorrect ? t("safe") : t("gap")}</strong><span>{t("expectedPriority")}: {t(HYPOTHESIS_PRIORITY_COPY[hypothesis.correctPriority])}</span><p>{localize(hypothesis.rationale, lang)}</p></div> : null}
      </article>;
    })}</div>
  </section>;
}

function ScenarioPage({ scenarioId, lang, t, session, setSession, onComplete }) {
  const scenario = scenarios.find((item) => item.id === scenarioId);
  if (!scenario) {
    return <div className="page-container compact-page"><div className="empty-state"><Exam size={46} weight="duotone" /><h1>{t("scenarioNotFound")}</h1><AppLink className="button button-primary" to="scenarios">{t("backLibrary")}</AppLink></div></div>;
  }
  return <ScenarioExperience scenario={scenario} lang={lang} t={t} session={session} setSession={setSession} onComplete={onComplete} />;
}

function ScenarioExperience({ scenario, lang, t, session, setSession, onComplete }) {
  const stepIndex = session.scenarioId === scenario.id ? Math.min(session.stepIndex, scenario.steps.length - 1) : 0;
  const step = scenario.steps[stepIndex];
  const selectedId = session.answers[step.id] || "";
  const confirmed = session.confirmedStepId === step.id;
  const hypothesesShown = stepIndex === 0 && Array.isArray(scenario.hypotheses) ? scenario.hypotheses : [];
  const selectedChoice = step.choices.find((choice) => choice.id === selectedId);
  const variant = scenario.contextVariants?.find((item) => item.id === session.variantId) ?? selectScenarioVariant(scenario, session.orderSeed ?? 0);
  const safePositions = useMemo(
    () => deterministicSafePositions(scenario, session.orderSeed ?? 0),
    [scenario, session.orderSeed],
  );
  const orderedChoices = useMemo(
    () => stableChoiceOrder(
      step.choices,
      `${scenario.id}:${step.id}:${session.orderSeed ?? 0}`,
      safePositions[stepIndex],
    ),
    [safePositions, scenario.id, session.orderSeed, step, stepIndex],
  );
  const alternateLang = lang === "ar" ? "en" : "ar";
  const caseReferenceCount = scenario.referenceIds.length;
  const stepReferences = (step.referenceIds ?? scenario.referenceIds)
    .map((id) => references.find((reference) => reference.id === id))
    .filter(Boolean);
  const questionRef = useRef(null);
  const previousStepIdRef = useRef(step.id);
  const submittedRef = useRef(Boolean(session.submitted));
  useEffect(() => { if (session.scenarioId !== scenario.id) setSession(createScenarioSession(scenario.id)); }, [scenario.id, session.scenarioId, setSession]);
  useEffect(() => { submittedRef.current = Boolean(session.submitted); }, [session.scenarioId, session.submitted]);
  useEffect(() => {
    if (previousStepIdRef.current !== step.id) {
      previousStepIdRef.current = step.id;
      questionRef.current?.focus();
    }
  }, [step.id]);
  function selectChoice(choiceId) { if (!confirmed) setSession((current) => ({ ...current, answers: { ...current.answers, [step.id]: choiceId }, notice: "" })); }
  function selectHypothesisPriority(answerKey, priority) {
    if (confirmed) return;
    setSession((current) => ({
      ...current,
      answers: { ...current.answers, [answerKey]: priority },
      notice: "",
    }));
  }
  function confirmChoice() {
    if (!selectedId) {
      setSession((current) => ({ ...current, notice: t("chooseFirst") }));
      return;
    }
    const hasUnrankedHypothesis = hypothesesShown.some((hypothesis) => (
      !session.answers[hypothesisAnswerKey(scenario.id, hypothesis.id)]
    ));
    if (hasUnrankedHypothesis) {
      setSession((current) => ({ ...current, notice: t("completeHypotheses") }));
      return;
    }
    setSession((current) => ({ ...current, confirmedStepId: step.id, notice: "" }));
  }
  function advance() {
    if (!confirmed) return;
    if (stepIndex < scenario.steps.length - 1) {
      setSession((current) => ({ ...current, stepIndex: stepIndex + 1, confirmedStepId: null, notice: "" }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (submittedRef.current || session.submitted) {
      window.location.hash = `#/result/${scenario.id}`;
      return;
    }
    submittedRef.current = true;
    if (onComplete(scenario, session.answers) === false) {
      submittedRef.current = false;
      return;
    }
    setSession((current) => ({ ...current, submitted: true }));
  }
  return <div className="scenario-shell"><PatientRail scenario={scenario} step={step} lang={lang} t={t} /><section className="decision-stage">
    <div className="decision-toolbar"><span className="simulation-badge"><Pulse size={19} weight="bold" />{t("simulation")}</span><ProgressSteps stepIndex={stepIndex} count={scenario.steps.length} lang={lang} t={t} /></div>
    <ScenarioContext variant={variant} lang={lang} t={t} />
    <section className="timeline-block" aria-labelledby="timeline-title"><h2 id="timeline-title">{t("timeline")}</h2><ol>{scenario.steps.slice(Math.max(0, stepIndex - 2), stepIndex + 1).map((timelineStep) => <li key={timelineStep.id} className={timelineStep.id === step.id ? "current" : ""}><span className="timeline-icon"><Pulse size={17} weight={timelineStep.id === step.id ? "fill" : "regular"} /></span><time>{localize(timelineStep.time, lang)}</time><p>{localize(timelineStep.narrative, lang)}</p></li>)}</ol></section>
    <div className="decision-question"><div className="question-heading"><span className="question-icon"><Target size={28} weight="duotone" /></span><div><p className="eyebrow">{t("clinicalMoment")}</p><h1 ref={questionRef} tabIndex="-1">{localize(step.question, lang)}</h1><p className="translated-question" lang={alternateLang} dir={alternateLang === "ar" ? "rtl" : "ltr"}>{localize(step.question, alternateLang)}</p></div></div><p className="question-instruction">{t("questionIntro")}</p>
      {hypothesesShown.length ? <HypothesisExercise scenario={scenario} lang={lang} t={t} answers={session.answers} confirmed={confirmed} onChange={selectHypothesisPriority} /> : null}
      <fieldset className="choice-list"><legend className="sr-only">{t("choiceGroup")}</legend>{orderedChoices.map((choice, index) => { const checked = selectedId === choice.id; return <label key={choice.id} className={`choice-option ${checked ? "selected" : ""} ${confirmed ? "locked" : ""}`}><input type="radio" name={`choice-${step.id}`} value={choice.id} checked={checked} disabled={confirmed} onChange={() => selectChoice(choice.id)} /><span className="choice-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span className="choice-text">{localize(choice.text, lang)}</span><span className="radio-visual" aria-hidden="true">{checked ? <Check size={15} weight="bold" /> : null}</span></label>; })}</fieldset>
      {session.notice ? <p className="form-notice" role="alert"><Warning size={18} weight="fill" />{session.notice}</p> : null}
      {confirmed && selectedChoice ? <div className={`decision-feedback ${selectedChoice.classification}`} aria-live="polite">{(() => { const Icon = classificationIcon(selectedChoice.classification); return <Icon size={28} weight="fill" aria-hidden="true" />; })()}<div><p className="feedback-label">{t("feedback")} · {t(selectedChoice.classification)}</p><h2>{localize(selectedChoice.feedback, lang)}</h2><p>{localize(selectedChoice.rationale, lang)}</p><div className="decision-source-list"><strong><BookOpen size={16} weight="duotone" />{t("questionSources")}</strong>{stepReferences.map((reference) => <a key={reference.id} href={reference.url} target="_blank" rel="noopener noreferrer nofollow">{localize(reference.title, lang)}<ArrowSquareOut size={14} /><span className="sr-only">{t("opensNewTab")}</span></a>)}</div><small><LockKey size={14} />{t("selectionLocked")}</small></div></div> : null}
      <div className="decision-actions"><button type="button" className="button button-primary" onClick={confirmed ? advance : confirmChoice}>{confirmed ? (stepIndex === scenario.steps.length - 1 ? t("viewDebrief") : t("nextDecision")) : t("confirm")} {lang === "ar" ? <ArrowLeft size={19} /> : <ArrowRight size={19} />}</button></div>
    </div><div className="decision-source-note"><BookOpen size={20} weight="duotone" /><p><strong>{t("sourceSet")}</strong> · {formatNumber(caseReferenceCount, lang)} {t("referencesCount")}</p></div>
  </section><LearningRail scenario={scenario} stepIndex={stepIndex} lang={lang} t={t} /></div>;
}

function ScoreRing({ score, lang }) {
  return <div className="score-ring" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(score)} aria-label={`${formatNumber(score, lang)}%`} style={{ "--score": `${score}%` }}><Circle className="score-ring-track" size={132} weight="regular" aria-hidden="true" /><div><strong>{formatNumber(Math.round(score), lang)}</strong><span>/ 100</span><span className="score-ring-meter" aria-hidden="true"><span /></span></div></div>;
}

function ResultPage({ scenarioId, lang, t, profile, onStart }) {
  const scenario = scenarios.find((item) => item.id === scenarioId);
  const attempt = [...profile.attempts].reverse().find((item) => item.scenarioId === scenarioId && item.isComplete);
  if (!scenario || !attempt) return <div className="page-container compact-page"><div className="empty-state"><ClipboardText size={46} weight="duotone" /><h1>{t("noAttempt")}</h1><AppLink className="button button-primary" to={scenario ? `scenario/${scenario.id}` : "scenarios"}>{scenario ? t("openScenario") : t("backLibrary")}</AppLink></div></div>;
  const caseReferences = scenario.referenceIds.map((id) => references.find((item) => item.id === id)).filter(Boolean);
  const hypothesisDecisions = attempt.decisions.map((decision) => ({
    decision,
    hypothesis: scenario.hypotheses?.find((item) => hypothesisAnswerKey(scenario.id, item.id) === decision.stepId),
  })).filter((item) => item.hypothesis);
  return <div className="page-container debrief-page"><SectionIntro eyebrow={t("debriefEyebrow")} title={t("debriefTitle")} body={localize(scenario.title, lang)} />
    <section className="result-summary"><ScoreRing score={attempt.score} lang={lang} /><div className="result-primary"><span>{t("band")}</span><h2>{t(scoreBandKey(attempt.educationalBand))}</h2><p>{t("learningNotCertification")}</p></div><dl className="result-metrics"><div><dt>{t("answered")}</dt><dd>{formatNumber(attempt.answeredDecisionCount, lang)} / {formatNumber(attempt.totalDecisionCount, lang)}</dd></div><div><dt>{t("safetyFlags")}</dt><dd className={attempt.criticalUnsafeCount > 0 ? "danger-text" : ""}>{formatNumber(attempt.criticalUnsafeCount, lang)}</dd></div></dl></section>
    {hypothesisDecisions.length ? <section className="debrief-hypotheses"><div className="subsection-heading"><p className="eyebrow">{t("hypothesisFeedback")}</p><h2>{t("hypothesesTitle")}</h2></div><p className="hypothesis-boundary"><ShieldWarning size={17} weight="fill" aria-hidden="true" />{t("learningHypothesisNote")}</p><div className="hypothesis-review-grid">{hypothesisDecisions.map(({ decision, hypothesis }) => { const hypothesisReferences = (hypothesis.referenceIds ?? []).map((id) => references.find((reference) => reference.id === id)).filter(Boolean); return <article className={`hypothesis-review ${decision.classification}`} key={decision.stepId}><div className="review-topline"><span>{decision.classification === "safe" ? <CheckCircle size={18} weight="fill" /> : <Warning size={18} weight="fill" />}{t(decision.classification)}</span><strong>{formatNumber(decision.score, lang)} {t("points")}</strong></div><h3>{localize(hypothesis.problem, lang)}</h3><p><strong>{t("yourPriority")}:</strong> {t(HYPOTHESIS_PRIORITY_COPY[decision.choiceId])}</p><p><strong>{t("expectedPriority")}:</strong> {t(HYPOTHESIS_PRIORITY_COPY[hypothesis.correctPriority])}</p><p>{localize(hypothesis.rationale, lang)}</p><div className="decision-source-list"><strong>{t("questionSources")}</strong>{hypothesisReferences.map((reference) => <a key={reference.id} href={reference.url} target="_blank" rel="noopener noreferrer nofollow">{localize(reference.title, lang)}<ArrowSquareOut size={14} /><span className="sr-only">{t("opensNewTab")}</span></a>)}</div></article>; })}</div></section> : null}
    <section className="debrief-decisions"><div className="subsection-heading"><p className="eyebrow">{t("feedback")}</p><h2>{t("decisionReview")}</h2></div><div className="review-list">{attempt.decisions.map((decision, index) => { const step = scenario.steps.find((item) => item.id === decision.stepId); const choice = step?.choices.find((item) => item.id === decision.choiceId); if (!step || !choice) return null; const Icon = classificationIcon(decision.classification); const decisionReferences = (step.referenceIds ?? scenario.referenceIds).map((id) => references.find((reference) => reference.id === id)).filter(Boolean); return <article className={`review-item ${decision.classification}`} key={decision.stepId}><div className="review-number">{formatNumber(index + 1, lang)}</div><div className="review-body"><div className="review-topline"><span><Icon size={19} weight="fill" />{t(decision.classification)}</span><strong>{formatNumber(decision.score, lang)} {t("points")}</strong></div><h3>{localize(step.question, lang)}</h3><p className="review-choice"><strong>{t("yourChoice")}:</strong> {localize(choice.text, lang)}</p><div className="rationale-copy"><BookOpen size={20} weight="duotone" /><p><strong>{t("rationale")}:</strong> {localize(choice.rationale, lang)}</p></div><div className="decision-source-list"><strong>{t("questionSources")}</strong>{decisionReferences.map((reference) => <a key={reference.id} href={reference.url} target="_blank" rel="noopener noreferrer nofollow">{localize(reference.title, lang)}<ArrowSquareOut size={14} /><span className="sr-only">{t("opensNewTab")}</span></a>)}</div></div></article>; })}</div></section>
    <section className="debrief-evidence"><div className="subsection-heading"><p className="eyebrow">{t("resources")}</p><h2>{t("evidenceForCase")}</h2></div><div className="source-rows compact-sources">{caseReferences.map((reference) => <a key={reference.id} href={reference.url} target="_blank" rel="noopener noreferrer nofollow" className="source-row"><span className="source-year">{reference.year}</span><div><h3>{localize(reference.title, lang)}</h3><p>{localize(reference.organization, lang)}</p></div><ArrowSquareOut size={19} /><span className="sr-only">{t("opensNewTab")}</span></a>)}</div></section>
    <div className="debrief-actions"><button type="button" className="button button-primary" onClick={() => onStart(scenario.id)}><Play size={18} weight="fill" />{t("tryAgain")}</button><AppLink to="scenarios" className="button button-secondary">{t("backLibrary")}</AppLink></div>
  </div>;
}

const allQuestionReferences = [
  ...new Map(
    [...examReferences, ...references].map((reference) => [reference.id, reference]),
  ).values(),
];

const examLearningDomains = examTracks.flatMap((track) => (
  examDomains.map((domain) => ({ ...domain, examId: track.id }))
));

function QuestionBankPage({ lang, t, examProfile, onComplete, storageKey, historyClearPending }) {
  const [examId, setExamId] = useState("saudi-nursing");
  const [practiceMode, setPracticeMode] = useState("guided");
  const [categoryId, setCategoryId] = useState("all");
  const [difficultyId, setDifficultyId] = useState("all");
  const [limit, setLimit] = useState(10);
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState(null);
  const submittedRef = useRef(false);
  const {
    session,
    questions: sessionQuestions,
    currentQuestionIndex,
    currentQuestion,
    selectedAnswerId,
    isCurrentAnswerLocked,
    remainingSeconds,
    isExpired,
    startSession,
    selectAnswer,
    lockCurrentAnswer,
    goToNextQuestion,
    clearSession,
  } = useExamSession({ storageKey, questionBank });
  const quiz = session ? {
    seed: session.metadata?.seed ?? "restored",
    questions: sessionQuestions,
    index: currentQuestionIndex,
  } : null;
  const activeExamId = session?.metadata?.examId ?? examId;
  const activePracticeMode = session?.metadata?.selectionMode ?? practiceMode;
  const categories = examCategories.filter((category) => category.examId === examId);
  const completedSets = examProfile.attempts.filter((attempt) => attempt.isComplete);
  const answeredQuestionIds = new Set(completedSets.flatMap((attempt) => attempt.questionIds ?? []));
  const filteredQuestions = questionBank.filter((question) => question.examId === examId && (categoryId === "all" || question.categoryId === categoryId) && (difficultyId === "all" || question.difficultyId === difficultyId));
  const availableCount = practiceMode === "guided"
    ? filteredQuestions.filter((question) => !answeredQuestionIds.has(question.id)).length
    : filteredQuestions.length;
  const guidedPlan = getGuidedQuestionPlan(completedSets, examLearningDomains, examId);

  function beginQuiz() {
    const seed = `${examId}:${Date.now()}:${completedSets.length}`;
    const quizOptions = {
      examId,
      categoryIds: categoryId === "all" ? [] : [categoryId],
      difficultyIds: difficultyId === "all" ? [] : [difficultyId],
      limit,
      seed,
    };
    const questions = practiceMode === "guided"
      ? createGuidedQuiz(questionBank, completedSets, examLearningDomains, quizOptions)
      : createQuiz(questionBank, quizOptions);
    if (!questions.length) { setNotice(t(practiceMode === "guided" ? "noFreshGuidedQuestions" : "noQuestions")); return; }
    submittedRef.current = false;
    startSession({
      questions,
      durationSeconds: questions.length * EXAM_SECONDS_PER_QUESTION,
      metadata: { examId, seed, selectionMode: practiceMode, bankVersion: QUESTION_BANK_VERSION },
    });
    setNotice("");
    setResult(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function resetQuiz() {
    submittedRef.current = false;
    clearSession();
    setNotice("");
    setResult(null);
  }

  function completeQuiz(completionReason = "completed") {
    if (!quiz || submittedRef.current) return;
    if (historyClearPending) {
      setNotice(t("historyClearPending"));
      return;
    }
    submittedRef.current = true;
    const effectiveCompletionReason = isExamSessionExpired(session) ? "time-expired" : completionReason;
    const includeUnanswered = effectiveCompletionReason === "time-expired";
    const graded = gradeQuiz(quiz.questions, getConfirmedAnswers(session), { includeUnanswered });
    if (!graded.isComplete) {
      submittedRef.current = false;
      setNotice(t("quizIncomplete"));
      return;
    }
    const completed = {
      ...graded,
      id: session?.id ?? `practice-${Date.now()}`,
      examId: activeExamId,
      seed: quiz.seed,
      selectionMode: activePracticeMode,
      completionReason: effectiveCompletionReason,
      bankVersion: QUESTION_BANK_VERSION,
    };
    if (onComplete(completed) === false) {
      submittedRef.current = false;
      setNotice(t("historyClearPending"));
      return;
    }
    setResult(completed);
    clearSession();
    setNotice(effectiveCompletionReason === "time-expired" ? t("timeExpired") : "");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function startFocusedQuiz() {
    if (!result) return;
    const resultQuestions = questionBank.filter((question) => question.examId === result.examId);
    const resultAnswers = result.decisions.map((decision) => ({
      questionId: decision.questionId,
      selectedOptionId: decision.selectedOptionId,
    }));
    const seed = `focused:${result.examId}:${Date.now()}`;
    const focusedQuestions = analyzePerformance(resultAnswers, resultQuestions);
    const questions = createQuiz(focusedQuestions, { examId: result.examId, limit: 10, seed });
    if (!questions.length) { setNotice(t("noQuestions")); return; }
    submittedRef.current = false;
    setResult(null);
    setNotice("");
    startSession({
      questions,
      durationSeconds: questions.length * EXAM_SECONDS_PER_QUESTION,
      metadata: { examId: result.examId, seed, selectionMode: "performance-focus", bankVersion: QUESTION_BANK_VERSION },
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  useEffect(() => {
    if (quiz && isExpired && !result && !historyClearPending) completeQuiz("time-expired");
  }, [historyClearPending, isExpired, session?.id]);

  if (!quiz && !result) {
    return <div className="page-container question-bank-page"><SectionIntro eyebrow={t("questionBankEyebrow")} title={t("questionBankTitle")} body={t("questionBankBody")} />
      <div className="exam-integrity-note" role="note"><ShieldCheck size={25} weight="duotone" aria-hidden="true" /><div><strong>{t("originalPracticeNotice")}</strong><p>{t("examNonAffiliation")}</p></div></div>
      <section className="quiz-builder" aria-labelledby="quiz-builder-title"><div className="quiz-builder-heading"><div><p className="eyebrow">{t("practiceSet")}</p><h2 id="quiz-builder-title">{t("selectTrack")}</h2></div><AccessBadge t={t} /></div>
        <fieldset className="exam-track-list"><legend className="sr-only">{t("selectTrack")}</legend>{examTracks.map((track) => <label key={track.id} className={examId === track.id ? "selected" : ""}><input type="radio" name="exam-track" value={track.id} checked={examId === track.id} onChange={() => { setExamId(track.id); setCategoryId("all"); setNotice(""); }} /><span className="track-check" aria-hidden="true">{examId === track.id ? <Check size={16} weight="bold" /> : null}</span><span><strong>{localize(track.shortLabel, lang)}</strong><small>{localize(track.description, lang)}</small></span></label>)}</fieldset>
        <fieldset className="practice-mode-list"><legend>{t("practiceMode")}</legend><label className={practiceMode === "guided" ? "selected" : ""}><input type="radio" name="practice-mode" value="guided" checked={practiceMode === "guided"} onChange={() => { setPracticeMode("guided"); setNotice(""); }} /><Brain size={23} weight="duotone" aria-hidden="true" /><span><strong>{t("guidedPractice")}</strong><small>{t("guidedPracticeBody")}</small></span></label><label className={practiceMode === "manual" ? "selected" : ""}><input type="radio" name="practice-mode" value="manual" checked={practiceMode === "manual"} onChange={() => { setPracticeMode("manual"); setNotice(""); }} /><ClipboardText size={23} weight="duotone" aria-hidden="true" /><span><strong>{t("manualPractice")}</strong><small>{t("manualPracticeBody")}</small></span></label></fieldset>
        {practiceMode === "guided" ? <div className="guided-plan-note" role="note"><Brain size={27} weight="fill" aria-hidden="true" /><div><strong>{t("guidedPractice")}</strong><p>{t(guidedPlanCopy[guidedPlan.mode])}</p>{guidedPlan.focusCategories.length ? <div className="guided-focus-list"><span>{t("currentFocus")}:</span>{guidedPlan.focusCategories.map((focus) => <b key={focus.categoryId}>{localize(focus.label, lang)}</b>)}</div> : null}<small>{t("guidedFixedSetNotice")}</small></div></div> : null}
        <div className="quiz-filters"><label><span>{t("quizCategory")}</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="all">{t("allCategories")}</option>{categories.map((category) => <option key={category.id} value={category.id}>{localize(category.label, lang)}</option>)}</select></label><label><span>{t("quizDifficulty")}</span><select value={difficultyId} onChange={(event) => setDifficultyId(event.target.value)}><option value="all">{t("allDifficultyLevels")}</option>{examDifficulties.map((difficulty) => <option key={difficulty.id} value={difficulty.id}>{localize(difficulty.label, lang)}</option>)}</select></label><label><span>{t("quizSize")}</span><select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>{QUIZ_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{formatNumber(size, lang)}</option>)}</select></label></div>
        <div className="quiz-builder-footer"><p><strong>{formatNumber(availableCount, lang)}</strong> {t("questionsAvailable")}</p><button type="button" className="button button-primary" onClick={beginQuiz} disabled={availableCount === 0}><Play size={18} weight="fill" aria-hidden="true" />{t("beginQuiz")}</button></div>{notice ? <p className="form-notice" role="alert"><Warning size={18} weight="fill" />{notice}</p> : null}
      </section>
      <section className="exam-summary-strip"><div><ClipboardText size={27} weight="duotone" /><span>{t("setsCompleted")}</span><strong>{formatNumber(completedSets.length, lang)}</strong></div><div><Target size={27} weight="duotone" /><span>{t("questionsAnswered")}</span><strong>{formatNumber(completedSets.reduce((sum, attempt) => sum + attempt.answeredCount, 0), lang)}</strong></div><AppLink to="learning" className="inline-link">{t("continueLearning")} {lang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}</AppLink></section>
    </div>;
  }

  if (result) {
    const missed = result.decisions.filter((decision) => !decision.isCorrect);
    return <div className="page-container quiz-result-page"><SectionIntro eyebrow={t("quizDebriefEyebrow")} title={t("quizDebriefTitle")} body={t("localExamProgressBody")} />{notice ? <p className="form-notice result-notice" role="status"><Clock size={18} weight="fill" />{notice}</p> : null}<section className="result-summary"><ScoreRing score={result.score} lang={lang} /><div className="result-primary"><span>{t("quizScore")}</span><h2>{formatNumber(Math.round(result.score), lang)}%</h2><p>{t("originalPracticeNotice")}</p></div><dl className="result-metrics"><div><dt>{t("correctAnswers")}</dt><dd>{formatNumber(result.correctCount, lang)} / {formatNumber(result.totalQuestionCount, lang)}</dd></div><div><dt>{t("selectTrack")}</dt><dd>{localize(examTracks.find((track) => track.id === result.examId)?.shortLabel, lang)}</dd></div></dl></section>
      <section className="quiz-review"><div className="subsection-heading"><p className="eyebrow">{t("answerRationale")}</p><h2>{missed.length ? t("morePractice") : t("strongKnowledge")}</h2></div><div className="quiz-review-list">{result.decisions.map((decision, index) => { const question = questionBank.find((item) => item.id === decision.questionId); if (!question) return null; const DecisionIcon = decision.isCorrect ? CheckCircle : ShieldWarning; const responseLabel = decision.selectedOptionId === null ? t("unansweredAtTimeout") : t(decision.isCorrect ? "correctAnswer" : "incorrectAnswer"); return <article key={decision.questionId} className={decision.isCorrect ? "correct" : "incorrect"}><span className="review-number">{formatNumber(index + 1, lang)}</span><div><p>{localize(question.topic, lang)}</p><h3>{localize(question.stem, lang)}</h3><strong><DecisionIcon size={18} weight="fill" />{responseLabel}</strong><p>{localize(question.rationale, lang)}</p></div></article>; })}</div></section>
      <section className="focused-followup" aria-labelledby="focused-followup-title"><Brain size={30} weight="duotone" aria-hidden="true" /><div><h2 id="focused-followup-title">{t("focusedPracticeTitle")}</h2><p>{t("focusedPracticeBody")}</p></div><button type="button" className="button button-primary" onClick={startFocusedQuiz}>{t("startFocusedSet")}</button></section>
      <div className="debrief-actions"><button type="button" className="button button-secondary" onClick={resetQuiz}><Exam size={18} weight="duotone" />{t("restartQuiz")}</button><AppLink to="learning" className="button button-secondary">{t("continueLearning")}</AppLink></div><p className="exam-legal-line">{t("examNonAffiliation")}</p>
    </div>;
  }

  const sourceSet = currentQuestion.referenceIds.map((id) => allQuestionReferences.find((reference) => reference.id === id)).filter(Boolean);
  const percentage = Math.round(((quiz.index + 1) / quiz.questions.length) * 100);

  function lockAnswer() {
    if (!selectedAnswerId) { setNotice(t("selectOneAnswer")); return; }
    lockCurrentAnswer();
    setNotice("");
  }

  function advanceQuestion() {
    if (!isCurrentAnswerLocked) return;
    if (quiz.index < quiz.questions.length - 1) {
      goToNextQuestion();
      setNotice("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    completeQuiz("completed");
  }

  return <div className="page-container active-quiz-page"><div className="active-quiz-top"><div><span className="simulation-badge"><ClipboardText size={18} weight="bold" />{localize(examTracks.find((track) => track.id === activeExamId)?.shortLabel, lang)}</span><AccessBadge t={t} /></div><div className={`exam-timer ${remainingSeconds <= 60 ? "urgent" : ""}`} aria-live="off"><span><Clock size={19} weight="duotone" />{t("timeRemaining")}</span><strong>{formatCountdown(remainingSeconds, lang)}</strong><small>{t("sessionSaved")}</small></div><div className="quiz-progress-copy"><strong>{t("question")} {formatNumber(quiz.index + 1, lang)} {t("of")} {formatNumber(quiz.questions.length, lang)}</strong><span>{formatNumber(percentage, lang)}%</span></div><div className="progress-meter" role="progressbar" aria-label={t("quizProgress")} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percentage}><span style={{ width: `${percentage}%` }} /></div></div>
    <ExamQuestion question={currentQuestion} questionNumber={quiz.index + 1} language={lang} translate={t} selectedOptionId={selectedAnswerId} locked={isCurrentAnswerLocked} notice={notice} sources={sourceSet} isLastQuestion={quiz.index === quiz.questions.length - 1} onSelect={(optionId) => { selectAnswer(optionId); setNotice(""); }} onPrimaryAction={isCurrentAnswerLocked ? advanceQuestion : lockAnswer} />
    <p className="exam-legal-line">{t("examNonAffiliation")}</p>
  </div>;
}

function LearningPage({ lang, t, profile, examProfile, onClearHistory, onStart, auth, syncStatus, onSignOut, onExportLearningData }) {
  const [historyCleared, setHistoryCleared] = useState(false);
  const [historyClearing, setHistoryClearing] = useState(false);
  const completedAttempts = profile.attempts.filter((item) => item.isComplete);
  const completedExamAttempts = examProfile.attempts.filter((item) => item.isComplete);
  const examInsights = getQuestionCategoryInsights(completedExamAttempts, examLearningDomains).filter((insight) => insight.answeredCount > 0);
  const examQuestionCount = completedExamAttempts.reduce((sum, attempt) => sum + attempt.answeredCount, 0);
  const completedCount = getCompletedScenarioCount(profile);
  const average = completedAttempts.length ? completedAttempts.reduce((sum, item) => sum + item.score, 0) / completedAttempts.length : 0;
  const insights = getCompetencyInsights(profile, scenarios);
  const [topScenarioRecommendation] = getScenarioRecommendations(profile, scenarios, { limit: 1 });
  const suggestedScenario = scenarios.find((scenario) => scenario.id === topScenarioRecommendation?.scenarioId);
  const guidedQuestionPlan = getGuidedQuestionPlan(completedExamAttempts, examLearningDomains, "all");
  const latestAttempts = [];
  const seenScenarioIds = new Set();
  for (let index = completedAttempts.length - 1; index >= 0; index -= 1) {
    const attempt = completedAttempts[index];
    if (!seenScenarioIds.has(attempt.scenarioId)) {
      seenScenarioIds.add(attempt.scenarioId);
      latestAttempts.push(attempt);
    }
  }
  const statusCopy = { "insufficient-data": "insightInsufficient", weakness: "insightWeakness", developing: "insightDeveloping", strength: "insightStrength" };
  const examStatusCopy = { "insufficient-data": "insightInsufficient", review: "morePractice", developing: "developingKnowledge", strength: "strongKnowledge" };
  async function clearHistory() {
    if (historyClearing) return;
    if (!window.confirm(t("clearHistoryConfirm"))) return;
    setHistoryClearing(true);
    setHistoryCleared(false);
    try {
      const cleared = await onClearHistory();
      setHistoryCleared(cleared !== false);
    } finally {
      setHistoryClearing(false);
    }
  }
  return <div className="page-container learning-page"><SectionIntro eyebrow={t("learningEyebrow")} title={t("learningTitle")} body={t("learningBody")} />
    <AccountPanel auth={auth} lang={lang} syncStatus={syncStatus} onSignOut={onSignOut} onExportLearningData={onExportLearningData} />
    <section className="dashboard-metrics"><div><CheckCircle size={30} weight="duotone" /><span>{t("scenariosCompleted")}</span><strong>{formatNumber(completedCount, lang)} / {formatNumber(scenarios.length, lang)}</strong></div><div><ClipboardText size={30} weight="duotone" /><span>{t("totalAttempts")}</span><strong>{formatNumber(completedAttempts.length, lang)}</strong></div><div><Medal size={30} weight="duotone" /><span>{t("averageScore")}</span><strong>{completedAttempts.length ? `${formatNumber(Math.round(average), lang)}%` : "—"}</strong></div></section>
    <section className="adaptive-next-panel" aria-labelledby="adaptive-next-title"><Brain size={36} weight="duotone" aria-hidden="true" /><div><p className="eyebrow">{t("guidedPractice")}</p><h2 id="adaptive-next-title">{t("adaptiveLearningTitle")}</h2><p>{t("adaptiveLearningBody")}</p>{suggestedScenario && topScenarioRecommendation ? <strong>{t(scenarioRecommendationCopy[topScenarioRecommendation.reason])}: {localize(suggestedScenario.title, lang)}</strong> : null}{guidedQuestionPlan.focusCategories.length ? <div className="guided-focus-list"><span>{t("currentFocus")}:</span>{guidedQuestionPlan.focusCategories.map((focus) => <b key={`${focus.examId}:${focus.categoryId}`}>{localize(focus.label, lang)}</b>)}</div> : null}</div><div className="adaptive-next-actions">{suggestedScenario ? <button type="button" className="button button-primary" onClick={() => onStart(suggestedScenario.id)}>{t("openRecommendedScenario")}</button> : null}<AppLink to="questions" className="button button-secondary">{t("startGuidedQuestions")}</AppLink></div></section>
    {!completedAttempts.length ? <div className="empty-learning"><GraduationCap size={49} weight="duotone" /><div><h2>{t("emptyLearning")}</h2><AppLink to="scenarios" className="button button-primary">{t("chooseFirstScenario")}</AppLink></div></div> : null}
    <section className="exam-learning-section"><div className="subsection-heading split-heading"><div><p className="eyebrow">{t("questionBankEyebrow")}</p><h2>{t("localExamProgress")}</h2></div><p>{t("localExamProgressBody")}</p></div><div className="exam-learning-metrics"><div><ClipboardText size={28} weight="duotone" /><span>{t("setsCompleted")}</span><strong>{formatNumber(completedExamAttempts.length, lang)}</strong></div><div><Target size={28} weight="duotone" /><span>{t("questionsAnswered")}</span><strong>{formatNumber(examQuestionCount, lang)}</strong></div><AppLink to="questions" className="button button-secondary">{t("viewQuestionBank")}</AppLink></div>
      {!completedExamAttempts.length ? <div className="exam-empty"><Exam size={35} weight="duotone" /><p>{t("noExamAttempts")}</p></div> : <><p className="exam-evidence-note"><Info size={18} weight="fill" />{t("categoryEvidenceBody")}</p><ul className="exam-insight-list" aria-label={t("categoryInsights")}>{examInsights.map((insight) => <li key={`${insight.examId}:${insight.categoryId}`}><div><span>{localize(examTracks.find((track) => track.id === insight.examId)?.shortLabel, lang)}</span><strong>{localize(insight.label, lang)}</strong><small>{formatNumber(insight.uniqueQuestionCount, lang)} {t("uniqueItems")} · {formatNumber(insight.completedSetCount, lang)} {t("completedSetsEvidence")}</small></div><div className="insight-score"><strong>{insight.score === null ? "—" : `${formatNumber(Math.round(insight.score), lang)}%`}</strong><span className={`insight-status ${insight.status === "review" ? "weakness" : insight.status}`}>{t(examStatusCopy[insight.status])}</span></div></li>)}</ul></>}
    </section>
    <section className="insights-section"><div className="subsection-heading split-heading"><div><p className="eyebrow">{t("competencies")}</p><h2>{t("competencyMap")}</h2></div><p>{t("competencyBody")}</p></div><ul className="insight-table" aria-label={t("competencyMap")}>{insights.map((insight) => <li className="insight-row" key={insight.competency}><div className="insight-label"><span className={`status-dot ${insight.status}`} /><div><strong>{localize(insight.label, lang)}</strong><small>{formatNumber(insight.decisionCount, lang)} {t("observations")} · {t("across")} {formatNumber(insight.scenarioCount, lang)} {insight.scenarioCount === 1 ? t("caseSingular") : t("casesPlural")}</small></div></div><div className="insight-score"><strong>{insight.score === null ? "—" : `${formatNumber(Math.round(insight.score), lang)}%`}</strong><span className={`insight-status ${insight.status}`}>{t(statusCopy[insight.status])}</span></div>{insight.criticalUnsafeCount > 0 ? <p className="insight-alert"><ShieldWarning size={16} weight="fill" />{t("safetyReviewNeeded")}</p> : null}</li>)}</ul></section>
    {latestAttempts.length ? <section className="attempts-section"><div className="subsection-heading"><p className="eyebrow">{t("scenario")}</p><h2>{t("attemptsHistory")}</h2></div><div className="attempt-list">{latestAttempts.map((attempt) => { const scenario = scenarios.find((item) => item.id === attempt.scenarioId); return <div className="attempt-row" key={attempt.scenarioId}><div><span>{localize(scenario?.department, lang)}</span><h3>{localize(scenario?.title, lang)}</h3></div><strong>{formatNumber(Math.round(attempt.score), lang)}%</strong><AppLink to={`result/${attempt.scenarioId}`} className="inline-link">{t("review")} {lang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}</AppLink></div>; })}</div></section> : null}
    <section className="local-profile-note"><Database size={31} weight="duotone" /><div><h2>{t("localStorageTitle")}</h2><p>{t("localStorageBody")}</p>{historyCleared ? <p className="clear-history-status" role="status">{t("historyCleared")}</p> : null}</div><button type="button" className="button clear-history-button" onClick={clearHistory} disabled={historyClearing || (!profile.attempts.length && !examProfile.attempts.length)}><Trash size={17} aria-hidden="true" />{t("clearHistory")}</button></section><p className="exam-legal-line">{t("examNonAffiliation")}</p>
  </div>;
}

function ReferencesPage({ lang, t }) {
  return <div className="page-container references-page"><SectionIntro eyebrow={t("referencesEyebrow")} title={t("referencesTitle")} body={t("referencesBody")} /><div className="reference-callout"><ShieldCheck size={30} weight="duotone" /><p>{t("localProtocol")}</p></div><div className="source-rows">{allQuestionReferences.map((reference) => <article className="full-source-row" key={reference.id}><div className="source-year">{reference.year}</div><div className="source-details"><span>{localize(reference.organization, lang)}</span><h2>{localize(reference.title, lang)}</h2><details><summary>{t("accessNote")}</summary><p>{localize(reference.accessNote, lang)}</p><p>{localize(reference.licensingNote, lang)}</p></details></div><a href={reference.url} target="_blank" rel="noopener noreferrer nofollow" className="button button-secondary source-link"><span>{t("source")}</span><ArrowSquareOut size={18} /><span className="sr-only">{t("opensNewTab")}</span></a></article>)}</div><p className="exam-legal-line">{t("examNonAffiliation")}</p></div>;
}

function PolicyPage({ kind, lang, t }) {
  const page = POLICY_PAGES[lang]?.[kind] ?? POLICY_PAGES.en[kind];
  return <div className="page-container policy-page"><SectionIntro eyebrow={page.eyebrow} title={page.title} body={page.lead} />
    <div className="policy-meta"><Clock size={18} weight="duotone" aria-hidden="true" /><span>{page.effective}</span></div>
    <div className="policy-warning" role="note"><ShieldWarning size={25} weight="fill" aria-hidden="true" /><p>{page.warning}</p></div>
    {page.email ? <a className="policy-email button button-primary" href={`mailto:${page.email}`}><EnvelopeSimple size={18} aria-hidden="true" />{page.email}</a> : null}
    <div className="policy-sections">{page.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div>
    <p className="exam-legal-line">{t("examNonAffiliation")}</p>
  </div>;
}

function AboutPage({ t }) {
  return <div className="page-container about-page"><SectionIntro eyebrow={t("aboutEyebrow")} title={t("aboutTitle")} body={t("aboutLead")} /><div className="about-grid"><section><Target size={29} weight="duotone" /><div><h2>{t("purpose")}</h2><p>{t("purposeBody")}</p></div></section><section><Brain size={29} weight="duotone" /><div><h2>{t("method")}</h2><p>{t("methodBody")}</p></div></section><section><ShieldWarning size={29} weight="duotone" /><div><h2>{t("boundaries")}</h2><p>{t("boundariesBody")}</p></div></section><section><LockKey size={29} weight="duotone" /><div><h2>{t("accountModel")}</h2><p>{t("accountModelBody")}</p></div></section></div><section className="editorial-band"><div><p className="eyebrow">{t("resources")}</p><h2>{t("editorial")}</h2></div><p>{t("editorialBody")}</p></section><p className="exam-legal-line">{t("examNonAffiliation")}</p></div>;
}

function AccessBadge({ t }) {
  return <span className="access-badge free"><CheckCircle size={14} weight="fill" aria-hidden="true" />{t("includedAccess")}</span>;
}

function Footer({ lang, t }) {
  return <footer className="site-footer"><div><span className="footer-mark"><Heartbeat size={23} /></span><p>© 2026 Abdulkarim alhejaili</p></div><p className="footer-tagline">{PRODUCT_NAME[lang]} · {t("footerLine")}</p><nav aria-label={lang === "ar" ? "روابط التذييل" : "Footer links"}><AppLink to="resources">{t("resources")}</AppLink><AppLink to="privacy">{t("privacy")}</AppLink><AppLink to="terms">{t("terms")}</AppLink><AppLink to="contact">{t("contact")}</AppLink></nav></footer>;
}

function mergeAttemptsById(localAttempts, cloudAttempts, limit) {
  const merged = new Map();
  for (const [index, attempt] of [...localAttempts, ...cloudAttempts].entries()) {
    const key = typeof attempt?.id === "string" && attempt.id
      ? attempt.id
      : `${attempt?.scenarioId ?? attempt?.examId ?? "attempt"}:${index}`;
    merged.set(key, attempt);
  }
  return [...merged.values()]
    .sort((left, right) => String(left.completedAt ?? "").localeCompare(String(right.completedAt ?? "")))
    .slice(-limit);
}

function rebuildCloudScenarioAttempts(payloads) {
  return (Array.isArray(payloads) ? payloads : []).map((payload) => {
    const scenario = scenarios.find((item) => item.id === payload?.scenarioId);
    if (!scenario || !Array.isArray(payload?.decisions)) return null;
    const answers = Object.fromEntries(
      payload.decisions
        .filter((decision) => typeof decision?.stepId === "string" && typeof decision?.choiceId === "string")
        .map((decision) => [decision.stepId, decision.choiceId]),
    );
    const graded = gradeAttempt(scenario, answers);
    if (!graded.isComplete) return null;
    return {
      ...graded,
      id: payload.id,
      completedAt: payload.completedAt,
    };
  }).filter(Boolean);
}

export function App() {
  const [profile, setProfile] = useState(readProfile);
  const [examProfile, setExamProfile] = useState(readExamProfile);
  const [lang, setLang] = useState(() => profile.language || "en");
  const [route, setRoute] = useState(() => parseRoute());
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(() => createScenarioSession());
  const [syncStatus, setSyncStatus] = useState("idle");
  const [historyClearPending, setHistoryClearPending] = useState(false);
  const auth = useAuthSession();
  const mainRef = useRef(null);
  const profileRef = useRef(profile);
  const examProfileRef = useRef(examProfile);
  const langRef = useRef(lang);
  const cloudQueueRef = useRef(Promise.resolve());
  const syncGenerationRef = useRef(0);
  const historyClearPromiseRef = useRef(null);
  const historyClearPendingRef = useRef(false);
  const t = (key) => copy[lang][key] || copy.en[key] || key;
  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { examProfileRef.current = examProfile; }, [examProfile]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  function enqueueCloud(task) {
    const request = cloudQueueRef.current.catch(() => undefined).then(task);
    cloudQueueRef.current = request;
    return request;
  }
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute());
      setMenuOpen(false);
    };
    if (!window.location.hash) window.history.replaceState(null, "", "#/home");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [route.page, route.id]);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; document.title = `${PRODUCT_NAME[lang]} · ${t(routeSection(route))}`; }, [lang, route]);
  useEffect(() => {
    if (auth.status !== "ready" || !auth.user) return;
    const authMarker = new URLSearchParams(window.location.search).get("auth");
    if (authMarker !== "confirmed" && authMarker !== "recovery") return;
    window.history.replaceState(null, "", `${window.location.pathname}#/learning`);
    setRoute(parseRoute());
  }, [auth.status, auth.user?.id]);
  useEffect(() => {
    if (auth.status !== "ready") return undefined;
    const generation = ++syncGenerationRef.current;
    if (!auth.user) {
      let owner = "";
      try { owner = window.localStorage.getItem(CACHE_OWNER_STORAGE_KEY) ?? ""; } catch { /* Ignore unavailable storage. */ }
      if (owner) {
        persistProfile(profileRef.current, profileStorageKeyForUser(owner));
        persistExamProfile(examProfileRef.current, examProfileStorageKeyForUser(owner));
        const clearedProfile = createEmptyProfile("", lang);
        const clearedExamProfile = createEmptyExamProfile();
        persistProfile(clearedProfile);
        persistExamProfile(clearedExamProfile);
        try {
          window.localStorage.removeItem(CACHE_OWNER_STORAGE_KEY);
        } catch { /* In-memory reset still protects this view. */ }
        profileRef.current = clearedProfile;
        examProfileRef.current = clearedExamProfile;
        setProfile(clearedProfile);
        setExamProfile(clearedExamProfile);
        setSession(createScenarioSession());
      }
      setSyncStatus("idle");
      return undefined;
    }

    let cancelled = false;
    let owner = "";
    try { owner = window.localStorage.getItem(CACHE_OWNER_STORAGE_KEY) ?? ""; } catch { /* Continue without cache ownership. */ }
    const claimedAfterAccountCreation = consumeLocalHistoryClaim(auth.user.id);
    const mayImportLocal = owner === auth.user.id || (!owner && claimedAfterAccountCreation);
    if (!mayImportLocal) {
      if (owner) {
        persistProfile(profileRef.current, profileStorageKeyForUser(owner));
        persistExamProfile(examProfileRef.current, examProfileStorageKeyForUser(owner));
      }
      const accountProfile = readProfileFromStorage(profileStorageKeyForUser(auth.user.id));
      const accountExamProfile = readExamProfileFromStorage(examProfileStorageKeyForUser(auth.user.id));
      profileRef.current = accountProfile;
      examProfileRef.current = accountExamProfile;
      persistProfile(accountProfile);
      persistExamProfile(accountExamProfile);
      setProfile(accountProfile);
      setExamProfile(accountExamProfile);
      setSession(createScenarioSession());
    }
    try { window.localStorage.setItem(CACHE_OWNER_STORAGE_KEY, auth.user.id); } catch { /* In-memory isolation still applies. */ }
    const localProfile = profileRef.current;
    const localExamProfile = examProfileRef.current;
    persistProfile(localProfile, profileStorageKeyForUser(auth.user.id));
    persistExamProfile(localExamProfile, examProfileStorageKeyForUser(auth.user.id));
    setSyncStatus("syncing");

    enqueueCloud(() => syncLearningHistory({
      userId: auth.user.id,
      language: langRef.current,
      scenarioAttempts: localProfile.attempts,
      questionSetAttempts: localExamProfile.attempts,
    })).then(({ records, historyClearedAt }) => {
      if (cancelled || generation !== syncGenerationRef.current) return;
      const clearedAt = Date.parse(historyClearedAt ?? "");
      const isAfterCloudClear = (attempt) => Number.isNaN(clearedAt)
        || Date.parse(attempt?.completedAt ?? "") > clearedAt;
      const latestProfile = {
        ...profileRef.current,
        attempts: profileRef.current.attempts.filter(isAfterCloudClear),
      };
      const latestExamProfile = {
        ...examProfileRef.current,
        attempts: examProfileRef.current.attempts.filter(isAfterCloudClear),
      };
      const latestLanguage = langRef.current;
      const cloud = splitLearningRecords(records);
      const cloudScenarios = rebuildCloudScenarioAttempts(cloud.scenarioAttempts);
      const mergedProfile = ensureScenarioAttemptMetadata(revalidateProfile({
        ...latestProfile,
        language: latestLanguage,
        attempts: mergeAttemptsById(latestProfile.attempts, cloudScenarios, 500),
      }, scenarios));
      const cloudQuestionSets = cloud.questionSetAttempts
        .map(revalidateExamAttempt)
        .filter(Boolean);
      const mergedExamProfile = {
        schemaVersion: EXAM_PROFILE_VERSION,
        attempts: mergeAttemptsById(latestExamProfile.attempts, cloudQuestionSets, 100),
      };
      persistProfile(mergedProfile);
      persistExamProfile(mergedExamProfile);
      persistProfile(mergedProfile, profileStorageKeyForUser(auth.user.id));
      persistExamProfile(mergedExamProfile, examProfileStorageKeyForUser(auth.user.id));
      profileRef.current = mergedProfile;
      examProfileRef.current = mergedExamProfile;
      setProfile(mergedProfile);
      setExamProfile(mergedExamProfile);
      setSyncStatus("synced");
    }).catch(() => {
      if (!cancelled && generation === syncGenerationRef.current) setSyncStatus("error");
    });

    return () => { cancelled = true; };
  }, [auth.status, auth.user?.id]);

  function setLanguage(next) {
    setLang(next);
    langRef.current = next;
    setProfile((current) => {
      const updated = { ...current, language: next };
      persistProfile(updated);
      if (auth.user) persistProfile(updated, profileStorageKeyForUser(auth.user.id));
      profileRef.current = updated;
      return updated;
    });
    if (auth.user) {
      const generation = syncGenerationRef.current;
      void enqueueCloud(() => updateCloudLanguage(auth.user.id, next))
        .catch(() => {
          if (generation === syncGenerationRef.current) setSyncStatus("error");
        });
    }
  }
  function startScenario(id) { setSession(createScenarioSession(id, profile.attempts.length + 1)); window.location.hash = `#/scenario/${id}`; }
  function completeScenario(scenario, answers) {
    if (historyClearPendingRef.current) {
      setSession((current) => ({ ...current, notice: t("historyClearPending") }));
      return false;
    }
    const graded = gradeAttempt(scenario, answers);
    if (!graded.isComplete) return false;
    const attempt = addScenarioAttemptMetadata(graded);
    setProfile((current) => {
      const updated = mergeAttempt(current, attempt);
      persistProfile(updated);
      if (auth.user) persistProfile(updated, profileStorageKeyForUser(auth.user.id));
      profileRef.current = updated;
      return updated;
    });
    if (auth.user) {
      const generation = syncGenerationRef.current;
      setSyncStatus("syncing");
      void enqueueCloud(() => saveLearningAttempt(auth.user.id, "scenario", attempt))
        .then(() => {
          if (generation === syncGenerationRef.current) setSyncStatus("synced");
        })
        .catch(() => {
          if (generation === syncGenerationRef.current) setSyncStatus("error");
        });
    }
    window.location.hash = `#/result/${scenario.id}`;
    return true;
  }
  function completeQuestionSet(attempt) {
    if (historyClearPendingRef.current) return false;
    setExamProfile((current) => {
      const withoutDuplicate = current.attempts.filter((item) => item.id !== attempt.id);
      const updated = { schemaVersion: EXAM_PROFILE_VERSION, attempts: [...withoutDuplicate, attempt].slice(-100) };
      persistExamProfile(updated);
      if (auth.user) persistExamProfile(updated, examProfileStorageKeyForUser(auth.user.id));
      examProfileRef.current = updated;
      return updated;
    });
    if (auth.user) {
      const generation = syncGenerationRef.current;
      setSyncStatus("syncing");
      void enqueueCloud(() => saveLearningAttempt(auth.user.id, "question-set", attempt))
        .then(() => {
          if (generation === syncGenerationRef.current) setSyncStatus("synced");
        })
        .catch(() => {
          if (generation === syncGenerationRef.current) setSyncStatus("error");
        });
    }
    return true;
  }
  async function clearLearningHistory() {
    if (historyClearPromiseRef.current) return historyClearPromiseRef.current;
    historyClearPendingRef.current = true;
    setHistoryClearPending(true);
    const userId = auth.user?.id ?? "";
    const generation = ++syncGenerationRef.current;
    const scenarioAttemptIdsToClear = new Set(
      profileRef.current.attempts.filter((attempt) => attempt.isComplete).map((attempt) => attempt.id),
    );
    const questionSetIdsToClear = new Set(
      examProfileRef.current.attempts.filter((attempt) => attempt.isComplete).map((attempt) => attempt.id),
    );
    const operation = (async () => {
      if (userId) {
        setSyncStatus("syncing");
        await enqueueCloud(() => deleteCloudLearningHistory(userId));
      }
      if (generation !== syncGenerationRef.current) return false;
      const clearedProfile = {
        ...profileRef.current,
        language: langRef.current,
        attempts: retainAttemptsAfterHistoryClear(
          profileRef.current.attempts,
          scenarioAttemptIdsToClear,
        ),
      };
      const clearedExamProfile = {
        ...examProfileRef.current,
        attempts: retainAttemptsAfterHistoryClear(
          examProfileRef.current.attempts,
          questionSetIdsToClear,
        ),
      };
      persistProfile(clearedProfile);
      persistExamProfile(clearedExamProfile);
      if (userId) {
        persistProfile(clearedProfile, profileStorageKeyForUser(userId));
        persistExamProfile(clearedExamProfile, examProfileStorageKeyForUser(userId));
      }
      profileRef.current = clearedProfile;
      examProfileRef.current = clearedExamProfile;
      setProfile(clearedProfile);
      setExamProfile(clearedExamProfile);
      if (userId) setSyncStatus("synced");
      return true;
    })();
    historyClearPromiseRef.current = operation;
    try {
      return await operation;
    } catch {
      if (generation === syncGenerationRef.current) setSyncStatus("error");
      return false;
    } finally {
      if (historyClearPromiseRef.current === operation) historyClearPromiseRef.current = null;
      historyClearPendingRef.current = false;
      setHistoryClearPending(false);
    }
  }
  async function signOutCurrentDevice() {
    const userId = auth.user?.id;
    if (!userId) return;
    const generation = ++syncGenerationRef.current;
    setSyncStatus("syncing");
    persistProfile(profileRef.current, profileStorageKeyForUser(userId));
    persistExamProfile(examProfileRef.current, examProfileStorageKeyForUser(userId));
    try {
      await enqueueCloud(() => syncLearningHistory({
        userId,
        language: langRef.current,
        scenarioAttempts: profileRef.current.attempts,
        questionSetAttempts: examProfileRef.current.attempts,
      }));
    } catch {
      if (generation === syncGenerationRef.current) setSyncStatus("error");
    }
    const result = await signOutAndClearLocalLearningCache({
      signOut: auth.signOut,
      storage: window.localStorage,
      keys: [
        profileStorageKeyForUser(userId),
        examProfileStorageKeyForUser(userId),
        examSessionStorageKey(userId),
        CACHE_OWNER_STORAGE_KEY,
        LOCAL_HISTORY_CLAIM_KEY,
      ],
    });
    const clearedProfile = createEmptyProfile("", langRef.current);
    const clearedExamProfile = createEmptyExamProfile();
    persistProfile(clearedProfile);
    persistExamProfile(clearedExamProfile);
    profileRef.current = clearedProfile;
    examProfileRef.current = clearedExamProfile;
    setProfile(clearedProfile);
    setExamProfile(clearedExamProfile);
    setSession(createScenarioSession());
    setSyncStatus(result.ok ? "idle" : "error");
  }
  function exportLearningData() {
    const payload = {
      product: "Nursing Hypotheses",
      purpose: "learner-requested educational data export",
      exportedAt: new Date().toISOString(),
      language: langRef.current,
      scenarioLearning: profileRef.current,
      questionPractice: examProfileRef.current,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nursing-hypotheses-learning-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
  let cacheOwner = "";
  try { cacheOwner = window.localStorage.getItem(CACHE_OWNER_STORAGE_KEY) ?? ""; } catch { /* Default to the empty view below. */ }
  const cacheIsVisible = !cacheOwner
    || (auth.status === "ready" && auth.user?.id === cacheOwner);
  const visibleProfile = cacheIsVisible ? profile : createEmptyProfile("", lang);
  const visibleExamProfile = cacheIsVisible ? examProfile : createEmptyExamProfile();
  const visibleScenarioSession = cacheIsVisible ? session : createScenarioSession();
  let page;
  if (route.page === "scenarios") page = <ScenarioLibrary lang={lang} t={t} profile={visibleProfile} onStart={startScenario} />;
  else if (route.page === "scenario") page = <ScenarioPage scenarioId={route.id} lang={lang} t={t} session={visibleScenarioSession} setSession={setSession} onComplete={completeScenario} />;
  else if (route.page === "result") page = <ResultPage scenarioId={route.id} lang={lang} t={t} profile={visibleProfile} onStart={startScenario} />;
  else if (route.page === "questions") {
    const storageKey = examSessionStorageKey(auth.user?.id);
    page = <QuestionBankPage key={storageKey} lang={lang} t={t} examProfile={visibleExamProfile} onComplete={completeQuestionSet} storageKey={storageKey} historyClearPending={historyClearPending} />;
  }
  else if (route.page === "learning") page = <LearningPage lang={lang} t={t} profile={visibleProfile} examProfile={visibleExamProfile} onClearHistory={clearLearningHistory} onStart={startScenario} auth={auth} syncStatus={syncStatus} onSignOut={signOutCurrentDevice} onExportLearningData={exportLearningData} />;
  else if (route.page === "resources") page = <ReferencesPage lang={lang} t={t} />;
  else if (route.page === "about") page = <AboutPage t={t} />;
  else if (route.page === "privacy") page = <PolicyPage kind="privacy" lang={lang} t={t} />;
  else if (route.page === "terms") page = <PolicyPage kind="terms" lang={lang} t={t} />;
  else if (route.page === "contact") page = <PolicyPage kind="contact" lang={lang} t={t} />;
  else page = <HomePage lang={lang} t={t} onStart={startScenario} profile={visibleProfile} />;
  return <div className="app-shell"><Header lang={lang} setLanguage={setLanguage} route={route} menuOpen={menuOpen} setMenuOpen={setMenuOpen} t={t} auth={auth} syncStatus={syncStatus} /><main id="main-content" ref={mainRef} tabIndex="-1">{page}</main><NursingAssistant lang={lang} /><Footer lang={lang} t={t} /></div>;
}
