/*
 * Nursing Hypotheses — clean-room expansion B.
 *
 * These original bilingual items use public clinical guidance only as factual
 * context. No recalled, secure, commercial, PDF-bank, or third-party question
 * wording was used. All items remain drafts pending qualified clinical, legal,
 * and Arabic-language review before public clinical use.
 */

import { references as scenarioReferences } from "./scenarios.js";

const bi = (en, ar) => ({ en, ar });

const DRAFT_DATE = "2026-09-05";
const INTAKE_POLICY_VERSION = "2026-09-05";

const domainLabels = {
  "mental-health": bi("Mental Health", "الصحة النفسية"),
  pharmacology: bi("Pharmacology", "علم الأدوية"),
  fundamentals: bi("Fundamentals", "أساسيات التمريض"),
  "management-safety": bi("Management / Safety", "الإدارة / السلامة"),
};

const categoryLabels = {
  "saudi-nursing-adult": bi("Adult and older-person care", "رعاية البالغين وكبار السن"),
  "saudi-nursing-fundamentals": bi("Foundations of safe nursing practice", "أسس الممارسة التمريضية الآمنة"),
  "saudi-nursing-management": bi("Team coordination and nursing leadership", "تنسيق الفريق والقيادة التمريضية"),
  "international-management": bi("Care prioritisation and coordination", "ترتيب أولويات الرعاية وتنسيقها"),
  "international-safety-infection": bi("Preventing harm and transmission", "منع الضرر وانتقال العدوى"),
  "international-psychosocial": bi("Emotional, behavioural and social care", "الرعاية النفسية والسلوكية والاجتماعية"),
  "international-basic-care": bi("Daily care, mobility and comfort", "العناية اليومية والحركة والراحة"),
  "international-pharmacology": bi("Medication and infusion safety", "سلامة الأدوية والتسريب"),
  "computerized-medication-safety": bi("Medication and treatment safety", "سلامة الأدوية والعلاجات"),
  "computerized-family-psychosocial": bi("Family, maternity and psychosocial care", "رعاية الأسرة والأمومة والصحة النفسية"),
};

const competencyLabels = {
  "assessment-recognition": bi("Assessment and recognition", "التقييم والتعرّف على الحالة"),
  "priority-response": bi("Priority response", "الاستجابة ذات الأولوية"),
  "therapeutic-communication": bi("Therapeutic communication", "التواصل العلاجي"),
  "reassessment-monitoring": bi("Reassessment and monitoring", "إعادة التقييم والمراقبة"),
  "medication-safety": bi("Medication safety", "سلامة الأدوية"),
  "care-coordination": bi("Care coordination", "تنسيق الرعاية"),
  "fundamental-care": bi("Fundamental nursing care", "الرعاية التمريضية الأساسية"),
  "infection-safety": bi("Infection prevention and device safety", "الوقاية من العدوى وسلامة الأجهزة"),
  "aseptic-practice": bi("Aseptic and sterile practice", "الممارسة المعقمة واللاتلوثية"),
  "delegation-supervision": bi("Delegation and supervision", "التفويض والإشراف"),
  "communication-handoff": bi("Structured communication and handoff", "التواصل المنظم وتسليم الرعاية"),
  "systems-safety": bi("Systems safety", "سلامة الأنظمة"),
};

const difficultyLabels = {
  foundation: bi("Foundation", "تأسيسي"),
  intermediate: bi("Intermediate", "متوسط"),
  advanced: bi("Advanced", "متقدم"),
};

export const questionBankExpansionBReferenceIds = Object.freeze([
  "joint-commission-suicide-risk-2026",
  "nice-violence-aggression-ng10",
  "nice-panic-cg113",
  "queensland-mental-health-manual-2025",
  "dailymed-potassium-chloride-2026",
  "ismp-high-alert-acute-care-2024",
  "ada-hospital-care-2026",
  "who-medication-safety-2024",
  "aha-opioid-emergency-2025",
  "who-medication-transitions-2019",
  "nice-perioperative-care-ng180",
  "cdc-cauti-prevention",
  "cdc-sterilization-summary",
  "scfhs-scope-2023",
  "who-surgical-safety-checklist",
  "ahrq-sbar",
  "psmf-handoff-communication-2023",
  "joint-commission-patient-identification-2026",
]);

const expansionReferenceIdSet = new Set(questionBankExpansionBReferenceIds);

export const questionBankExpansionBSources = scenarioReferences.filter((reference) =>
  expansionReferenceIdSet.has(reference.id),
);

const missingReferenceIds = questionBankExpansionBReferenceIds.filter(
  (referenceId) => !questionBankExpansionBSources.some((reference) => reference.id === referenceId),
);

if (missingReferenceIds.length) {
  throw new Error(`Missing expansion B references: ${missingReferenceIds.join(", ")}`);
}

const choice = (id, en, ar, rationaleEn, rationaleAr) => ({
  id,
  text: bi(en, ar),
  rationale: bi(rationaleEn, rationaleAr),
});

const makeQuestion = ({ choices, ...question }) => {
  const keyedChoice = choices.find((answer) => answer.id === question.correctOptionId);

  if (!keyedChoice || choices.length !== 4 || new Set(choices.map((answer) => answer.id)).size !== 4) {
    throw new Error(`Invalid four-option question: ${question.id}`);
  }

  return {
    ...question,
    domain: domainLabels[question.domainId],
    category: categoryLabels[question.categoryId],
    competency: competencyLabels[question.competencyId],
    difficulty: difficultyLabels[question.difficultyId],
    options: choices.map(({ rationale: _rationale, ...answer }) => answer),
    rationale: keyedChoice.rationale,
    optionRationales: Object.fromEntries(
      choices.map((answer) => [answer.id, answer.rationale]),
    ),
    evidenceClaims: [{
      id: `${question.id}:correct-answer-rationale`,
      scope: "correct-answer-rationale",
      referenceIds: question.referenceIds,
      status: "mapped-pending-human-verification",
    }],
    intakePolicyVersion: INTAKE_POLICY_VERSION,
    sourceUse: "independent-clinical-context",
    accessTier: "free",
    learningModelVersion: "Independent nursing learning domains v1.6",
    fictional: true,
    official: false,
    reviewStatus: "draft",
    contentDraftDate: DRAFT_DATE,
    clinicalReviewDate: null,
    clinicalReview: {
      status: "pending",
      reviewerName: null,
      reviewerCredential: null,
      reviewerJurisdiction: null,
      reviewedAt: null,
    },
    legalReview: { status: "pending", jurisdictions: [], reviewedAt: null },
    translationReview: { status: "pending", languagePair: "en-ar", reviewedAt: null },
    evidenceReview: {
      status: "mapped-pending-human-verification",
      mappedAt: DRAFT_DATE,
      nextReviewDueAt: null,
    },
    reviewLabel: bi(
      "Draft — pending clinical, legal and Arabic-language review.",
      "مسودة — بانتظار المراجعة السريرية والقانونية واللغوية العربية.",
    ),
    provenance: {
      origin: "independently-authored-clean-room",
      authorId: null,
      authoredAt: DRAFT_DATE,
      sourceQuestionId: null,
      secureItemAttestationId: null,
      similarityReviewId: null,
      clinicalReviewId: null,
      translationReviewId: null,
    },
    claims: {
      official: false,
      examEquivalent: false,
      adaptive: false,
      predictive: false,
      alignmentScope: "independent-learning-domains-only",
    },
    contentVersion: "1.6.0-expansion-b-draft",
  };
};

export const questionBankExpansionBDrafts = [
  // Mental Health — 4 items
  makeQuestion({
    id: "international-mental-suicide-cue-088",
    examId: "international-rn",
    domainId: "mental-health",
    categoryId: "international-psychosocial",
    competencyId: "assessment-recognition",
    topic: bi("Direct suicide-risk assessment", "التقييم المباشر لخطر الانتحار"),
    difficultyId: "advanced",
    stem: bi(
      "During a private visit, a client says, ‘I have given away my favourite belongings because I will not need them.’ What is the nurse's best next response?",
      "خلال مقابلة خاصة، قال المريض: «وزعت مقتنياتي المفضلة لأنني لن أحتاج إليها». ما أفضل استجابة تالية من الممرض؟",
    ),
    choices: [
      choice(
        "a",
        "Reassure the client that these thoughts usually pass and change the subject.",
        "طمئن المريض بأن هذه الأفكار تزول عادةً ثم غيّر الموضوع.",
        "Premature reassurance closes communication and can miss an immediate safety risk.",
        "قد يؤدي الاطمئنان المتسرع إلى إغلاق الحوار وتفويت خطر سلامة فوري.",
      ),
      choice(
        "b",
        "Ask calmly and directly about suicidal thoughts, plan, intent, access to means, and recent self-harm, then follow the immediate safety pathway indicated by the answers.",
        "اسأل بهدوء وبصورة مباشرة عن أفكار الانتحار والخطة والنية وإمكانية الوصول إلى الوسيلة وأي إيذاء ذاتي حديث، ثم اتبع مسار السلامة الفوري الذي تقتضيه الإجابات.",
        "The statement is a warning cue. A direct evidence-based assessment establishes the level of risk and guides monitoring, environmental mitigation, and urgent escalation.",
        "تمثل العبارة علامة تحذيرية. يحدد التقييم المباشر المبني على الدليل مستوى الخطر ويوجه المراقبة وتقليل مخاطر البيئة والتصعيد العاجل.",
      ),
      choice(
        "c",
        "Promise that anything disclosed will remain secret before asking further questions.",
        "عِد المريض بأن كل ما سيقوله سيبقى سرياً قبل طرح أسئلة أخرى.",
        "Absolute secrecy cannot be promised when information may require action to protect the client or others.",
        "لا يمكن الوعد بسرية مطلقة عندما قد تستلزم المعلومات اتخاذ إجراء لحماية المريض أو الآخرين.",
      ),
      choice(
        "d",
        "Wait for the next scheduled review because the client has not used the word suicide.",
        "انتظر المراجعة المجدولة التالية لأن المريض لم يذكر كلمة الانتحار.",
        "Indirect statements and giving possessions away still require prompt, direct risk assessment.",
        "تظل العبارات غير المباشرة وتوزيع المقتنيات تستلزم تقييماً مباشراً وسريعاً للخطر.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["joint-commission-suicide-risk-2026"],
    clinicalRisk: "high-alert",
    riskDomains: ["suicide-safety", "mental-health", "risk-assessment"],
  }),
  makeQuestion({
    id: "saudi-nursing-mental-early-deescalation-089",
    examId: "saudi-nursing",
    domainId: "mental-health",
    categoryId: "saudi-nursing-adult",
    competencyId: "therapeutic-communication",
    topic: bi("Early verbal de-escalation", "خفض التصعيد اللفظي المبكر"),
    difficultyId: "intermediate",
    stem: bi(
      "A client in a busy waiting area begins pacing, clenching both fists, and speaking more loudly after a delay. Which response is most appropriate first?",
      "بدأ مريض في منطقة انتظار مزدحمة بالمشي ذهاباً وإياباً وقبض يديه ورفع صوته بعد تأخر الخدمة. أي استجابة هي الأنسب أولاً؟",
    ),
    choices: [
      choice(
        "a",
        "Have several staff members stand close around the client and speak at the same time.",
        "اطلب من عدة موظفين الوقوف قريباً حول المريض والتحدث في الوقت نفسه.",
        "Crowding and multiple voices can increase perceived threat and agitation.",
        "قد يزيد تطويق المريض وتعدد الأصوات شعوره بالتهديد وهياجه.",
      ),
      choice(
        "b",
        "Use one trained communicator, maintain safe personal space, speak calmly without confrontation, reduce stimulation, and offer simple realistic choices while arranging support.",
        "استخدم متحدثاً واحداً مدرباً، وحافظ على مسافة شخصية آمنة، وتحدث بهدوء دون مواجهة، وقلل المثيرات، وقدّم خيارات بسيطة وواقعية مع ترتيب الدعم.",
        "Early, non-confrontational de-escalation with one communicator, personal space, and practical choices can reduce escalation while preserving safety.",
        "قد يحد خفض التصعيد المبكر وغير التصادمي عبر متحدث واحد ومسافة شخصية وخيارات عملية من التفاقم مع الحفاظ على السلامة.",
      ),
      choice(
        "c",
        "Block the exit and tell the client that the behaviour is unacceptable.",
        "اسدّ المخرج وأخبر المريض بأن سلوكه غير مقبول.",
        "Blocking movement and using a confrontational message can intensify fear or aggression unless a specific safety plan requires restriction.",
        "قد يؤدي تقييد الحركة والرسالة التصادمية إلى زيادة الخوف أو العدوانية ما لم تتطلب خطة سلامة محددة تقييداً.",
      ),
      choice(
        "d",
        "Touch the client's shoulder unexpectedly to gain attention.",
        "المس كتف المريض بصورة مفاجئة لجذب انتباهه.",
        "Unexpected touch can be perceived as threatening and trigger further escalation.",
        "قد يُفهم اللمس المفاجئ على أنه تهديد ويحفز مزيداً من التصعيد.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["nice-violence-aggression-ng10"],
    clinicalRisk: "high-alert",
    riskDomains: ["agitation", "violence-prevention", "de-escalation"],
  }),
  makeQuestion({
    id: "computerized-mental-panic-support-090",
    examId: "computerized-practice",
    domainId: "mental-health",
    categoryId: "computerized-family-psychosocial",
    competencyId: "therapeutic-communication",
    topic: bi("Immediate support during panic", "الدعم الفوري أثناء نوبة الهلع"),
    difficultyId: "intermediate",
    stem: bi(
      "A client develops intense fear, trembling, and rapid breathing in clinic. An immediate physical assessment finds stable circulation and no acute medical red flags. What is the best nursing response now?",
      "أصيب مريض في العيادة بخوف شديد ورعشة وتسارع في التنفس. أظهر التقييم الجسدي الفوري استقرار الدورة الدموية وعدم وجود علامات حمراء طبية حادة. ما أفضل استجابة تمريضية الآن؟",
    ),
    choices: [
      choice(
        "a",
        "Stay with the client, move to a quieter space when safe, use short calm statements, guide slower breathing, and continue reassessment.",
        "ابقَ مع المريض، وانتقل إلى مكان أهدأ عندما يكون ذلك آمناً، واستخدم عبارات قصيرة وهادئة، ووجّه التنفس ليصبح أبطأ، وواصل إعادة التقييم.",
        "Calm presence, reduced stimulation, simple communication, breathing support, and continued observation are appropriate after urgent physical causes have been assessed.",
        "يُعد الحضور الهادئ وتقليل المثيرات والتواصل البسيط ودعم التنفس واستمرار المراقبة مناسباً بعد تقييم الأسباب الجسدية العاجلة.",
      ),
      choice(
        "b",
        "Give the client a paper bag and instruct repeated breathing into it.",
        "أعطِ المريض كيساً ورقياً واطلب منه تكرار التنفس داخله.",
        "Paper-bag rebreathing can be unsafe if the presentation is misclassified and is not a substitute for assessment and supportive breathing guidance.",
        "قد يكون التنفس داخل كيس ورقي غير آمن إذا أسيء تصنيف الحالة، ولا يحل محل التقييم ودعم نمط التنفس.",
      ),
      choice(
        "c",
        "Leave the client alone so attention does not reinforce the episode.",
        "اترك المريض وحده حتى لا يعزز الاهتمام النوبة.",
        "Leaving a highly distressed person alone removes reassurance and delays recognition if the condition changes.",
        "يحرم ترك الشخص شديد الضيق وحده من الطمأنة ويؤخر اكتشاف أي تغير في حالته.",
      ),
      choice(
        "d",
        "Begin a detailed lesson about the long-term neurobiology of anxiety.",
        "ابدأ شرحاً مفصلاً عن البيولوجيا العصبية طويلة المدى للقلق.",
        "Complex teaching is difficult to process during acute panic; immediate communication should be brief and concrete.",
        "يصعب استيعاب التعليم المعقد أثناء الهلع الحاد؛ وينبغي أن يكون التواصل الفوري قصيراً وواضحاً.",
      ),
    ],
    correctOptionId: "a",
    referenceIds: ["nice-panic-cg113", "queensland-mental-health-manual-2025"],
    clinicalRisk: "standard",
    riskDomains: ["panic", "therapeutic-communication", "physical-cause-exclusion"],
  }),
  makeQuestion({
    id: "international-mental-command-hallucination-091",
    examId: "international-rn",
    domainId: "mental-health",
    categoryId: "international-psychosocial",
    competencyId: "priority-response",
    topic: bi("Command hallucination safety", "السلامة عند الهلاوس الآمرة"),
    difficultyId: "advanced",
    stem: bi(
      "An inpatient says, ‘The voice is ordering me to stab my roommate,’ and indicates a concealed sharp object. What is the nurse's priority response?",
      "قال مريض منوم: «الصوت يأمرني بطعن زميلي في الغرفة»، وأشار إلى أداة حادة مخفية. ما استجابة الممرض ذات الأولوية؟",
    ),
    choices: [
      choice(
        "a",
        "Argue that the voice is imaginary until the client agrees.",
        "جادل بأن الصوت غير حقيقي حتى يوافق المريض.",
        "Arguing about the perception does not control the immediate risk and may increase distress or confrontation.",
        "لا يسيطر الجدال حول الإدراك على الخطر الفوري وقد يزيد الضيق أو المواجهة.",
      ),
      choice(
        "b",
        "Maintain a safe distance, summon trained assistance, protect and separate potential victims, manage the object according to the emergency safety procedure, and initiate an immediate risk assessment.",
        "حافظ على مسافة آمنة، واطلب مساعدة مدربة، واحمِ وافصل الأشخاص المحتمل تعرضهم للأذى، وتعامل مع الأداة وفق إجراء السلامة الطارئ، وابدأ تقييماً فورياً للخطر.",
        "A stated violent command plus accessible means is an immediate safety threat requiring coordinated protection, removal of opportunity through policy, and urgent clinical assessment.",
        "يمثل الأمر العنيف المعلن مع توفر الوسيلة تهديداً فورياً للسلامة يستلزم حماية منسقة وتقليل فرصة الأذى وفق السياسة وتقييماً سريرياً عاجلاً.",
      ),
      choice(
        "c",
        "Ask the client to keep the object hidden while the nurse finishes medication rounds.",
        "اطلب من المريض إبقاء الأداة مخفية حتى ينهي الممرض جولة الأدوية.",
        "Delaying intervention leaves the client and others exposed to a clearly identified immediate danger.",
        "يُبقي تأخير التدخل المريض والآخرين معرضين لخطر فوري ومحدد بوضوح.",
      ),
      choice(
        "d",
        "Promise not to tell the team if the client agrees to ignore the voice.",
        "عِد بعدم إبلاغ الفريق إذا وافق المريض على تجاهل الصوت.",
        "A verbal promise does not mitigate access to means, and safety information must be shared through the authorised care pathway.",
        "لا يقلل الوعد اللفظي من توفر الوسيلة، ويجب مشاركة معلومات السلامة عبر مسار الرعاية المعتمد.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["nice-violence-aggression-ng10", "queensland-mental-health-manual-2025"],
    clinicalRisk: "high-alert",
    riskDomains: ["violence-risk", "command-hallucination", "environmental-safety"],
  }),

  // Pharmacology — 4 items
  makeQuestion({
    id: "international-pharmacology-potassium-concentrate-092",
    examId: "international-rn",
    domainId: "pharmacology",
    categoryId: "international-pharmacology",
    competencyId: "medication-safety",
    topic: bi("Concentrated potassium safety", "سلامة البوتاسيوم المركز"),
    difficultyId: "advanced",
    stem: bi(
      "A prescription reads, ‘potassium chloride concentrate 20 mEq IV now.’ The vial states that it must be diluted and is for infusion only. What should the nurse do?",
      "تنص الوصفة على: «كلوريد البوتاسيوم المركز 20 ملي مكافئ وريدياً الآن». وتوضح العبوة وجوب تخفيفه وأنه مخصص للتسريب فقط. ماذا يفعل الممرض؟",
    ),
    choices: [
      choice(
        "a",
        "Inject the concentrate slowly through a peripheral cannula.",
        "احقن المستحضر المركز ببطء عبر قنية وريدية طرفية.",
        "Direct injection of concentrated potassium can cause fatal arrhythmia or cardiac arrest.",
        "قد يسبب الحقن المباشر للبوتاسيوم المركز اضطراب نظم قاتلاً أو توقف القلب.",
      ),
      choice(
        "b",
        "Add the concentrate to the nearest IV bag without an independent check.",
        "أضف المستحضر المركز إلى أقرب كيس وريدي دون تحقق مستقل.",
        "Unverified bedside preparation can create concentration, mixing, labelling, and rate errors with a high-alert medicine.",
        "قد يؤدي التحضير غير المتحقق منه عند السرير إلى أخطاء في التركيز والخلط والملصق والسرعة لدواء عالي الخطورة.",
      ),
      choice(
        "c",
        "Hold the dose and clarify the incomplete high-alert order; use an authorised, correctly diluted infusion with the required pump, monitoring, and independent checks under local policy.",
        "أوقف الجرعة واستوضح الوصفة غير المكتملة للدواء عالي الخطورة؛ واستخدم تسريباً مخففاً بصورة صحيحة ومعتمداً مع المضخة والمراقبة والتحققات المستقلة المطلوبة وفق السياسة المحلية.",
        "Concentrated potassium is for diluted IV infusion, not direct injection. The route details, dilution, rate, monitoring, and safeguards must be authorised before administration.",
        "البوتاسيوم المركز مخصص للتسريب الوريدي بعد التخفيف وليس للحقن المباشر. ويجب اعتماد تفاصيل الطريق والتخفيف والسرعة والمراقبة وضمانات السلامة قبل الإعطاء.",
      ),
      choice(
        "d",
        "Give the concentrate orally because the IV instruction is unsafe.",
        "أعطِ المستحضر المركز فموياً لأن التعليمات الوريدية غير آمنة.",
        "Changing the route without an authorised order is unsafe and does not resolve the prescribing ambiguity.",
        "تغيير طريق الإعطاء دون أمر معتمد غير آمن ولا يحل غموض الوصفة.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["dailymed-potassium-chloride-2026", "ismp-high-alert-acute-care-2024"],
    clinicalRisk: "high-alert",
    riskDomains: ["potassium", "high-alert-medication", "infusion-safety"],
  }),
  makeQuestion({
    id: "saudi-nursing-pharmacology-insulin-meal-delay-093",
    examId: "saudi-nursing",
    domainId: "pharmacology",
    categoryId: "saudi-nursing-fundamentals",
    competencyId: "medication-safety",
    topic: bi("Insulin and meal coordination", "تنسيق الإنسولين مع الوجبة"),
    difficultyId: "intermediate",
    stem: bi(
      "Rapid-acting mealtime insulin is due, but the meal has been unexpectedly delayed. The client is alert, clinically stable, and the current glucose is 6.2 mmol/L. What is the best action?",
      "حان موعد الإنسولين سريع المفعول المرتبط بالوجبة، لكن الوجبة تأخرت بصورة غير متوقعة. المريض يقظ ومستقر سريرياً، وسكر الدم الحالي 6.2 مليمول/لتر. ما أفضل إجراء؟",
    ),
    choices: [
      choice(
        "a",
        "Administer the insulin now and assume the meal will arrive soon.",
        "أعطِ الإنسولين الآن وافترض أن الوجبة ستصل قريباً.",
        "Giving rapid-acting insulin without reliable carbohydrate availability can create avoidable hypoglycaemia risk.",
        "قد يؤدي إعطاء الإنسولين سريع المفعول دون توفر موثوق للكربوهيدرات إلى خطر انخفاض سكر يمكن تجنبه.",
      ),
      choice(
        "b",
        "Coordinate meal availability and insulin timing, recheck glucose as required, and clarify promptly through the authorised diabetes/medication pathway if they cannot be safely synchronised.",
        "نسّق توفر الوجبة وتوقيت الإنسولين، وأعد قياس السكر حسب المطلوب، واستوضح سريعاً عبر مسار السكري أو الدواء المعتمد إذا تعذر تنسيقهما بأمان.",
        "Hospital insulin plans should coordinate nutrition, glucose monitoring, and medication timing to reduce treatment-related hypoglycaemia.",
        "ينبغي أن تنسق خطط الإنسولين في المستشفى بين التغذية ومراقبة السكر وتوقيت الدواء لتقليل انخفاض السكر المرتبط بالعلاج.",
      ),
      choice(
        "c",
        "Cancel all insulin for the rest of the admission.",
        "ألغِ جميع جرعات الإنسولين لبقية فترة التنويم.",
        "A temporary meal delay does not authorise discontinuing the entire diabetes regimen and may create hyperglycaemia risk.",
        "لا يسمح تأخر مؤقت للوجبة بإيقاف خطة السكري كاملة وقد يسبب خطر ارتفاع السكر.",
      ),
      choice(
        "d",
        "Give twice the insulin dose with the next meal to replace the delayed dose.",
        "أعطِ ضعف جرعة الإنسولين مع الوجبة التالية لتعويض الجرعة المتأخرة.",
        "Unprescribed dose doubling can cause severe hypoglycaemia and is not a safe correction strategy.",
        "قد تسبب مضاعفة الجرعة دون وصفة انخفاضاً شديداً في السكر وليست طريقة تعويض آمنة.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["ada-hospital-care-2026", "who-medication-safety-2024"],
    clinicalRisk: "high-alert",
    riskDomains: ["insulin", "hypoglycaemia-prevention", "nutrition-coordination"],
  }),
  makeQuestion({
    id: "computerized-pharmacology-post-naloxone-094",
    examId: "computerized-practice",
    domainId: "pharmacology",
    categoryId: "computerized-medication-safety",
    competencyId: "reassessment-monitoring",
    topic: bi("Monitoring after opioid reversal", "المراقبة بعد عكس تأثير الأفيون"),
    difficultyId: "advanced",
    stem: bi(
      "After authorised naloxone for opioid-related respiratory depression, a client wakes and the respiratory rate improves. What is the priority ongoing plan?",
      "بعد إعطاء النالوكسون المعتمد لتثبيط التنفس المرتبط بالأفيون، استيقظ المريض وتحسن معدل تنفسه. ما خطة المتابعة ذات الأولوية؟",
    ),
    choices: [
      choice(
        "a",
        "Discontinue monitoring immediately because the first response confirms recovery.",
        "أوقف المراقبة فوراً لأن الاستجابة الأولى تؤكد التعافي.",
        "Respiratory depression can recur after the antagonist effect wanes, especially when the opioid or duration is uncertain.",
        "قد يعود تثبيط التنفس بعد زوال تأثير المضاد، خاصة عندما يكون نوع الأفيون أو مدة تأثيره غير معلومين.",
      ),
      choice(
        "b",
        "Continue protocol-directed observation with repeated airway, breathing, oxygenation, circulation, and mental-status assessment, while remaining ready for ventilatory support and repeat antagonist treatment if authorised and needed.",
        "واصل المراقبة وفق البروتوكول مع تكرار تقييم مجرى الهواء والتنفس والأكسجة والدورة الدموية والوعي، مع الاستعداد لدعم التهوية وتكرار مضاد الأفيون إذا كان معتمداً ولازماً.",
        "Initial improvement does not eliminate recurrence risk. Continued physiological monitoring permits early recognition and treatment of renewed respiratory depression.",
        "لا يلغي التحسن الأولي خطر عودة التثبيط. تسمح المراقبة الفسيولوجية المستمرة بالتعرف المبكر على عودة تثبيط التنفس وعلاجه.",
      ),
      choice(
        "c",
        "Give a sedative so the client can sleep through the observation period.",
        "أعطِ مهدئاً حتى ينام المريض خلال فترة المراقبة.",
        "Additional sedation can worsen respiratory depression and obscure neurological reassessment.",
        "قد يزيد التهدئة الإضافية تثبيط التنفس وتحجب إعادة التقييم العصبي.",
      ),
      choice(
        "d",
        "Encourage the client to walk alone to demonstrate readiness for discharge.",
        "شجّع المريض على المشي وحده لإثبات جاهزيته للخروج.",
        "Unsupervised activity does not assess recurrence safely and may expose a still-sedated client to falls or collapse.",
        "لا يقيم النشاط غير الخاضع للإشراف عودة التثبيط بأمان وقد يعرض المريض الذي لا تزال لديه تهدئة للسقوط أو الانهيار.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["aha-opioid-emergency-2025"],
    clinicalRisk: "high-alert",
    riskDomains: ["opioid", "respiratory-depression", "reversal-monitoring"],
  }),
  makeQuestion({
    id: "international-pharmacology-discharge-duplication-095",
    examId: "international-rn",
    domainId: "pharmacology",
    categoryId: "international-pharmacology",
    competencyId: "care-coordination",
    topic: bi("Medication reconciliation at discharge", "مطابقة الأدوية عند الخروج"),
    difficultyId: "intermediate",
    stem: bi(
      "While reviewing discharge instructions, the nurse finds two strengths of the same medicine listed with the same schedule, and no note explains whether both are intended. What is the best action?",
      "أثناء مراجعة تعليمات الخروج، وجد الممرض تركيزين للدواء نفسه مدرجين بالجدول ذاته دون ملاحظة توضح ما إذا كان كلاهما مقصوداً. ما أفضل إجراء؟",
    ),
    choices: [
      choice(
        "a",
        "Tell the client to choose the strength used before admission.",
        "اطلب من المريض اختيار التركيز الذي كان يستخدمه قبل التنويم.",
        "The client should be involved, but selecting between conflicting orders without reconciliation can perpetuate an unsafe discrepancy.",
        "ينبغي إشراك المريض، لكن الاختيار بين أوامر متعارضة دون مطابقة قد يبقي اختلافاً غير آمن.",
      ),
      choice(
        "b",
        "Delete the lower strength because the higher strength appears more current.",
        "احذف التركيز الأقل لأن التركيز الأعلى يبدو أحدث.",
        "Appearance or list position does not establish prescriber intent and is not a safe basis for changing the regimen.",
        "لا يثبت المظهر أو ترتيب القائمة نية الواصف ولا يشكل أساساً آمناً لتغيير الخطة.",
      ),
      choice(
        "c",
        "Pause finalisation, compare the best available medication history with inpatient changes, involve the client and authorised pharmacist/prescriber, resolve and document the discrepancy, then provide one clear current list.",
        "أوقف إنهاء التعليمات مؤقتاً، وقارن أفضل تاريخ دوائي متاح بتغييرات التنويم، وأشرك المريض والصيدلي أو الواصف المخول، وحل الاختلاف ووثقه، ثم قدم قائمة حالية واحدة واضحة.",
        "Medication reconciliation distinguishes intended changes from errors and communicates a complete, accurate regimen at the transition of care.",
        "تميز مطابقة الأدوية التغييرات المقصودة عن الأخطاء وتنقل خطة دوائية كاملة ودقيقة عند انتقال الرعاية.",
      ),
      choice(
        "d",
        "Print the list unchanged and ask primary care to resolve it later.",
        "اطبع القائمة كما هي واطلب من الرعاية الأولية حلها لاحقاً.",
        "Sending an unresolved duplicate into the next setting exposes the client to omission, duplication, or overdose.",
        "يعرّض نقل تكرار غير محسوم إلى الجهة التالية المريض للإغفال أو التكرار أو الجرعة الزائدة.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["who-medication-transitions-2019"],
    clinicalRisk: "standard",
    riskDomains: ["medication-reconciliation", "care-transition", "duplicate-therapy"],
  }),

  // Fundamentals — 3 items
  makeQuestion({
    id: "saudi-nursing-fundamentals-pain-self-report-096",
    examId: "saudi-nursing",
    domainId: "fundamentals",
    categoryId: "saudi-nursing-fundamentals",
    competencyId: "fundamental-care",
    topic: bi("Person-centred pain assessment", "تقييم الألم المتمحور حول الشخص"),
    difficultyId: "foundation",
    stem: bi(
      "A clinically stable postoperative client is smiling while speaking with family but reports pain of 8 out of 10. What is the nurse's best response?",
      "مريض مستقر سريرياً بعد الجراحة يبتسم أثناء حديثه مع أسرته لكنه يذكر أن الألم 8 من 10. ما أفضل استجابة من الممرض؟",
    ),
    choices: [
      choice(
        "a",
        "Assume the pain is mild because the client's facial expression appears comfortable.",
        "افترض أن الألم بسيط لأن تعبير وجه المريض يبدو مرتاحاً.",
        "Behaviour alone cannot replace the client's report; people express and cope with pain differently.",
        "لا يمكن للسلوك وحده أن يحل محل تقرير المريض؛ فالناس يعبرون عن الألم ويتعاملون معه بطرق مختلفة.",
      ),
      choice(
        "b",
        "Accept the report, complete a focused assessment of pain and function plus relevant sedation and safety factors, implement the authorised plan, and reassess the response.",
        "تقبّل تقرير المريض، وأكمل تقييماً مركزاً للألم وتأثيره الوظيفي مع عوامل التهدئة والسلامة ذات الصلة، ونفّذ الخطة المعتمدة، ثم أعد تقييم الاستجابة.",
        "Pain care should be individualised through assessment, shared planning, safe treatment, and reassessment rather than judged from appearance alone.",
        "ينبغي تخصيص رعاية الألم عبر التقييم والتخطيط المشترك والعلاج الآمن وإعادة التقييم بدلاً من الحكم من المظهر وحده.",
      ),
      choice(
        "c",
        "Administer the maximum available dose without checking the prescription, prior doses, sedation, or contraindications.",
        "أعطِ أعلى جرعة متاحة دون التحقق من الوصفة أو الجرعات السابقة أو التهدئة أو موانع الاستعمال.",
        "A high pain score warrants timely care, but bypassing medication and safety checks can cause harm.",
        "تستدعي درجة الألم المرتفعة رعاية في الوقت المناسب، لكن تجاوز تحققات الدواء والسلامة قد يسبب الضرر.",
      ),
      choice(
        "d",
        "Document the score and wait until the next shift to assess further.",
        "وثّق الدرجة وانتظر حتى المناوبة التالية لإكمال التقييم.",
        "Documentation without timely assessment, intervention, and reassessment leaves the client's current need untreated.",
        "يترك التوثيق دون تقييم وتدخل وإعادة تقييم في الوقت المناسب حاجة المريض الحالية دون علاج.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["nice-perioperative-care-ng180"],
    clinicalRisk: "standard",
    riskDomains: ["pain", "person-centred-assessment", "reassessment"],
  }),
  makeQuestion({
    id: "international-fundamentals-catheter-flow-097",
    examId: "international-rn",
    domainId: "fundamentals",
    categoryId: "international-basic-care",
    competencyId: "infection-safety",
    topic: bi("Urinary drainage maintenance", "المحافظة على تصريف القسطرة البولية"),
    difficultyId: "foundation",
    stem: bi(
      "During routine care, the nurse finds an indwelling urinary catheter bag resting on the floor above the level of the client's bladder, and the tubing is kinked. What should the nurse do?",
      "أثناء الرعاية الروتينية، وجد الممرض كيس القسطرة البولية الدائمة على الأرض وأعلى من مستوى مثانة المريض، والأنبوب ملتوي. ماذا يفعل؟",
    ),
    choices: [
      choice(
        "a",
        "Place the bag securely below bladder level and off the floor, remove the kink without contaminating or disconnecting the closed system, and verify urine flow.",
        "ثبّت الكيس أسفل مستوى المثانة وبعيداً عن الأرض، وأزل الالتواء دون تلويث النظام المغلق أو فصله، وتحقق من تدفق البول.",
        "Keeping the bag below the bladder, off the floor, and the tubing unobstructed supports a closed system and continuous drainage.",
        "يساعد إبقاء الكيس أسفل المثانة وبعيداً عن الأرض والأنبوب دون انسداد على الحفاظ على النظام المغلق واستمرار التصريف.",
      ),
      choice(
        "b",
        "Disconnect the tubing briefly so the urine drains faster.",
        "افصل الأنبوب لفترة قصيرة حتى يتدفق البول بسرعة أكبر.",
        "Unnecessary disconnection compromises the closed drainage system and increases contamination risk.",
        "يخل الفصل غير الضروري بنظام التصريف المغلق ويزيد خطر التلوث.",
      ),
      choice(
        "c",
        "Raise the bag higher and squeeze the tubing toward the client.",
        "ارفع الكيس أكثر واضغط الأنبوب باتجاه المريض.",
        "Raising the bag and directing fluid toward the bladder can promote backflow rather than safe drainage.",
        "قد يؤدي رفع الكيس ودفع السائل باتجاه المثانة إلى الارتجاع بدلاً من التصريف الآمن.",
      ),
      choice(
        "d",
        "Leave the system unchanged if the client has no suprapubic pain.",
        "اترك النظام كما هو إذا لم يكن لدى المريض ألم فوق العانة.",
        "Incorrect bag position and obstructed flow require correction even before symptoms develop.",
        "يتطلب وضع الكيس غير الصحيح وانسداد التدفق التصحيح حتى قبل ظهور الأعراض.",
      ),
    ],
    correctOptionId: "a",
    referenceIds: ["cdc-cauti-prevention"],
    clinicalRisk: "standard",
    riskDomains: ["urinary-catheter", "closed-drainage", "infection-prevention"],
  }),
  makeQuestion({
    id: "international-fundamentals-damp-sterile-pack-098",
    examId: "international-rn",
    domainId: "fundamentals",
    categoryId: "international-safety-infection",
    competencyId: "aseptic-practice",
    topic: bi("Compromised sterile packaging", "تضرر العبوة المعقمة"),
    difficultyId: "foundation",
    stem: bi(
      "Before a sterile dressing change, the nurse notices that one sealed package has a damp corner after contact with a wet work surface. What is the best action?",
      "قبل تغيير ضماد معقم، لاحظ الممرض أن زاوية إحدى العبوات المحكمة رطبة بعد ملامستها سطح عمل مبللاً. ما أفضل إجراء؟",
    ),
    choices: [
      choice(
        "a",
        "Dry the corner with a paper towel and use the contents.",
        "جفف الزاوية بمنشفة ورقية واستخدم المحتويات.",
        "Drying the outside does not restore package integrity or verified sterility after moisture exposure.",
        "لا يعيد تجفيف الخارج سلامة العبوة أو التعقيم الموثوق بعد التعرض للرطوبة.",
      ),
      choice(
        "b",
        "Open the package from the opposite side because that edge remains dry.",
        "افتح العبوة من الجهة المقابلة لأن تلك الحافة ما زالت جافة.",
        "A compromised area makes the sterility of the package contents uncertain regardless of the opening side.",
        "يجعل تضرر جزء من العبوة تعقيم محتوياتها غير مؤكد بغض النظر عن جهة الفتح.",
      ),
      choice(
        "c",
        "Remove the compromised package from use and obtain an intact, dry package according to the facility process.",
        "استبعد العبوة المتضررة من الاستخدام واحصل على عبوة سليمة وجافة وفق إجراء المنشأة.",
        "Moisture can compromise sterile packaging; an intact, dry package is needed for an aseptic procedure.",
        "قد تخل الرطوبة بالعبوة المعقمة؛ وتستلزم الممارسة اللاتلوثية عبوة سليمة وجافة.",
      ),
      choice(
        "d",
        "Use only the top item in the package because it is furthest from the damp corner.",
        "استخدم القطعة العلوية فقط لأنها الأبعد عن الزاوية الرطبة.",
        "Distance inside a compromised package does not establish that any content remains sterile.",
        "لا يثبت البعد داخل العبوة المتضررة بقاء أي جزء من المحتوى معقماً.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["cdc-sterilization-summary"],
    clinicalRisk: "standard",
    riskDomains: ["sterile-field", "packaging-integrity", "infection-prevention"],
  }),

  // Management / Safety — 4 items
  makeQuestion({
    id: "saudi-nursing-management-delegate-stable-care-099",
    examId: "saudi-nursing",
    domainId: "management-safety",
    categoryId: "saudi-nursing-management",
    competencyId: "delegation-supervision",
    topic: bi("Delegating predictable care", "تفويض الرعاية المتوقعة"),
    difficultyId: "intermediate",
    stem: bi(
      "A registered nurse is working with a trained support worker whose verified role includes routine personal care. Which task is most appropriate to delegate?",
      "يعمل ممرض مسجل مع مساعد مدرب يشمل دوره المتحقق منه الرعاية الشخصية الروتينية. أي مهمة أنسب للتفويض؟",
    ),
    choices: [
      choice(
        "a",
        "Perform the initial assessment of a client with new chest pressure.",
        "إجراء التقييم الأولي لمريض لديه ضغط صدري جديد.",
        "A new potentially acute symptom requires registered-nurse assessment, prioritisation, and escalation.",
        "يتطلب العرض الحاد المحتمل والجديد تقييماً وترتيب أولويات وتصعيداً من الممرض المسجل.",
      ),
      choice(
        "b",
        "Assist a stable client with morning hygiene after clear instructions, and report any observed change to the nurse.",
        "مساعدة مريض مستقر في نظافة الصباح بعد تعليمات واضحة، وإبلاغ الممرض عن أي تغير ملحوظ.",
        "Predictable routine care may be delegated to a competent worker within verified scope, while the registered nurse retains direction, supervision, and evaluation.",
        "يمكن تفويض الرعاية الروتينية المتوقعة إلى مساعد كفء ضمن النطاق المتحقق منه، مع بقاء التوجيه والإشراف والتقييم مسؤولية الممرض المسجل.",
      ),
      choice(
        "c",
        "Interpret a newly abnormal set of vital signs and decide whether escalation is needed.",
        "تفسير مجموعة علامات حيوية غير طبيعية حديثاً وتحديد الحاجة إلى التصعيد.",
        "Clinical interpretation and the decision to escalate require nursing judgement and cannot be transferred as a routine task.",
        "يتطلب التفسير السريري وقرار التصعيد حكماً تمريضياً ولا يمكن نقلهما كمهمة روتينية.",
      ),
      choice(
        "d",
        "Provide and evaluate the client's first teaching session about a newly diagnosed condition.",
        "تقديم وتقييم أول جلسة تعليم للمريض عن حالة شُخصت حديثاً.",
        "Initial education and evaluation require assessment, adaptation, and professional nursing judgement.",
        "يتطلب التعليم الأولي وتقييمه التقدير والتكييف والحكم التمريضي المهني.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["scfhs-scope-2023"],
    clinicalRisk: "standard",
    riskDomains: ["delegation", "scope-of-practice", "supervision"],
  }),
  makeQuestion({
    id: "international-management-timeout-discrepancy-100",
    examId: "international-rn",
    domainId: "management-safety",
    categoryId: "international-management",
    competencyId: "systems-safety",
    topic: bi("Surgical safety pause", "توقف السلامة الجراحي"),
    difficultyId: "advanced",
    stem: bi(
      "During the team safety pause, the schedule and surgeon indicate the right knee, but the signed consent and site mark indicate the left knee. What should the circulating nurse do?",
      "أثناء توقف السلامة الجماعي، يشير الجدول والجراح إلى الركبة اليمنى، بينما تشير الموافقة الموقعة وعلامة الموضع إلى الركبة اليسرى. ماذا يفعل ممرض الدوران؟",
    ),
    choices: [
      choice(
        "a",
        "Allow anaesthesia and incision to proceed while a colleague checks later.",
        "اسمح باستمرار التخدير والشق الجراحي بينما يتحقق زميل لاحقاً.",
        "Proceeding before reconciliation defeats the purpose of the safety pause and exposes the client to wrong-site surgery.",
        "يُفقد الاستمرار قبل حل الاختلاف توقف السلامة غايته ويعرض المريض لجراحة في موضع خاطئ.",
      ),
      choice(
        "b",
        "Change the consent to match the schedule because two sources indicate the right side.",
        "غيّر الموافقة لتطابق الجدول لأن مصدرين يشيران إلى الجهة اليمنى.",
        "A consent document must not be informally altered, and a majority of conflicting sources does not verify the intended procedure.",
        "لا يجوز تعديل وثيقة الموافقة بصورة غير رسمية، ولا يثبت تعدد المصادر المتعارضة الإجراء المقصود.",
      ),
      choice(
        "c",
        "Stop the procedure before incision and require the team to reconcile the client, procedure, consent, records, and marked site through the authorised process before proceeding.",
        "أوقف الإجراء قبل الشق، واطلب من الفريق مطابقة المريض والإجراء والموافقة والسجلات وعلامة الموضع عبر المسار المعتمد قبل المتابعة.",
        "A team pause is a deliberate barrier against wrong-person, wrong-procedure, and wrong-site events; any discrepancy must be resolved before progression.",
        "يمثل التوقف الجماعي حاجزاً مقصوداً ضد أخطاء الشخص والإجراء والموضع؛ ويجب حل أي اختلاف قبل التقدم.",
      ),
      choice(
        "d",
        "Ask the most senior person to choose a side without reviewing the source documents.",
        "اطلب من أقدم شخص اختيار الجهة دون مراجعة الوثائق المصدرية.",
        "Hierarchy cannot replace verification from the client and authorised records.",
        "لا يمكن للتسلسل الوظيفي أن يحل محل التحقق من المريض والسجلات المعتمدة.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["who-surgical-safety-checklist"],
    clinicalRisk: "high-alert",
    riskDomains: ["wrong-site-prevention", "surgical-safety", "speaking-up"],
  }),
  makeQuestion({
    id: "international-management-pending-result-handoff-101",
    examId: "international-rn",
    domainId: "management-safety",
    categoryId: "international-management",
    competencyId: "communication-handoff",
    topic: bi("Ownership of pending results", "مسؤولية متابعة النتائج المعلقة"),
    difficultyId: "advanced",
    stem: bi(
      "A client is transferring units after treatment for severe hyperkalaemia. A repeat potassium result is still pending. Which handoff is safest?",
      "سينتقل مريض إلى وحدة أخرى بعد علاج فرط بوتاسيوم شديد، ولا تزال نتيجة إعادة قياس البوتاسيوم معلقة. أي تسليم للرعاية هو الأكثر أماناً؟",
    ),
    choices: [
      choice(
        "a",
        "Rely on the electronic record because the receiving nurse can find the result later.",
        "اعتمد على السجل الإلكتروني لأن الممرض المستلم يستطيع العثور على النتيجة لاحقاً.",
        "Passive record availability does not ensure that the time-critical pending result is noticed, interpreted, and acted on.",
        "لا يضمن توفر السجل بصورة سلبية ملاحظة النتيجة المعلقة الحساسة للوقت وتفسيرها والتصرف بشأنها.",
      ),
      choice(
        "b",
        "Give a direct structured handoff describing the current condition, treatment and response, monitoring needs, pending result, escalation threshold, and named responsibility for follow-up, then confirm understanding with read-back.",
        "قدّم تسليماً مباشراً ومنظماً يوضح الحالة الحالية والعلاج والاستجابة واحتياجات المراقبة والنتيجة المعلقة وعتبة التصعيد والمسؤول المحدد عن متابعتها، ثم أكد الفهم بإعادة ما تم سماعه.",
        "Structured transfer with explicit ownership and closed-loop confirmation reduces loss of critical information at the care boundary.",
        "يقلل النقل المنظم مع تحديد المسؤولية والتأكيد بحلقة اتصال مغلقة فقدان المعلومات الحرجة عند انتقال الرعاية.",
      ),
      choice(
        "c",
        "Omit the earlier hyperkalaemia because it has already been treated.",
        "احذف فرط البوتاسيوم السابق لأنه عولج بالفعل.",
        "The diagnosis, treatment response, and repeat result remain important to detecting persistent or recurrent risk.",
        "يظل التشخيص والاستجابة للعلاج والنتيجة المعادة مهمة لاكتشاف استمرار الخطر أو عودته.",
      ),
      choice(
        "d",
        "Ask the laboratory to contact the client directly after transfer.",
        "اطلب من المختبر الاتصال بالمريض مباشرة بعد النقل.",
        "This does not establish accountable clinical review or a response plan for a potentially critical result.",
        "لا يحدد ذلك مراجعة سريرية مسؤولة أو خطة استجابة لنتيجة قد تكون حرجة.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["ahrq-sbar", "psmf-handoff-communication-2023"],
    clinicalRisk: "high-alert",
    riskDomains: ["handoff", "hyperkalaemia", "pending-results"],
  }),
  makeQuestion({
    id: "saudi-nursing-management-downtime-identification-102",
    examId: "saudi-nursing",
    domainId: "management-safety",
    categoryId: "saudi-nursing-management",
    competencyId: "systems-safety",
    topic: bi("Patient identification during downtime", "التحقق من هوية المريض أثناء تعطل النظام"),
    difficultyId: "intermediate",
    stem: bi(
      "The bedside barcode scanner is unavailable, and two clients in adjacent rooms have similar names. A scheduled medicine is due. What is the safest action?",
      "تعطل ماسح الباركود عند السرير، ويوجد مريضان في غرفتين متجاورتين بأسماء متشابهة. حان موعد دواء مجدول. ما الإجراء الأكثر أماناً؟",
    ),
    choices: [
      choice(
        "a",
        "Use the room number and the medicine cup label as the two identifiers.",
        "استخدم رقم الغرفة وملصق كوب الدواء كمعرّفين.",
        "Room or bed location is not a person-specific identifier and can change.",
        "رقم الغرفة أو السرير ليس معرّفاً خاصاً بالشخص وقد يتغير.",
      ),
      choice(
        "b",
        "Ask the neighbouring client to confirm who normally receives the medicine.",
        "اطلب من المريض المجاور تأكيد من يتلقى الدواء عادةً.",
        "Another client is not an authorised or reliable source for identity verification.",
        "لا يُعد مريض آخر مصدراً مخولاً أو موثوقاً للتحقق من الهوية.",
      ),
      choice(
        "c",
        "Follow the approved downtime process, actively match at least two person-specific identifiers from the client and identification band with the medication record, and resolve any discrepancy before administration.",
        "اتبع إجراء التعطل المعتمد، وطابق بصورة نشطة معرّفين خاصين بالشخص على الأقل من المريض وسوار الهوية مع سجل الدواء، وحل أي اختلاف قبل الإعطاء.",
        "Technology downtime does not remove the requirement for reliable patient identification; the approved fallback process preserves that safety barrier.",
        "لا يلغي تعطل التقنية متطلب التحقق الموثوق من هوية المريض؛ ويحافظ الإجراء البديل المعتمد على حاجز السلامة هذا.",
      ),
      choice(
        "d",
        "Skip identification because the nurse prepared the medicine personally.",
        "تجاوز التحقق من الهوية لأن الممرض حضّر الدواء بنفسه.",
        "Preparation by the administering nurse does not prevent wrong-patient selection at the bedside.",
        "لا يمنع تحضير الممرض للدواء بنفسه اختيار المريض الخطأ عند السرير.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["joint-commission-patient-identification-2026", "who-medication-safety-2024"],
    clinicalRisk: "standard",
    riskDomains: ["patient-identification", "downtime", "medication-safety"],
  }),
];
