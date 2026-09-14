export function localizeSepsisText(value, language) {
  return value?.[language] ?? value?.en ?? value?.ar ?? "";
}

export const SEPSIS_QUIZ_QUESTIONS = [
  {
    id: "sepsis-definition",
    prompt: {
      ar: "ما التعريف الوارد للإنتان (Sepsis) في البروتوكول؟",
      en: "How does the protocol define sepsis?",
    },
    options: [
      {
        id: "organ-dysfunction",
        text: {
          ar: "خلل وظيفي مهدد للحياة في الأعضاء ينتج عن استجابة غير منضبطة من الجسم للعدوى",
          en: "Life-threatening organ dysfunction caused by a dysregulated host response to infection",
        },
      },
      { id: "infection-only", text: { ar: "وجود عدوى مؤكدة فقط، بصرف النظر عن حالة الأعضاء", en: "Any confirmed infection, regardless of organ function" } },
      { id: "fever-only", text: { ar: "ارتفاع درجة الحرارة وحده لدى أي مريض", en: "Fever alone in any patient" } },
      { id: "hypotension-only", text: { ar: "انخفاض ضغط الدم وحده من دون ارتباط بالعدوى", en: "Low blood pressure alone without a link to infection" } },
    ],
    correctOptionId: "organ-dysfunction",
    rationale: {
      ar: "يربط التعريف بين خلل الأعضاء المهدد للحياة وبين استجابة الجسم غير المنضبطة للعدوى؛ ولا تكفي علامة منفردة لتعريف الإنتان.",
      en: "The definition links life-threatening organ dysfunction to a dysregulated response to infection; one isolated sign does not define sepsis.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٢ (الصفحة المطبوعة ١/١٠)، البند ٢.١؛ وKSAMC-IPP-443، صفحة PDF ١، البند ٢.١.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 2 (printed p. 1/10), section 2.1; and KSAMC-IPP-443, PDF p. 1, section 2.1.",
    },
    referenceIds: ["sepsis-madinah-protocol", "sepsis-ksamc-ipp-443"],
  },
  {
    id: "qsofa-components",
    prompt: { ar: "أي مجموعة تمثل عناصر qSOFA الثلاثة الواردة في البروتوكول؟", en: "Which set contains the three qSOFA elements listed in the protocol?" },
    options: [
      {
        id: "rr-sbp-mentation",
        text: {
          ar: "معدل تنفس ≥ ٢٢/دقيقة، ضغط انقباضي ≤ ١٠٠ ملم زئبق، وتغير الحالة الذهنية (GCS < 15)",
          en: "Respiratory rate ≥22/min, systolic blood pressure ≤100 mmHg, and altered mentation (GCS <15)",
        },
      },
      { id: "temperature-heart-rate-glucose", text: { ar: "درجة الحرارة، معدل القلب، وسكر الدم", en: "Temperature, heart rate, and blood glucose" } },
      { id: "oxygen-urine-lactate", text: { ar: "تشبع الأكسجين، إدرار البول، واللاكتات", en: "Oxygen saturation, urine output, and lactate" } },
      { id: "wbc-pain-creatinine", text: { ar: "كريات الدم البيضاء، الألم، والكرياتينين", en: "White blood cell count, pain, and creatinine" } },
    ],
    correctOptionId: "rr-sbp-mentation",
    rationale: {
      ar: "يعطي qSOFA نقطة لكل واحد من ثلاثة عناصر: معدل التنفس ≥ ٢٢، الضغط الانقباضي ≤ ١٠٠، وتغير الحالة الذهنية بدرجة GCS أقل من ١٥.",
      en: "qSOFA assigns one point for each of three elements: respiratory rate ≥22, systolic pressure ≤100, and altered mentation with GCS below 15.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٣ (الصفحة المطبوعة ٢/١٠)، البنود ٢.٧.١-٢.٧.٣.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 3 (printed p. 2/10), sections 2.7.1-2.7.3.",
    },
    referenceIds: ["sepsis-madinah-protocol"],
  },
  {
    id: "qsofa-scenario",
    prompt: {
      ar: "مريض لديه اشتباه عدوى: معدل التنفس ٢٤/دقيقة، الضغط الانقباضي ٩٨ ملم زئبق، وGCS يساوي ١٥. ما درجة qSOFA؟",
      en: "A patient with suspected infection has RR 24/min, SBP 98 mmHg, and GCS 15. What is the qSOFA score?",
    },
    options: [
      { id: "zero", text: { ar: "٠", en: "0" } },
      { id: "one", text: { ar: "١", en: "1" } },
      { id: "two", text: { ar: "٢", en: "2" } },
      { id: "three", text: { ar: "٣", en: "3" } },
    ],
    correctOptionId: "two",
    rationale: {
      ar: "معدل التنفس ٢٤ يحقق معيار ≥ ٢٢، والضغط ٩٨ يحقق معيار ≤ ١٠٠، بينما GCS = 15 لا يحقق معيار GCS < 15؛ المجموع نقطتان.",
      en: "RR 24 meets the ≥22 criterion and SBP 98 meets the ≤100 criterion; GCS 15 does not meet the GCS <15 criterion, for a total of two points.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٣ (الصفحة المطبوعة ٢/١٠)، البنود ٢.٧.١-٢.٧.٣.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 3 (printed p. 2/10), sections 2.7.1-2.7.3.",
    },
    referenceIds: ["sepsis-madinah-protocol"],
  },
  {
    id: "qsofa-meaning",
    prompt: { ar: "ماذا تعني درجة qSOFA تساوي ٢ أو أكثر وفق الوثيقة؟", en: "According to the document, what does a qSOFA score of 2 or more mean?" },
    options: [
      { id: "high-risk-evaluate", text: { ar: "تشير إلى خطورة مرتفعة وتستدعي تقييمًا عاجلًا؛ وليست تشخيصًا مستقلًا", en: "It suggests high risk and should prompt urgent evaluation; it is not a stand-alone diagnosis" } },
      { id: "rules-out", text: { ar: "تنفي الإنتان إذا لم توجد حمى", en: "It rules out sepsis when fever is absent" } },
      { id: "confirms-shock", text: { ar: "تؤكد الصدمة الإنتانية وحدها", en: "It confirms septic shock by itself" } },
      { id: "no-action", text: { ar: "لا تتطلب أي تقييم إضافي", en: "It requires no further evaluation" } },
    ],
    correctOptionId: "high-risk-evaluate",
    rationale: {
      ar: "تصف الوثيقة qSOFA كأداة فحص، وتذكر أن الدرجة ≥ ٢ تشير إلى خطورة مرتفعة وتستدعي تقييمًا عاجلًا. لذلك لا تُستخدم وحدها كتشخيص.",
      en: "The document describes qSOFA as a screening tool and says a score ≥2 suggests high risk and should prompt urgent evaluation, so it is not used alone as a diagnosis.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٣ (الصفحة المطبوعة ٢/١٠)، البندان ٢.٧ و٢.٧.٤.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 3 (printed p. 2/10), sections 2.7 and 2.7.4.",
    },
    referenceIds: ["sepsis-madinah-protocol"],
  },
  {
    id: "ksamc-activation",
    prompt: { ar: "وفق بروتوكول KSAMC والملصق التعليمي، متى يُفعّل مسار الإنتان المعروض؟", en: "Under the KSAMC protocol and the educational poster, when is the displayed sepsis pathway activated?" },
    options: [
      { id: "qsofa-plus-infection", text: { ar: "عند qSOFA ≥ ٢ مع اشتباه عدوى", en: "When qSOFA is ≥2 with suspected infection" } },
      { id: "qsofa-alone", text: { ar: "عند qSOFA ≥ ٢ من دون النظر إلى الاشتباه بالعدوى", en: "Whenever qSOFA is ≥2, regardless of suspected infection" } },
      { id: "fever-only", text: { ar: "عند وجود حمى فقط", en: "When fever alone is present" } },
      { id: "after-confirmation", text: { ar: "بعد انتظار تأكيد العدوى مخبريًا دائمًا", en: "Only after laboratory confirmation of infection" } },
    ],
    correctOptionId: "qsofa-plus-infection",
    rationale: {
      ar: "يربط مسار التفعيل المعروض بين qSOFA ≥ ٢ وبين اشتباه العدوى. هذا يعكس الوثيقة المرفقة ولا يستبدل بروتوكول المنشأة المعتمد.",
      en: "The displayed activation pathway links qSOFA ≥2 with suspected infection. This reflects the attached document and does not replace an approved facility protocol.",
    },
    source: {
      ar: "KSAMC، Sepsis Management and Septic Shock (KSAMC-IPP-443)، صفحة PDF ٢ (الصفحة المطبوعة ٢/٩)، البند ٤.٣؛ وملصق Nursing Clinical Flow Guide، الخطوة ٣.",
      en: "KSAMC, Sepsis Management and Septic Shock (KSAMC-IPP-443), PDF p. 2 (printed p. 2/9), section 4.3; and the Nursing Clinical Flow Guide poster, step 3.",
    },
    referenceIds: ["sepsis-ksamc-ipp-443", "sepsis-nursing-flow-guide"],
  },
  {
    id: "who-can-initiate",
    prompt: { ar: "وفق بروتوكول Madinah Health Cluster، من يمكنه بدء بروتوكول الإنتان عند الاشتباه؟", en: "According to the Madinah Health Cluster protocol, who may initiate the sepsis protocol when sepsis is suspected?" },
    options: [
      { id: "any-provider", text: { ar: "أي مقدم رعاية صحية يشتبه بالإنتان", en: "Any healthcare provider who suspects sepsis" } },
      { id: "icu-only", text: { ar: "طبيب العناية المركزة فقط", en: "Only an intensive-care physician" } },
      { id: "lab-only", text: { ar: "المختبر فقط بعد ظهور النتائج", en: "Only the laboratory after results are available" } },
      { id: "management-only", text: { ar: "الإدارة التنفيذية فقط", en: "Only executive management" } },
    ],
    correctOptionId: "any-provider",
    rationale: {
      ar: "ينص بند التفعيل على أن أي مقدم رعاية صحية يشتبه بالإنتان يمكنه بدء البروتوكول، دعمًا للاكتشاف والتصعيد المبكرين.",
      en: "The activation section says any healthcare provider who suspects sepsis may initiate the protocol, supporting early recognition and escalation.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٥ (الصفحة المطبوعة ٤/١٠)، البند ٦.٢.١.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 5 (printed p. 4/10), section 6.2.1.",
    },
    referenceIds: ["sepsis-madinah-protocol"],
  },
  {
    id: "team-response",
    prompt: { ar: "ما الزمن المستهدف لاستجابة الفريق متعدد التخصصات بعد تفعيل Code Sepsis في المصادر المعروضة؟", en: "What multidisciplinary team response time is stated after Code Sepsis activation in the displayed sources?" },
    options: [
      { id: "five-minutes", text: { ar: "خلال ٥ دقائق", en: "Within 5 minutes" } },
      { id: "thirty-minutes", text: { ar: "خلال ٣٠ دقيقة", en: "Within 30 minutes" } },
      { id: "one-hour", text: { ar: "خلال ساعة", en: "Within 1 hour" } },
      { id: "four-hours", text: { ar: "خلال ٤ ساعات", en: "Within 4 hours" } },
    ],
    correctOptionId: "five-minutes",
    rationale: {
      ar: "يذكر بروتوكول Madinah Health Cluster والملصق أن استجابة الفريق متعدد التخصصات تكون خلال خمس دقائق من التفعيل.",
      en: "The Madinah Health Cluster protocol and poster state that the multidisciplinary team responds within five minutes of activation.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٥ (الصفحة المطبوعة ٤/١٠)، البند ٦.٢.٢؛ وملصق Nursing Clinical Flow Guide، الخطوة ٣.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 5 (printed p. 4/10), section 6.2.2; and the Nursing Clinical Flow Guide poster, step 3.",
    },
    referenceIds: ["sepsis-madinah-protocol", "sepsis-nursing-flow-guide"],
  },
  {
    id: "time-zero",
    prompt: { ar: "ما المقصود بـ Time Zero في بروتوكول Madinah Health Cluster؟", en: "What does Time Zero mean in the Madinah Health Cluster protocol?" },
    options: [
      { id: "recognition-or-activation", text: { ar: "الوقت الموثق لأول تعرّف على الإنتان أو الصدمة الإنتانية و/أو تفعيل Code Sepsis", en: "The documented time sepsis or septic shock is first recognized and/or Code Sepsis is activated" } },
      { id: "admission-time", text: { ar: "وقت دخول المريض إلى المستشفى فقط", en: "The hospital admission time only" } },
      { id: "lab-result-time", text: { ar: "وقت صدور أول نتيجة مخبرية فقط", en: "The first laboratory-result time only" } },
      { id: "discharge-time", text: { ar: "وقت خروج المريض من القسم", en: "The time the patient leaves the department" } },
    ],
    correctOptionId: "recognition-or-activation",
    rationale: {
      ar: "Time Zero هو نقطة مرجعية زمنية موثقة تبدأ عند أول تعرّف و/أو تفعيل Code Sepsis لقياس الالتزام بالتدخلات الحساسة للوقت.",
      en: "Time Zero is the documented reference point at first recognition and/or Code Sepsis activation for measuring time-sensitive interventions.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٣ (الصفحة المطبوعة ٢/١٠)، البند ٢.٩.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 3 (printed p. 2/10), section 2.9.",
    },
    referenceIds: ["sepsis-madinah-protocol"],
  },
  {
    id: "cultures-before-antimicrobials",
    prompt: { ar: "أي عبارة تطابق الوثيقة بشأن أخذ العينات الميكروبيولوجية قبل العلاج المضاد للميكروبات؟", en: "Which statement matches the document on obtaining microbiological cultures before antimicrobial treatment?" },
    options: [
      { id: "without-delay", text: { ar: "تؤخذ من المواقع المحتملة قبل بدء العلاج إذا أمكن ذلك من دون تأخير علاجي ملحوظ", en: "Obtain them from potential sites before treatment when this can be done without a meaningful treatment delay" } },
      { id: "wait-for-results", text: { ar: "يجب انتظار نتائج جميع العينات قبل بدء أي علاج دائمًا", en: "Always wait for every culture result before starting any treatment" } },
      { id: "never-needed", text: { ar: "لا حاجة للعينات عند الاشتباه بالإنتان", en: "Cultures are never needed when sepsis is suspected" } },
      { id: "after-treatment-only", text: { ar: "لا تؤخذ العينات إلا بعد انتهاء العلاج", en: "Cultures are obtained only after treatment is completed" } },
    ],
    correctOptionId: "without-delay",
    rationale: {
      ar: "تذكر الوثيقة أخذ العينات من المواقع المحتملة، ومنها الدم، قبل العلاج عندما لا يسبب ذلك تأخيرًا يتجاوز ٤٥ دقيقة في بدء العلاج المضاد للميكروبات.",
      en: "The document says to obtain cultures from potential sites, including blood, before treatment when doing so does not delay antimicrobial therapy by more than 45 minutes.",
    },
    source: {
      ar: "KSAMC، Sepsis Management and Septic Shock (KSAMC-IPP-443)، صفحة PDF ٣ (الصفحة المطبوعة ٣/٩)، البند ٤.٥.١.",
      en: "KSAMC, Sepsis Management and Septic Shock (KSAMC-IPP-443), PDF p. 3 (printed p. 3/9), section 4.5.1.",
    },
    referenceIds: ["sepsis-ksamc-ipp-443"],
  },
  {
    id: "ongoing-care",
    prompt: { ar: "أي وصف يعبّر أفضل عن الرعاية المستمرة في الساعات اللاحقة وفق البروتوكول والملصق؟", en: "Which description best reflects ongoing care in the following hours according to the protocol and poster?" },
    options: [
      { id: "reassess-and-escalate", text: { ar: "مراقبة العلامات الحيوية والاستجابة، إعادة التقييم والفحوصات عند الحاجة، ضبط الخطة، تقييم ضبط مصدر العدوى، والتوثيق والتصعيد عند التدهور", en: "Monitor vital signs and response, reassess and repeat indicated tests, adjust the plan, assess source control, document, and escalate deterioration" } },
      { id: "single-check", text: { ar: "إجراء فحص واحد ثم إيقاف المتابعة إذا لم يتغير شيء مباشرة", en: "Perform one check and stop monitoring if nothing changes immediately" } },
      { id: "wait-without-reassessment", text: { ar: "الانتظار من دون إعادة تقييم حتى نهاية الوردية", en: "Wait without reassessment until the end of the shift" } },
      { id: "vitals-only", text: { ar: "توثيق العلامات الحيوية فقط من دون مراجعة الاستجابة أو التصعيد", en: "Record vital signs only, without reviewing response or escalating" } },
    ],
    correctOptionId: "reassess-and-escalate",
    rationale: {
      ar: "الرعاية المستمرة عملية ديناميكية: متابعة متكررة، تقييم الاستجابة ووظائف الأعضاء والفحوصات المطلوبة، ضبط مصدر العدوى، توثيق واضح، وتصعيد مبكر إذا لم يتحسن المريض أو تدهور.",
      en: "Ongoing care is dynamic: frequent monitoring, reassessment of response, organ function and indicated tests, source control, clear documentation, and early escalation when the patient does not improve or deteriorates.",
    },
    source: {
      ar: "Madinah Health Cluster، Sepsis Protocol and Code، صفحة PDF ٨ (الصفحة المطبوعة ٧/١٠)، البنود ٧.٣.١-٧.٣.٤؛ وملصق Nursing Clinical Flow Guide، الخطوات ٥-٧.",
      en: "Madinah Health Cluster, Sepsis Protocol and Code, PDF p. 8 (printed p. 7/10), sections 7.3.1-7.3.4; and the Nursing Clinical Flow Guide poster, steps 5-7.",
    },
    referenceIds: ["sepsis-madinah-protocol", "sepsis-nursing-flow-guide"],
  },
];

export const SEPSIS_QUIZ_TOTAL = SEPSIS_QUIZ_QUESTIONS.length;

export function withSepsisAnswer(answers, questionId, optionId) {
  return { ...answers, [questionId]: optionId };
}

function hasValidAnswer(question, answers) {
  return question.options.some((option) => option.id === answers[question.id]);
}

export function answeredSepsisQuestionCount(questions, answers) {
  return questions.reduce((count, question) => count + Number(hasValidAnswer(question, answers)), 0);
}

export function isSepsisQuizComplete(questions, answers) {
  return answeredSepsisQuestionCount(questions, answers) === questions.length;
}

export function scoreSepsisQuiz(questions, answers) {
  return questions.reduce((score, question) => score + Number(answers[question.id] === question.correctOptionId), 0);
}

export function sepsisScoreBand(score, total) {
  if (total <= 0) return "review";
  const ratio = Math.max(0, Math.min(score, total)) / total;
  if (ratio >= 0.8) return "excellent";
  if (ratio >= 0.6) return "good";
  return "review";
}

export function boundedSepsisQuestionIndex(index, total) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(index, total - 1));
}

export const SEPSIS_QUIZ_COPY = {
  ar: {
    eyebrow: "SEPSIS · 10 أسئلة",
    title: "اختبار Sepsis",
    subtitle: "اختبار مركز في الاكتشاف المبكر، وqSOFA، وتفعيل مسار الإنتان والتصعيد.",
    tenQuestions: "١٠ أسئلة",
    onePointEach: "درجة واحدة لكل سؤال",
    privateSession: "المحاولة منفصلة عن بنك الأسئلة",
    start: "ابدأ اختبار Sepsis",
    progressLabel: "تقدم اختبار Sepsis",
    questionOf: (current, total) => `السؤال ${current} من ${total}`,
    answeredOf: (answered, total) => `أجبت عن ${answered} من ${total}`,
    previous: "السابق",
    next: "التالي",
    showResult: "اعرض النتيجة",
    chooseAnswer: "اختر إجابة للمتابعة.",
    noSavedAnswers: "تبقى إجابات هذه المحاولة داخل الصفحة فقط حتى تغلقها أو تعيد الاختبار.",
    resultsTitle: "نتيجة اختبار Sepsis",
    answerReview: "مراجعة الإجابات",
    correct: "صحيحة",
    incorrect: "غير صحيحة",
    yourAnswer: "إجابتك",
    correctAnswer: "الإجابة الصحيحة",
    rationale: "التفسير",
    unanswered: "لم تُجب",
    retry: "أعد اختبار Sepsis",
    viewReferences: "مراجع اختبار Sepsis",
    bands: {
      excellent: { title: "فهم قوي للمحتوى", description: "أجبت بدقة على معظم نقاط الاكتشاف المبكر والتصعيد." },
      good: { title: "أساس جيد", description: "راجع تفسيرات الأسئلة التي فاتتك قبل إعادة المحاولة." },
      review: { title: "تحتاج مراجعة مركزة", description: "راجع تفسيرات الإجابات ثم جرّب الاختبار مرة أخرى." },
    },
  },
  en: {
    eyebrow: "SEPSIS · 10 QUESTIONS",
    title: "Sepsis Quiz",
    subtitle: "A focused quiz on early recognition, qSOFA, pathway activation, and escalation.",
    tenQuestions: "10 questions",
    onePointEach: "One point per question",
    privateSession: "Separate from the general question bank",
    start: "Start the Sepsis Quiz",
    progressLabel: "Sepsis Quiz progress",
    questionOf: (current, total) => `Question ${current} of ${total}`,
    answeredOf: (answered, total) => `Answered ${answered} of ${total}`,
    previous: "Previous",
    next: "Next",
    showResult: "Show result",
    chooseAnswer: "Choose an answer to continue.",
    noSavedAnswers: "Answers stay on this page only until you close it or restart the quiz.",
    resultsTitle: "Sepsis Quiz result",
    answerReview: "Answer review",
    correct: "Correct",
    incorrect: "Incorrect",
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    rationale: "Rationale",
    unanswered: "Not answered",
    retry: "Retake the Sepsis Quiz",
    viewReferences: "Sepsis Quiz references",
    bands: {
      excellent: { title: "Strong understanding", description: "You answered most early-recognition and escalation points accurately." },
      good: { title: "Good foundation", description: "Review the explanations for the questions you missed before trying again." },
      review: { title: "Focused review needed", description: "Review the answer explanations, then retake the quiz." },
    },
  },
};
