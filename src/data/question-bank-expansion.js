/*
 * Nursing Hypotheses — clean-room question-bank expansion.
 *
 * These questions were independently authored from broad nursing topics and
 * publicly available official guidance. No recalled, secure, commercial, or
 * third-party question wording was used. Every item remains a draft pending
 * qualified clinical, legal, and Arabic-language review.
 */

const bi = (en, ar) => ({ en, ar });

const DRAFT_DATE = "2026-09-05";
const INTAKE_POLICY_VERSION = "2026-09-05";

const domainLabels = {
  "adult-medical-surgical": bi("Adult / Medical-Surgical", "تمريض البالغين / الباطني والجراحي"),
  "emergency-critical-care": bi("Emergency / Critical Care", "الطوارئ / العناية الحرجة"),
  pediatrics: bi("Pediatrics", "تمريض الأطفال"),
  "maternal-newborn": bi("Maternal-Newborn", "تمريض الأمومة وحديثي الولادة"),
  "mental-health": bi("Mental Health", "الصحة النفسية"),
  pharmacology: bi("Pharmacology", "علم الأدوية"),
  fundamentals: bi("Fundamentals", "أساسيات التمريض"),
  "management-safety": bi("Management / Safety", "الإدارة / السلامة"),
};

const categoryLabels = {
  "saudi-nursing-fundamentals": bi("Foundations of safe nursing practice", "أسس الممارسة التمريضية الآمنة"),
  "saudi-nursing-adult": bi("Adult and older-person care", "رعاية البالغين وكبار السن"),
  "saudi-nursing-maternal-child": bi("Pregnancy, newborn and child care", "رعاية الحمل وحديثي الولادة والأطفال"),
  "saudi-nursing-management": bi("Team coordination and nursing leadership", "تنسيق الفريق والقيادة التمريضية"),
  "international-psychosocial": bi("Emotional, behavioural and social care", "الرعاية النفسية والسلوكية والاجتماعية"),
  "international-pharmacology": bi("Medication and infusion safety", "سلامة الأدوية والتسريب"),
  "computerized-acute-priorities": bi("Acute priorities and emergency response", "الأولويات الحادة والاستجابة للطوارئ"),
};

const difficultyLabels = {
  foundation: bi("Foundation", "تأسيسي"),
  intermediate: bi("Intermediate", "متوسط"),
  advanced: bi("Advanced", "متقدم"),
};

const competencyLabels = {
  "assessment-recognition": bi("Assessment and recognition", "التقييم والتعرّف على الحالة"),
  "priority-response": bi("Priority response", "الاستجابة ذات الأولوية"),
  "reassessment-monitoring": bi("Reassessment and monitoring", "إعادة التقييم والمراقبة"),
  "person-centred-care": bi("Person-centred care", "الرعاية المتمحورة حول الشخص"),
  "medication-safety": bi("Medication safety", "سلامة الأدوية"),
  "infection-safety": bi("Infection prevention and occupational safety", "الوقاية من العدوى والسلامة المهنية"),
  "delegation-supervision": bi("Delegation and supervision", "التفويض والإشراف"),
  "communication-handoff": bi("Structured communication and handoff", "التواصل المنظم وتسليم الرعاية"),
  "systems-safety": bi("Systems safety", "سلامة الأنظمة"),
};

const source = (id, titleEn, titleAr, organizationEn, organizationAr, year, url, statusNoteEn, statusNoteAr) => ({
  id,
  title: bi(titleEn, titleAr),
  organization: bi(organizationEn, organizationAr),
  year,
  url,
  statusCheckedAt: DRAFT_DATE,
  accessNote: bi(statusNoteEn, statusNoteAr),
  licensingNote: bi(
    "Publisher terms apply. This expansion links to the source and uses independently written educational wording.",
    "تسري شروط الناشر. تحيل هذه الدفعة إلى المصدر وتستخدم صياغة تعليمية مؤلفة بصورة مستقلة.",
  ),
});

const expansionSourceCandidates = [
  source(
    "nice-acute-kidney-injury-ng148",
    "NG148 Acute Kidney Injury: Prevention, Detection and Management",
    "إرشاد NG148 للوقاية من إصابة الكلى الحادة واكتشافها وتدبيرها",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2019,
    "https://www.nice.org.uk/guidance/ng148/chapter/Recommendations",
    "Official recommendations; current status and access checked 2026-09-05.",
    "توصيات رسمية؛ تم التحقق من الحالة الحالية وإمكانية الوصول في 2026-09-05.",
  ),
  source(
    "nice-delirium-cg103",
    "CG103 Delirium: Prevention, Diagnosis and Management",
    "إرشاد CG103 للوقاية من الهذيان وتشخيصه وتدبيره",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2023,
    "https://www.nice.org.uk/guidance/cg103/chapter/Recommendations",
    "Official recommendations updated in 2023; access checked 2026-09-05.",
    "توصيات رسمية محدثة في 2023؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "aha-asa-stroke-2026",
    "2026 Guideline for the Early Management of Acute Ischemic Stroke",
    "إرشاد 2026 للتدبير المبكر للسكتة الدماغية الإقفارية الحادة",
    "American Heart Association / American Stroke Association",
    "جمعية القلب الأمريكية / الجمعية الأمريكية للسكتة الدماغية",
    2026,
    "https://professional.heart.org/en/guidelines-statements/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-strokestr0000000000000513",
    "Official guideline landing page; access checked 2026-09-05.",
    "صفحة الإرشاد الرسمية؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "ada-hospital-care-2026",
    "Diabetes Care in the Hospital: Standards of Care in Diabetes—2026",
    "رعاية السكري في المستشفى: معايير الرعاية في السكري 2026",
    "American Diabetes Association",
    "الجمعية الأمريكية للسكري",
    2026,
    "https://diabetesjournals.org/care/article/49/Supplement_1/S339/163925/16-Diabetes-Care-in-the-Hospital-Standards-of-Care",
    "Current professional standard; access checked 2026-09-05.",
    "معيار مهني حالي؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "aha-2025",
    "2025 American Heart Association Guidelines for CPR and Emergency Cardiovascular Care",
    "إرشادات جمعية القلب الأمريكية لعام 2025 للإنعاش القلبي الرئوي والعناية القلبية الوعائية الطارئة",
    "American Heart Association",
    "جمعية القلب الأمريكية",
    2025,
    "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines",
    "Official public guideline hub; access checked 2026-09-05.",
    "بوابة الإرشادات الرسمية؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "ssc-2026",
    "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026",
    "حملة النجاة من الإنتان: الإرشادات الدولية لتدبير الإنتان والصدمة الإنتانية 2026",
    "Society of Critical Care Medicine / European Society of Intensive Care Medicine",
    "جمعية طب العناية الحرجة / الجمعية الأوروبية لطب العناية المركزة",
    2026,
    "https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
    "Official recommendations hub; access checked 2026-09-05.",
    "بوابة التوصيات الرسمية؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nice-ng253-2025",
    "NG253 Suspected Sepsis in People Aged 16 or Over",
    "إرشاد NG253 للاشتباه في الإنتان لدى من أعمارهم 16 عاماً فأكثر",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2025,
    "https://www.nice.org.uk/guidance/NG253",
    "Official guideline published in 2025; access checked 2026-09-05.",
    "إرشاد رسمي منشور في 2025؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nice-epilepsies-ng217-2025",
    "NG217 Epilepsies: Treating Status, Repeated or Prolonged Seizures",
    "إرشاد NG217 للصرع: علاج الحالة الصرعية والنوبات المتكررة أو المطولة",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2025,
    "https://www.nice.org.uk/guidance/ng217/chapter/7-Treating-status-epilepticus-repeated-or-cluster-seizures-and-prolonged-seizures",
    "Official recommendations updated in 2025; access checked 2026-09-05.",
    "توصيات رسمية محدثة في 2025؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "rcuk-abcde-2024",
    "The ABCDE Approach",
    "منهج ABCDE للتقييم والاستجابة",
    "Resuscitation Council UK",
    "مجلس الإنعاش البريطاني",
    2024,
    "https://www.resus.org.uk/library/abcde-approach",
    "Official guidance updated July 2024; access checked 2026-09-05.",
    "إرشاد رسمي محدث في يوليو 2024؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nice-fever-under5-ng143",
    "NG143 Fever in Under 5s: Assessment and Initial Management",
    "إرشاد NG143 لتقييم الحمى لدى الأطفال دون الخامسة وتدبيرها الأولي",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2021,
    "https://www.nice.org.uk/guidance/NG143/chapter/recommendations",
    "Official recommendations; current status and access checked 2026-09-05.",
    "توصيات رسمية؛ تم التحقق من الحالة الحالية وإمكانية الوصول في 2026-09-05.",
  ),
  source(
    "nice-gastroenteritis-cg84",
    "CG84 Diarrhoea and Vomiting Caused by Gastroenteritis in Under 5s",
    "إرشاد CG84 للإسهال والقيء الناتجين عن التهاب المعدة والأمعاء لدى الأطفال دون الخامسة",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2009,
    "https://www.nice.org.uk/guidance/cg84/chapter/Recommendations",
    "Official current guideline page; access checked 2026-09-05. Human reviewers must reconfirm currency before release.",
    "صفحة إرشاد رسمية حالية؛ تم التحقق من الوصول في 2026-09-05. يجب على المراجع البشري إعادة تأكيد الحداثة قبل النشر.",
  ),
  source(
    "nice-bronchiolitis-ng9",
    "NG9 Bronchiolitis in Children: Diagnosis and Management",
    "إرشاد NG9 لتشخيص التهاب القصيبات لدى الأطفال وتدبيره",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2021,
    "https://www.nice.org.uk/guidance/ng9/chapter/Recommendations",
    "Official recommendations updated in 2021; current status checked 2026-09-05.",
    "توصيات رسمية محدثة في 2021؛ تم التحقق من الحالة الحالية في 2026-09-05.",
  ),
  source(
    "rch-croup-2024",
    "Clinical Practice Guideline: Croup",
    "إرشاد الممارسة السريرية للخُنّاق",
    "The Royal Children's Hospital Melbourne",
    "مستشفى الأطفال الملكي في ملبورن",
    2024,
    "https://www.rch.org.au/clinicalguide/guideline_index/croup_laryngotracheobronchitis/",
    "Official clinical guideline updated September 2024; access checked 2026-09-05.",
    "إرشاد سريري رسمي محدث في سبتمبر 2024؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nice-preterm-labour-ng25",
    "NG25 Preterm Labour and Birth",
    "إرشاد NG25 للمخاض والولادة المبكرين",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2022,
    "https://www.nice.org.uk/guidance/ng25/chapter/Recommendations",
    "Official recommendations with updates through 2022; access checked 2026-09-05.",
    "توصيات رسمية بتحديثات حتى 2022؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nice-antenatal-care-ng201",
    "NG201 Antenatal Care",
    "إرشاد NG201 لرعاية ما قبل الولادة",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2021,
    "https://www.nice.org.uk/guidance/ng201/chapter/recommendations",
    "Official recommendations; current status and access checked 2026-09-05.",
    "توصيات رسمية؛ تم التحقق من الحالة الحالية وإمكانية الوصول في 2026-09-05.",
  ),
  source(
    "nice-hypertension-pregnancy-ng133",
    "NG133 Hypertension in Pregnancy: Diagnosis and Management",
    "إرشاد NG133 لارتفاع ضغط الدم في الحمل: التشخيص والتدبير",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2019,
    "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations",
    "Official recommendations; current status and access checked 2026-09-05.",
    "توصيات رسمية؛ تم التحقق من الحالة الحالية وإمكانية الوصول في 2026-09-05.",
  ),
  source(
    "cdc-safe-sleep-2024",
    "Helping Babies Sleep Safely",
    "مساعدة الرضع على النوم بأمان",
    "US Centers for Disease Control and Prevention",
    "المراكز الأمريكية لمكافحة الأمراض والوقاية منها",
    2024,
    "https://www.cdc.gov/sudden-infant-death/sleep-safely/index.html",
    "Official public guidance dated September 17, 2024; access checked 2026-09-05.",
    "إرشادات رسمية مؤرخة في 17 سبتمبر 2024؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nice-self-harm-ng225",
    "NG225 Self-Harm: Assessment, Management and Preventing Recurrence",
    "إرشاد NG225 لإيذاء النفس: التقييم والتدبير ومنع التكرار",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2022,
    "https://www.nice.org.uk/guidance/ng225/chapter/Recommendations",
    "Official recommendations published in 2022; access checked 2026-09-05.",
    "توصيات رسمية منشورة في 2022؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nice-psychosis-cg178",
    "CG178 Psychosis and Schizophrenia in Adults",
    "إرشاد CG178 للذهان والفصام لدى البالغين",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2014,
    "https://www.nice.org.uk/guidance/CG178/chapter/recommendations",
    "Official current guideline page; access checked 2026-09-05. Human reviewers must reconfirm currency before release.",
    "صفحة إرشاد رسمية حالية؛ تم التحقق من الوصول في 2026-09-05. يجب على المراجع البشري إعادة تأكيد الحداثة قبل النشر.",
  ),
  source(
    "nice-violence-aggression-ng10",
    "NG10 Violence and Aggression: Short-Term Management",
    "إرشاد NG10 للتدبير قصير المدى للعنف والعدوانية",
    "National Institute for Health and Care Excellence",
    "المعهد الوطني للصحة وجودة الرعاية",
    2015,
    "https://www.nice.org.uk/guidance/ng10/chapter/Recommendations",
    "Official current guideline page; access checked 2026-09-05. Human reviewers must reconfirm currency before release.",
    "صفحة إرشاد رسمية حالية؛ تم التحقق من الوصول في 2026-09-05. يجب على المراجع البشري إعادة تأكيد الحداثة قبل النشر.",
  ),
  source(
    "dailymed-digoxin-2024",
    "Digoxin Tablets: US Prescribing Information",
    "معلومات الوصف الدوائي الأمريكية لأقراص الديجوكسين",
    "US National Library of Medicine DailyMed",
    "قاعدة DailyMed التابعة للمكتبة الوطنية الأمريكية للطب",
    2024,
    "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=4b893a4a-31e6-4a7a-b16c-02b1e578335b&type=display",
    "Official drug-label display; access checked 2026-09-05.",
    "عرض رسمي لنشرة الدواء؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "nhs-lithium-interactions-2023",
    "Taking Lithium with Other Medicines and Herbal Supplements",
    "تناول الليثيوم مع الأدوية والمستحضرات العشبية الأخرى",
    "National Health Service",
    "هيئة الخدمات الصحية الوطنية البريطانية",
    2023,
    "https://www.nhs.uk/medicines/lithium/taking-lithium-with-other-medicines-and-herbal-supplements/",
    "Official patient medicines guidance reviewed August 2023; access checked 2026-09-05.",
    "إرشادات دوائية رسمية للمرضى روجعت في أغسطس 2023؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "dailymed-apixaban-2025",
    "Eliquis (Apixaban): US Prescribing Information",
    "معلومات الوصف الدوائي الأمريكية لإليكويس (أبيكسابان)",
    "US National Library of Medicine DailyMed",
    "قاعدة DailyMed التابعة للمكتبة الوطنية الأمريكية للطب",
    2025,
    "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e9481622-7cc6-418a-acb6-c5450daae9b0",
    "Official current drug-label page; access checked 2026-09-05.",
    "صفحة رسمية حالية لنشرة الدواء؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "cdc-core-practices-2024",
    "Core Infection Prevention and Control Practices for Safe Healthcare Delivery in All Settings",
    "ممارسات الوقاية من العدوى ومكافحتها الأساسية لتقديم رعاية صحية آمنة في جميع البيئات",
    "US Centers for Disease Control and Prevention",
    "المراكز الأمريكية لمكافحة الأمراض والوقاية منها",
    2024,
    "https://www.cdc.gov/infection-control/hcp/core-practices/index.html",
    "Official public guidance dated April 12, 2024; access checked 2026-09-05.",
    "إرشادات رسمية مؤرخة في 12 أبريل 2024؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "cdc-niosh-blood-exposure-2024",
    "Bloodborne Infectious Diseases: Risk Factors and Prevention Strategies",
    "الأمراض المعدية المنقولة بالدم: عوامل الخطر واستراتيجيات الوقاية",
    "US CDC National Institute for Occupational Safety and Health",
    "المعهد الوطني الأمريكي للسلامة والصحة المهنية التابع لمراكز مكافحة الأمراض",
    2024,
    "https://www.cdc.gov/niosh/healthcare/risk-factors/bloodborne-infectious-diseases.html",
    "Official occupational-health guidance; access checked 2026-09-05.",
    "إرشادات رسمية للصحة المهنية؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "ahrq-fall-tips-2021",
    "Fall TIPS: A Patient-Centered Fall Prevention Toolkit",
    "Fall TIPS: حزمة أدوات للوقاية من السقوط متمحورة حول المريض",
    "Agency for Healthcare Research and Quality",
    "وكالة أبحاث وجودة الرعاية الصحية",
    2021,
    "https://www.ahrq.gov/patient-safety/settings/hospital/fall-tips/index.html",
    "Official toolkit page; current access checked 2026-09-05. Human reviewers must reconfirm currency before release.",
    "صفحة رسمية لحزمة الأدوات؛ تم التحقق من الوصول في 2026-09-05. يجب على المراجع البشري إعادة تأكيد الحداثة قبل النشر.",
  ),
  source(
    "ncsbn-delegation-guidelines",
    "Delegation: National Guidelines for Nursing Delegation",
    "التفويض: الإرشادات الوطنية للتفويض التمريضي",
    "National Council of State Boards of Nursing",
    "المجلس الوطني لمجالس التمريض بالولايات المتحدة",
    2016,
    "https://www.ncsbn.org/nursing-regulation/practice/delegation.page",
    "Official professional guidance hub; current access checked 2026-09-05. Local law and policy control scope.",
    "بوابة إرشادات مهنية رسمية؛ تم التحقق من الوصول في 2026-09-05. يظل نظام الاختصاص وسياسة المنشأة حاكمين للنطاق.",
  ),
  source(
    "who-safe-surgery-tools",
    "Safe Surgery: Tool and Resources",
    "الجراحة الآمنة: الأدوات والموارد",
    "World Health Organization",
    "منظمة الصحة العالمية",
    2009,
    "https://www.who.int/teams/integrated-health-services/patient-safety/research/safe-surgery/tool-and-resources",
    "Official WHO resource hub; current access checked 2026-09-05.",
    "بوابة موارد رسمية لمنظمة الصحة العالمية؛ تم التحقق من الوصول في 2026-09-05.",
  ),
  source(
    "ahrq-sbar",
    "TeamSTEPPS Tool: SBAR",
    "أداة TeamSTEPPS: التواصل المنظم SBAR",
    "Agency for Healthcare Research and Quality",
    "وكالة أبحاث وجودة الرعاية الصحية",
    2019,
    "https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/sbar.html",
    "Official communication-tool page; current access checked 2026-09-05.",
    "صفحة رسمية لأداة التواصل؛ تم التحقق من الوصول في 2026-09-05.",
  ),
];

const choice = (id, en, ar, rationaleEn, rationaleAr) => ({
  id,
  text: bi(en, ar),
  rationale: bi(rationaleEn, rationaleAr),
});

const makeQuestion = ({ choices, ...question }) => {
  const keyedChoice = choices.find((answer) => answer.id === question.correctOptionId);
  const optionRationales = Object.fromEntries(choices.map((answer) => [answer.id, answer.rationale]));

  return {
    ...question,
    domain: domainLabels[question.domainId],
    category: categoryLabels[question.categoryId],
    competency: competencyLabels[question.competencyId],
    difficulty: difficultyLabels[question.difficultyId],
    options: choices.map(({ rationale: _rationale, ...answer }) => answer),
    rationale: keyedChoice?.rationale,
    optionRationales,
    evidenceClaims: [{
      id: `${question.id}:correct-answer-rationale`,
      scope: "correct-answer-rationale",
      referenceIds: question.referenceIds,
      status: "mapped-pending-human-verification",
    }],
    intakePolicyVersion: INTAKE_POLICY_VERSION,
    sourceUse: "independent-clinical-context",
    accessTier: "free",
    learningModelVersion: "Independent nursing learning domains v1.5",
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
    contentVersion: "1.5.0-expansion-draft",
  };
};

export const questionBankExpansionDrafts = [
  makeQuestion({
    id: "saudi-nursing-adult-aki-072",
    examId: "saudi-nursing",
    domainId: "adult-medical-surgical",
    categoryId: "saudi-nursing-adult",
    competencyId: "assessment-recognition",
    topic: bi("Possible acute kidney injury", "الاشتباه في إصابة الكلى الحادة"),
    difficultyId: "advanced",
    stem: bi(
      "An older adult admitted with vomiting has taken ibuprofen for several days. The blood pressure is 94/58 mmHg, and urine output has been 20 mL over 4 hours. What is the nurse's priority response?",
      "أُدخل مريض مسن بسبب القيء وكان يتناول الإيبوبروفين منذ عدة أيام. ضغط الدم 94/58 ملم زئبق، وبلغ البول 20 مل خلال 4 ساعات. ما استجابة الممرض ذات الأولوية؟",
    ),
    choices: [
      choice(
        "a",
        "Give the next ibuprofen dose to improve comfort.",
        "أعطِ الجرعة التالية من الإيبوبروفين لتحسين الراحة.",
        "An NSAID can contribute to kidney injury, especially with hypovolaemia; giving another dose without review may add harm.",
        "قد يسهم مضاد الالتهاب غير الستيرويدي في إصابة الكلى، خاصة مع نقص حجم الدم؛ وقد يزيد إعطاء جرعة أخرى دون مراجعة الضرر.",
      ),
      choice(
        "b",
        "Tell the client to drink 3 litres of water immediately.",
        "اطلب من المريض شرب 3 لترات من الماء فوراً.",
        "A fixed large oral volume is unsafe without assessing haemodynamics, aspiration risk, and possible fluid restrictions.",
        "إعطاء حجم فموي كبير وثابت غير آمن من دون تقييم الدورة الدموية وخطر الاستنشاق وأي قيود محتملة على السوائل.",
      ),
      choice(
        "c",
        "Assess perfusion and volume status, verify the urine measurement, and urgently escalate for renal tests and medication review.",
        "قيّم الإرواء وحالة حجم السوائل، وتحقق من قياس البول، ثم صعّد الحالة عاجلاً لإجراء فحوص الكلى ومراجعة الأدوية.",
        "Marked oliguria with hypotension, fluid loss, and recent NSAID exposure suggests possible acute kidney injury and requires prompt assessment and escalation.",
        "تشير قلة البول الواضحة مع انخفاض الضغط وفقد السوائل والتعرض الحديث لمضاد التهاب غير ستيرويدي إلى إصابة كلوية حادة محتملة وتستلزم تقييماً وتصعيداً سريعاً.",
      ),
      choice(
        "d",
        "Wait until the end of the shift to total the urine output.",
        "انتظر حتى نهاية المناوبة لحساب إجمالي البول.",
        "Delaying action despite oliguria and hypotension can allow renal and circulatory deterioration to progress.",
        "قد يسمح تأخير التدخل رغم قلة البول وانخفاض الضغط باستمرار التدهور الكلوي والدوراني.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["nice-acute-kidney-injury-ng148"],
    clinicalRisk: "high-alert",
    riskDomains: ["acute-kidney-injury", "hypovolaemia", "medication-risk"],
  }),
  makeQuestion({
    id: "saudi-nursing-adult-delirium-prevention-073",
    examId: "saudi-nursing",
    domainId: "adult-medical-surgical",
    categoryId: "saudi-nursing-adult",
    competencyId: "person-centred-care",
    topic: bi("Delirium prevention", "الوقاية من الهذيان"),
    difficultyId: "intermediate",
    stem: bi(
      "An 82-year-old client is at increased risk of delirium after surgery but is currently alert and oriented. Which nursing plan is most appropriate?",
      "مريض عمره 82 عاماً معرض بدرجة أكبر للهذيان بعد الجراحة، لكنه حالياً يقظ ومدرك. أي خطة تمريضية هي الأنسب؟",
    ),
    choices: [
      choice(
        "a",
        "Keep the client in bed and minimise daytime interaction.",
        "أبقِ المريض في السرير وقلّل التفاعل نهاراً.",
        "Unnecessary immobility and reduced stimulation can worsen modifiable delirium risks.",
        "قد يؤدي عدم الحركة غير الضروري وتقليل التحفيز إلى زيادة عوامل خطر الهذيان القابلة للتعديل.",
      ),
      choice(
        "b",
        "Remove glasses and hearing aids so they are not misplaced.",
        "انزع النظارة والمعينات السمعية حتى لا تضيع.",
        "Uncorrected sensory impairment can increase disorientation; needed aids should remain available and functional.",
        "قد يزيد ضعف الحواس غير المصحح من فقدان التوجه؛ لذا ينبغي إبقاء الوسائل المساعدة اللازمة متاحة وصالحة.",
      ),
      choice(
        "c",
        "Use orientation cues, support hydration and early mobility, provide sensory aids, and protect night-time sleep.",
        "استخدم وسائل التوجيه، وادعم الترطيب والحركة المبكرة، ووفّر الوسائل الحسية المساعدة، واحمِ النوم ليلاً.",
        "A tailored multicomponent approach addresses several modifiable delirium risks without exposing the client to unnecessary sedatives.",
        "يعالج النهج المتعدد المكونات والمخصص عدة عوامل خطر قابلة للتعديل للهذيان دون تعريض المريض لمهدئات غير لازمة.",
      ),
      choice(
        "d",
        "Request a routine benzodiazepine each night to prevent confusion.",
        "اطلب بنزوديازيبين روتينياً كل ليلة لمنع التشوش.",
        "Routine sedative use is not a delirium-prevention bundle and may itself worsen confusion or falls.",
        "الاستخدام الروتيني للمهدئات ليس حزمة للوقاية من الهذيان، وقد يزيد التشوش أو السقوط.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["nice-delirium-cg103"],
    clinicalRisk: "standard",
    riskDomains: ["delirium", "older-adult", "falls"],
  }),
  makeQuestion({
    id: "saudi-nursing-adult-stroke-swallow-074",
    examId: "saudi-nursing",
    domainId: "adult-medical-surgical",
    categoryId: "saudi-nursing-adult",
    competencyId: "priority-response",
    topic: bi("Swallow safety after stroke", "سلامة البلع بعد السكتة الدماغية"),
    difficultyId: "intermediate",
    stem: bi(
      "A client with a newly diagnosed acute stroke is alert and asks for water. No swallow screen has been completed. What should the nurse do?",
      "مريض شُخّص حديثاً بسكتة دماغية حادة وهو يقظ ويطلب الماء. لم يُجرَ فحص للبلع بعد. ماذا يفعل الممرض؟",
    ),
    choices: [
      choice(
        "a",
        "Offer one small sip and stop only if the client coughs.",
        "قدّم رشفة صغيرة وتوقف فقط إذا سعل المريض.",
        "A trial sip before screening can expose a person with silent or overt dysphagia to aspiration.",
        "قد تعرض تجربة رشفة قبل الفحص مريضاً لديه عسر بلع صامت أو ظاهر لخطر الاستنشاق الرئوي.",
      ),
      choice(
        "b",
        "Thicken the water based on the nurse's judgement and offer it now.",
        "زد كثافة الماء بناءً على تقدير الممرض وقدّمه الآن.",
        "Fluid consistency should follow a validated screen or specialist assessment rather than an untested assumption.",
        "ينبغي تحديد قوام السوائل بناءً على فحص معتمد أو تقييم متخصص، لا على افتراض غير مختبر.",
      ),
      choice(
        "c",
        "Keep the client nil by mouth until an approved swallow screen or assessment is completed.",
        "أبقِ المريض دون تناول فموي حتى يُستكمل فحص بلع معتمد أو تقييم متخصص.",
        "Screening swallowing before oral food, fluid, or medication reduces preventable aspiration risk after acute stroke.",
        "يساعد فحص البلع قبل إعطاء الطعام أو السوائل أو الأدوية فموياً على تقليل خطر الاستنشاق الممكن منعه بعد السكتة الحادة.",
      ),
      choice(
        "d",
        "Use a straw because it bypasses swallowing difficulty.",
        "استخدم شفاطة لأنها تتجاوز صعوبة البلع.",
        "A straw does not bypass swallowing and may increase bolus-flow risk for some people with dysphagia.",
        "لا تتجاوز الشفاطة عملية البلع، وقد تزيد خطر تدفق اللقمة لدى بعض المصابين بعسر البلع.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["aha-asa-stroke-2026"],
    clinicalRisk: "high-alert",
    riskDomains: ["stroke", "aspiration", "dysphagia"],
  }),
  makeQuestion({
    id: "saudi-nursing-adult-type1-npo-insulin-075",
    examId: "saudi-nursing",
    domainId: "adult-medical-surgical",
    categoryId: "saudi-nursing-adult",
    competencyId: "medication-safety",
    topic: bi("Type 1 diabetes while nil by mouth", "السكري من النوع الأول أثناء منع التناول الفموي"),
    difficultyId: "advanced",
    stem: bi(
      "A hospitalised client with type 1 diabetes is nil by mouth for a procedure. A new instruction says, 'Hold all insulin.' What is the nurse's best response?",
      "مريض منوم مصاب بالسكري من النوع الأول وممنوع من التناول الفموي استعداداً لإجراء. ورد توجيه جديد: «أوقف كل الإنسولين». ما أفضل استجابة للممرض؟",
    ),
    choices: [
      choice(
        "a",
        "Follow the instruction without question because the client is not eating.",
        "اتبع التوجيه دون استفسار لأن المريض لا يتناول الطعام.",
        "Omitting basal insulin in type 1 diabetes can precipitate severe hyperglycaemia and ketoacidosis even when the person is fasting.",
        "قد يؤدي حذف الإنسولين القاعدي لدى مريض السكري من النوع الأول إلى فرط سكر شديد وحماض كيتوني حتى أثناء الصيام.",
      ),
      choice(
        "b",
        "Promptly clarify the instruction and ensure a prescribed basal/correction plan with glucose monitoring is maintained.",
        "استوضح التوجيه فوراً وتأكد من استمرار خطة موصوفة للإنسولين القاعدي والتصحيحي مع مراقبة سكر الدم.",
        "People with type 1 diabetes require basal insulin during fasting; the nurse should clarify a conflicting order and use the authorised inpatient plan.",
        "يحتاج المصاب بالسكري من النوع الأول إلى الإنسولين القاعدي أثناء الصيام؛ لذا يجب توضيح الأمر المتعارض واتباع الخطة المعتمدة للمنومين.",
      ),
      choice(
        "c",
        "Replace all insulin with correction-only insulin after the procedure.",
        "استبدل كل الإنسولين بإنسولين تصحيحي فقط بعد الإجراء.",
        "Correction-only insulin does not replace the continuous basal requirement in type 1 diabetes.",
        "لا يحل الإنسولين التصحيحي وحده محل الحاجة المستمرة للإنسولين القاعدي في السكري من النوع الأول.",
      ),
      choice(
        "d",
        "Give a sugary drink so the usual insulin schedule can continue.",
        "أعطِ مشروباً سكرياً حتى يستمر جدول الإنسولين المعتاد.",
        "Giving oral carbohydrate violates nil-by-mouth instructions and does not safely resolve the medication-order problem.",
        "يخالف إعطاء الكربوهيدرات فموياً تعليمات منع التناول ولا يحل مشكلة أمر الدواء بأمان.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["ada-hospital-care-2026"],
    clinicalRisk: "high-alert",
    riskDomains: ["insulin", "type-1-diabetes", "ketoacidosis"],
  }),
  makeQuestion({
    id: "computerized-acute-cardiac-arrest-076",
    examId: "computerized-practice",
    domainId: "emergency-critical-care",
    categoryId: "computerized-acute-priorities",
    competencyId: "priority-response",
    topic: bi("Recognition of cardiac arrest", "التعرف على توقف القلب"),
    difficultyId: "foundation",
    stem: bi(
      "An adult suddenly collapses in a clinic, is unresponsive, is not breathing normally, and has no definite pulse within 10 seconds. What should the nurse do first?",
      "انهار بالغ فجأة في عيادة، ولا يستجيب ولا يتنفس بصورة طبيعية، ولم يُجس نبض مؤكد خلال 10 ثوانٍ. ماذا يفعل الممرض أولاً؟",
    ),
    choices: [
      choice(
        "a",
        "Place the client in the recovery position and reassess in 2 minutes.",
        "ضع المريض في وضع الإفاقة وأعد التقييم بعد دقيقتين.",
        "The recovery position is not appropriate when cardiac arrest is suspected and compressions are required.",
        "وضع الإفاقة غير مناسب عند الاشتباه في توقف القلب والحاجة إلى الضغطات الصدرية.",
      ),
      choice(
        "b",
        "Activate the emergency response, start high-quality CPR, and apply an AED as soon as it is available.",
        "فعّل الاستجابة الطارئة، وابدأ إنعاشاً قلبياً رئوياً عالي الجودة، واستخدم مزيل الرجفان الآلي حال توفره.",
        "Unresponsiveness, abnormal breathing, and no definite pulse indicate cardiac arrest; immediate CPR and early defibrillation are time critical.",
        "يشير عدم الاستجابة والتنفس غير الطبيعي وغياب نبض مؤكد إلى توقف القلب؛ والإنعاش الفوري وإزالة الرجفان المبكرة عاملان حاسمان زمنياً.",
      ),
      choice(
        "c",
        "Obtain a complete health history before calling for help.",
        "احصل على تاريخ صحي كامل قبل طلب المساعدة.",
        "History taking must not delay resuscitation in suspected cardiac arrest.",
        "يجب ألا يؤخر أخذ التاريخ الصحي الإنعاش عند الاشتباه في توقف القلب.",
      ),
      choice(
        "d",
        "Wait for a clinician to confirm the rhythm before starting compressions.",
        "انتظر الطبيب لتأكيد النظم قبل بدء الضغطات.",
        "Waiting for rhythm confirmation delays the immediate chest compressions required after rapid arrest recognition.",
        "انتظار تأكيد النظم يؤخر الضغطات الصدرية الفورية اللازمة بعد التعرف السريع على التوقف.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["aha-2025"],
    clinicalRisk: "high-alert",
    riskDomains: ["cardiac-arrest", "resuscitation", "defibrillation"],
  }),
  makeQuestion({
    id: "computerized-acute-septic-shock-077",
    examId: "computerized-practice",
    domainId: "emergency-critical-care",
    categoryId: "computerized-acute-priorities",
    competencyId: "priority-response",
    topic: bi("Sepsis with shock", "الإنتان المصحوب بصدمة"),
    difficultyId: "advanced",
    stem: bi(
      "An adult with suspected infection is confused, has a blood pressure of 82/48 mmHg, and has cool mottled skin. Which response is the priority?",
      "بالغ مشتبه بإصابته بعدوى، لديه تشوش وضغط دم 82/48 ملم زئبق وجلده بارد ومرقش. أي استجابة هي الأولوية؟",
    ),
    choices: [
      choice(
        "a",
        "Wait for imaging to identify the exact infection source before escalating.",
        "انتظر التصوير لتحديد مصدر العدوى بدقة قبل التصعيد.",
        "Diagnostic imaging must not delay emergency recognition and treatment of probable sepsis with shock.",
        "يجب ألا يؤخر التصوير التشخيصي التعرف الطارئ على الإنتان المحتمل المصحوب بصدمة وعلاجه.",
      ),
      choice(
        "b",
        "Offer oral fluids and repeat the blood pressure in one hour.",
        "قدّم سوائل فموية وأعد قياس الضغط بعد ساعة.",
        "Shock signs require immediate monitored resuscitation, not delayed reassessment after oral fluids.",
        "تستلزم علامات الصدمة إنعاشاً فورياً خاضعاً للمراقبة، لا إعادة تقييم متأخرة بعد سوائل فموية.",
      ),
      choice(
        "c",
        "Activate the sepsis emergency pathway and begin protocol-directed resuscitation, obtaining cultures promptly if this does not delay antimicrobials.",
        "فعّل مسار طوارئ الإنتان وابدأ الإنعاش وفق البروتوكول، مع أخذ المزارع سريعاً إذا لم يؤخر ذلك مضادات الميكروبات.",
        "Hypotension, altered mental state, and poor perfusion indicate time-critical sepsis with shock; resuscitation and antimicrobial treatment must not be delayed.",
        "يشير انخفاض الضغط وتغير الوعي وضعف الإرواء إلى إنتان حرج زمنياً مصحوب بصدمة؛ ويجب عدم تأخير الإنعاش والعلاج المضاد للميكروبات.",
      ),
      choice(
        "d",
        "Administer an antipyretic and discharge if the temperature decreases.",
        "أعطِ خافضاً للحرارة واخرج المريض إذا انخفضت حرارته.",
        "Temperature response does not resolve circulatory shock or make discharge safe.",
        "لا يعالج انخفاض الحرارة الصدمة الدورانية ولا يجعل الخروج آمناً.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["ssc-2026", "nice-ng253-2025"],
    clinicalRisk: "high-alert",
    riskDomains: ["sepsis", "shock", "time-critical-deterioration"],
  }),
  makeQuestion({
    id: "computerized-acute-status-seizure-078",
    examId: "computerized-practice",
    domainId: "emergency-critical-care",
    categoryId: "computerized-acute-priorities",
    competencyId: "priority-response",
    topic: bi("Prolonged convulsive seizure", "النوبة التشنجية المطولة"),
    difficultyId: "intermediate",
    stem: bi(
      "A client has had continuous generalised convulsive activity for 5 minutes. What is the nurse's best immediate response?",
      "يعاني مريض من نشاط تشنجي معمّم مستمر منذ 5 دقائق. ما أفضل استجابة فورية للممرض؟",
    ),
    choices: [
      choice(
        "a",
        "Restrain the arms and legs to stop the movements.",
        "ثبّت الذراعين والساقين لإيقاف الحركات.",
        "Restraining a convulsing person can cause injury and does not terminate the seizure.",
        "قد يؤدي تقييد الشخص المتشنج إلى إصابته ولا ينهي النوبة.",
      ),
      choice(
        "b",
        "Call the emergency response, protect the airway and client from injury, and give authorised rescue treatment according to the emergency plan.",
        "اطلب الاستجابة الطارئة، واحمِ مجرى الهواء والمريض من الإصابة، وأعطِ العلاج الإسعافي المصرح به وفق الخطة الطارئة.",
        "A convulsive seizure lasting 5 minutes is status epilepticus and needs immediate emergency management, including an authorised benzodiazepine plan where available.",
        "تُعد النوبة التشنجية التي تستمر 5 دقائق حالة صرعية وتحتاج إلى تدبير طارئ فوري، بما في ذلك خطة بنزوديازيبين مصرح بها عند توفرها.",
      ),
      choice(
        "c",
        "Insert a padded object between the teeth.",
        "أدخل جسماً مبطناً بين الأسنان.",
        "Nothing should be placed in the mouth during a convulsion because it can obstruct the airway or cause injury.",
        "يجب عدم وضع أي شيء في الفم أثناء التشنج لأنه قد يسد مجرى الهواء أو يسبب إصابة.",
      ),
      choice(
        "d",
        "Observe for another 5 minutes before seeking help.",
        "راقب 5 دقائق إضافية قبل طلب المساعدة.",
        "Waiting delays treatment after the threshold for status epilepticus has already been reached.",
        "يؤخر الانتظار العلاج بعد بلوغ عتبة الحالة الصرعية بالفعل.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["nice-epilepsies-ng217-2025"],
    clinicalRisk: "high-alert",
    riskDomains: ["status-epilepticus", "airway", "emergency-medication"],
  }),
  makeQuestion({
    id: "computerized-acute-abcde-deterioration-079",
    examId: "computerized-practice",
    domainId: "emergency-critical-care",
    categoryId: "computerized-acute-priorities",
    competencyId: "assessment-recognition",
    topic: bi("Structured assessment of deterioration", "التقييم المنظم للتدهور"),
    difficultyId: "intermediate",
    stem: bi(
      "Thirty minutes after a bedside procedure, a client becomes drowsy, pale, tachypnoeic, and has an oxygen saturation of 88%. What should the nurse do first?",
      "بعد ثلاثين دقيقة من إجراء بجانب السرير، أصبح المريض نعساً وشاحباً وسريع التنفس، وبلغ تشبع الأكسجين 88%. ماذا يفعل الممرض أولاً؟",
    ),
    choices: [
      choice(
        "a",
        "Complete the procedure documentation before reassessing the client.",
        "أكمل توثيق الإجراء قبل إعادة تقييم المريض.",
        "Documentation must not delay assessment and treatment of an acute physiological deterioration.",
        "يجب ألا يؤخر التوثيق تقييم التدهور الفسيولوجي الحاد وعلاجه.",
      ),
      choice(
        "b",
        "Inspect only the procedure site because it is the likely cause.",
        "افحص موضع الإجراء فقط لأنه السبب المرجح.",
        "Focusing on one presumed cause can miss immediate airway, breathing, or circulatory threats.",
        "قد يؤدي التركيز على سبب مفترض واحد إلى تفويت مهددات فورية لمجرى الهواء أو التنفس أو الدورة الدموية.",
      ),
      choice(
        "c",
        "Call for urgent help, begin an ABCDE assessment, and treat life-threatening problems as they are found.",
        "اطلب مساعدة عاجلة، وابدأ تقييم ABCDE، وعالج المشكلات المهددة للحياة عند اكتشافها.",
        "A structured ABCDE response prioritises immediate threats, early treatment, repeated assessment, and timely escalation.",
        "ترتب استجابة ABCDE المنظمة المهددات الفورية وتعالجها مبكراً مع إعادة التقييم والتصعيد في الوقت المناسب.",
      ),
      choice(
        "d",
        "Allow the client to sleep and repeat observations in 30 minutes.",
        "دع المريض ينام وأعد الملاحظات بعد 30 دقيقة.",
        "Drowsiness with hypoxaemia is a warning sign that requires immediate action, not delayed observation.",
        "النعاس المصحوب بنقص الأكسجة علامة تحذيرية تستلزم تدخلاً فورياً لا مراقبة متأخرة.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["rcuk-abcde-2024"],
    clinicalRisk: "high-alert",
    riskDomains: ["hypoxaemia", "acute-deterioration", "airway-breathing"],
  }),
  makeQuestion({
    id: "saudi-nursing-maternal-child-infant-fever-080",
    examId: "saudi-nursing",
    domainId: "pediatrics",
    categoryId: "saudi-nursing-maternal-child",
    competencyId: "assessment-recognition",
    topic: bi("Fever in a young infant", "الحمى لدى الرضيع صغير السن"),
    difficultyId: "foundation",
    stem: bi(
      "A 6-week-old infant has an axillary temperature of 38.1°C and is sleepier than usual. What is the most appropriate advice?",
      "رضيع عمره 6 أسابيع حرارته الإبطية 38.1°م وهو أكثر نعاساً من المعتاد. ما النصيحة الأنسب؟",
    ),
    choices: [
      choice(
        "a",
        "Arrange urgent paediatric assessment now.",
        "رتّب تقييماً عاجلاً من فريق الأطفال الآن.",
        "A temperature of 38°C or higher in an infant younger than 3 months is a high-risk feature for serious illness and needs urgent assessment.",
        "تُعد حرارة 38°م أو أكثر لدى رضيع دون 3 أشهر سمة عالية الخطورة لمرض خطير وتستلزم تقييماً عاجلاً.",
      ),
      choice(
        "b",
        "Give an over-the-counter cold medicine and reassess tomorrow.",
        "أعطِ دواء زكام دون وصفة وأعد التقييم غداً.",
        "Cold remedies do not address the risk of serious infection and can delay necessary assessment.",
        "لا تعالج أدوية الزكام خطر العدوى الخطيرة وقد تؤخر التقييم اللازم.",
      ),
      choice(
        "c",
        "Use a cold bath until the temperature falls below 37°C.",
        "استخدم حماماً بارداً حتى تنخفض الحرارة إلى أقل من 37°م.",
        "Cooling measures do not replace urgent evaluation of a high-risk young infant and may cause distress.",
        "لا تحل وسائل التبريد محل التقييم العاجل للرضيع عالي الخطورة وقد تسبب له الضيق.",
      ),
      choice(
        "d",
        "Wait for a rash before seeking care.",
        "انتظر ظهور طفح قبل طلب الرعاية.",
        "A rash is not required for serious illness; the infant already meets a high-risk temperature threshold.",
        "لا يلزم وجود طفح لحدوث مرض خطير؛ فالرضيع بلغ بالفعل عتبة حرارة عالية الخطورة.",
      ),
    ],
    correctOptionId: "a",
    referenceIds: ["nice-fever-under5-ng143"],
    clinicalRisk: "high-alert",
    riskDomains: ["young-infant", "fever", "serious-infection"],
  }),
  makeQuestion({
    id: "saudi-nursing-maternal-child-gastro-shock-081",
    examId: "saudi-nursing",
    domainId: "pediatrics",
    categoryId: "saudi-nursing-maternal-child",
    competencyId: "priority-response",
    topic: bi("Gastroenteritis with shock", "التهاب المعدة والأمعاء المصحوب بصدمة"),
    difficultyId: "advanced",
    stem: bi(
      "A 2-year-old with vomiting and diarrhoea is lethargic and mottled, with a weak pulse and capillary refill of 5 seconds. What is the priority nursing action?",
      "طفل عمره سنتان لديه قيء وإسهال، وهو خامل وجلده مرقش ونبضه ضعيف وزمن امتلاء الشعيرات 5 ثوانٍ. ما الإجراء التمريضي ذو الأولوية؟",
    ),
    choices: [
      choice(
        "a",
        "Encourage the child to drink a large cup of oral rehydration solution at once.",
        "شجّع الطفل على شرب كوب كبير من محلول الإماهة الفموي دفعة واحدة.",
        "A lethargic child with shock signs needs emergency resuscitation; a large oral bolus may be unsafe and inadequate.",
        "يحتاج الطفل الخامل ذو علامات الصدمة إلى إنعاش طارئ؛ وقد تكون كمية فموية كبيرة دفعة واحدة غير آمنة وغير كافية.",
      ),
      choice(
        "b",
        "Activate emergency paediatric support and begin airway, breathing, and circulation management with protocol-directed vascular access and fluids.",
        "فعّل دعم طوارئ الأطفال وابدأ تدبير مجرى الهواء والتنفس والدورة الدموية مع تأمين وصول وعائي وسوائل وفق البروتوكول.",
        "Lethargy, mottling, a weak pulse, and prolonged capillary refill indicate shock and require immediate paediatric resuscitation.",
        "يشير الخمول والترقش وضعف النبض وطول زمن امتلاء الشعيرات إلى الصدمة وتستلزم إنعاشاً فورياً للأطفال.",
      ),
      choice(
        "c",
        "Give an antidiarrhoeal medicine and observe for two hours.",
        "أعطِ دواءً مضاداً للإسهال وراقب الطفل ساعتين.",
        "This does not treat circulatory shock and delays time-critical resuscitation.",
        "لا يعالج ذلك الصدمة الدورانية ويؤخر الإنعاش الحرج زمنياً.",
      ),
      choice(
        "d",
        "Schedule a routine primary-care visit within one week.",
        "حدد موعداً روتينياً في الرعاية الأولية خلال أسبوع.",
        "The child has emergency warning signs and is not suitable for routine follow-up.",
        "لدى الطفل علامات طارئة ولا تناسبه المتابعة الروتينية.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["nice-gastroenteritis-cg84"],
    clinicalRisk: "high-alert",
    riskDomains: ["paediatric-shock", "dehydration", "gastroenteritis"],
  }),
  makeQuestion({
    id: "saudi-nursing-maternal-child-bronchiolitis-feeding-082",
    examId: "saudi-nursing",
    domainId: "pediatrics",
    categoryId: "saudi-nursing-maternal-child",
    competencyId: "assessment-recognition",
    topic: bi("Hydration risk in bronchiolitis", "خطر الجفاف في التهاب القصيبات"),
    difficultyId: "intermediate",
    stem: bi(
      "A 7-month-old with bronchiolitis has an oxygen saturation of 95% on room air and mild chest recession. Intake is less than half the usual amount, and there has been no wet nappy for 12 hours. What is the best response?",
      "رضيع عمره 7 أشهر مصاب بالتهاب القصيبات، وتشبع الأكسجين 95% على هواء الغرفة مع انكماش صدري خفيف. تناول أقل من نصف الكمية المعتادة ولم يبلل حفاضاً منذ 12 ساعة. ما أفضل استجابة؟",
    ),
    choices: [
      choice(
        "a",
        "Focus only on the oxygen saturation because it is above 94%.",
        "ركّز فقط على تشبع الأكسجين لأنه أعلى من 94%.",
        "Acceptable oxygen saturation does not exclude clinically important dehydration or feeding failure.",
        "لا يستبعد تشبع الأكسجين المقبول وجود جفاف مهم سريرياً أو فشل في التغذية.",
      ),
      choice(
        "b",
        "Arrange prompt paediatric review and assess hydration and feeding safety.",
        "رتّب مراجعة سريعة من فريق الأطفال وقيّم الترطيب وسلامة التغذية.",
        "Poor intake and no wet nappy for 12 hours are referral and dehydration warning features even without severe hypoxaemia.",
        "يُعد ضعف التناول وعدم تبليل حفاض لمدة 12 ساعة من سمات التحذير للجفاف والإحالة حتى دون نقص أكسجة شديد.",
      ),
      choice(
        "c",
        "Force a full bottle quickly to restore the missed volume.",
        "أجبر الرضيع على تناول رضعة كاملة سريعاً لتعويض الكمية الفائتة.",
        "Forced rapid feeding can increase aspiration and fatigue risk in an infant with respiratory illness.",
        "قد تزيد التغذية السريعة بالإجبار من خطر الاستنشاق والإجهاد لدى رضيع مصاب بمرض تنفسي.",
      ),
      choice(
        "d",
        "Delay reassessment until the child becomes cyanosed.",
        "أجّل إعادة التقييم حتى يظهر الزراق على الطفل.",
        "Cyanosis is a late, severe sign; existing hydration warning features already require action.",
        "الزراق علامة شديدة ومتأخرة؛ وعلامات التحذير الحالية للجفاف تستلزم التدخل بالفعل.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["nice-bronchiolitis-ng9"],
    clinicalRisk: "high-alert",
    riskDomains: ["bronchiolitis", "dehydration", "feeding-safety"],
  }),
  makeQuestion({
    id: "saudi-nursing-maternal-child-croup-distress-083",
    examId: "saudi-nursing",
    domainId: "pediatrics",
    categoryId: "saudi-nursing-maternal-child",
    competencyId: "person-centred-care",
    topic: bi("Low-distress care in croup", "تقليل إزعاج الطفل المصاب بالخُنّاق"),
    difficultyId: "intermediate",
    stem: bi(
      "A 2-year-old with a barking cough has stridor that becomes louder when staff approach. The child is alert, pink, and sitting with a parent. What is the best initial nursing approach?",
      "طفل عمره سنتان لديه سعال نباحي وصرير يزداد عند اقتراب الطاقم. الطفل يقظ ولونه وردي ويجلس مع أحد والديه. ما أفضل نهج تمريضي أولي؟",
    ),
    choices: [
      choice(
        "a",
        "Keep the child with the parent, minimise distress, and assess quietly while preparing prescribed treatment.",
        "أبقِ الطفل مع والده أو والدته، وقلّل إزعاجه، وقيّمه بهدوء مع التحضير للعلاج الموصوف.",
        "Agitation can worsen upper-airway obstruction in croup, so a calm, minimally distressing assessment is safest while treatment is prepared.",
        "قد يزيد الهياج انسداد مجرى الهواء العلوي في الخُنّاق؛ لذا يكون التقييم الهادئ قليل الإزعاج أكثر أماناً أثناء تجهيز العلاج.",
      ),
      choice(
        "b",
        "Separate the child from the parent for a more complete examination.",
        "افصل الطفل عن والده أو والدته لإجراء فحص أكثر اكتمالاً.",
        "Separation can increase distress and worsen airway obstruction.",
        "قد يزيد الفصل من الضيق ويفاقم انسداد مجرى الهواء.",
      ),
      choice(
        "c",
        "Lay the child flat and inspect the throat with a tongue depressor.",
        "مدّد الطفل بشكل مسطح وافحص الحلق بخافض اللسان.",
        "Forced positioning and an upsetting throat examination can worsen distress and airway compromise.",
        "قد تزيد الوضعية القسرية وفحص الحلق المزعج من الضيق وتهديد مجرى الهواء.",
      ),
      choice(
        "d",
        "Ask the child to take repeated deep breaths for auscultation.",
        "اطلب من الطفل أخذ أنفاس عميقة متكررة للتسمع.",
        "Unnecessary demands may upset the child; observation while calm is more informative and safer initially.",
        "قد تزعج الطلبات غير الضرورية الطفل؛ وتكون الملاحظة أثناء الهدوء أكثر فائدة وأماناً في البداية.",
      ),
    ],
    correctOptionId: "a",
    referenceIds: ["rch-croup-2024"],
    clinicalRisk: "high-alert",
    riskDomains: ["paediatric-airway", "croup", "distress"],
  }),
  makeQuestion({
    id: "saudi-nursing-maternal-pprom-084",
    examId: "saudi-nursing",
    domainId: "maternal-newborn",
    categoryId: "saudi-nursing-maternal-child",
    competencyId: "priority-response",
    topic: bi("Suspected preterm prelabour rupture of membranes", "الاشتباه في تمزق الأغشية المبكر قبل المخاض"),
    difficultyId: "advanced",
    stem: bi(
      "A woman at 31 weeks of pregnancy reports a sudden watery vaginal loss and continued leaking, without contractions. What is the most appropriate response?",
      "امرأة في الأسبوع 31 من الحمل تُبلغ عن نزول مائي مفاجئ من المهبل مع استمرار التسرب دون تقلصات. ما الاستجابة الأنسب؟",
    ),
    choices: [
      choice(
        "a",
        "Advise her to use a tampon and wait until contractions begin.",
        "انصحها باستخدام سدادة قطنية والانتظار حتى تبدأ التقلصات.",
        "Waiting and inserting a tampon can delay assessment and is inappropriate when membrane rupture is possible.",
        "قد يؤدي الانتظار وإدخال سدادة قطنية إلى تأخير التقييم، وهو غير مناسب عند احتمال تمزق الأغشية.",
      ),
      choice(
        "b",
        "Arrange prompt maternity assessment using the local suspected-PPROM pathway and avoid an unplanned digital vaginal examination.",
        "رتّب تقييماً سريعاً في قسم الولادة وفق المسار المحلي للاشتباه في تمزق الأغشية المبكر، وتجنب الفحص المهبلي الرقمي غير المخطط له.",
        "Possible preterm membrane rupture needs prompt maternal-fetal assessment; diagnosis is generally approached with history and speculum-based assessment rather than a routine digital examination.",
        "يحتاج احتمال تمزق الأغشية المبكر إلى تقييم سريع للأم والجنين؛ ويعتمد التشخيص عادةً على التاريخ والفحص بالمنظار بدلاً من الفحص الرقمي الروتيني.",
      ),
      choice(
        "c",
        "Perform repeated digital examinations to measure cervical change.",
        "أجرِ فحوصاً مهبلية رقمية متكررة لقياس تغير عنق الرحم.",
        "Routine repeated digital examinations are not the initial diagnostic approach and may increase infection risk after membrane rupture.",
        "لا تُعد الفحوص الرقمية المتكررة النهج التشخيصي الأولي وقد تزيد خطر العدوى بعد تمزق الأغشية.",
      ),
      choice(
        "d",
        "Reassure her that watery loss is normal at 31 weeks.",
        "طمئنها بأن النزول المائي طبيعي في الأسبوع 31.",
        "Persistent watery loss at this gestation may indicate PPROM and must not be dismissed without assessment.",
        "قد يدل النزول المائي المستمر في هذا العمر الحملي على تمزق الأغشية المبكر ولا يجوز إهماله دون تقييم.",
      ),
    ],
    correctOptionId: "b",
    referenceIds: ["nice-preterm-labour-ng25"],
    clinicalRisk: "high-alert",
    riskDomains: ["preterm-birth", "ruptured-membranes", "maternal-fetal-safety"],
  }),
  makeQuestion({
    id: "saudi-nursing-maternal-reduced-movement-085",
    examId: "saudi-nursing",
    domainId: "maternal-newborn",
    categoryId: "saudi-nursing-maternal-child",
    competencyId: "assessment-recognition",
    topic: bi("Reduced fetal movement", "انخفاض حركة الجنين"),
    difficultyId: "foundation",
    stem: bi(
      "At 30 weeks of pregnancy, a woman says her baby has moved much less than usual since the morning. What advice should the nurse give?",
      "في الأسبوع 30 من الحمل، تقول امرأة إن حركة جنينها أقل بكثير من المعتاد منذ الصباح. ما النصيحة التي يقدمها الممرض؟",
    ),
    choices: [
      choice(
        "a",
        "Contact maternity services now for maternal and fetal assessment.",
        "تواصلي الآن مع خدمات الولادة لتقييم الأم والجنين.",
        "A concerning reduction in fetal movement after 24 weeks requires prompt contact and assessment rather than waiting for the next appointment.",
        "يستلزم الانخفاض المقلق في حركة الجنين بعد الأسبوع 24 تواصلاً وتقييماً سريعين بدلاً من انتظار الموعد التالي.",
      ),
      choice(
        "b",
        "Wait until the next routine antenatal visit.",
        "انتظري حتى زيارة متابعة الحمل الروتينية التالية.",
        "Routine follow-up may be too late when fetal movement has changed significantly.",
        "قد تكون المتابعة الروتينية متأخرة عند حدوث تغير ملحوظ في حركة الجنين.",
      ),
      choice(
        "c",
        "Take a sedating medicine and rest overnight.",
        "تناولي دواءً مهدئاً واستريحي طوال الليل.",
        "Sedation does not evaluate fetal wellbeing and can delay necessary care.",
        "لا يقيّم التهدئة سلامة الجنين وقد يؤخر الرعاية اللازمة.",
      ),
      choice(
        "d",
        "Ignore the change if there is no vaginal bleeding.",
        "تجاهلي التغير إذا لم يوجد نزف مهبلي.",
        "Reduced movement can be important even without bleeding or pain.",
        "قد يكون انخفاض الحركة مهماً حتى دون نزف أو ألم.",
      ),
    ],
    correctOptionId: "a",
    referenceIds: ["nice-antenatal-care-ng201"],
    clinicalRisk: "high-alert",
    riskDomains: ["reduced-fetal-movement", "fetal-wellbeing", "antenatal-triage"],
  }),
  makeQuestion({
    id: "saudi-nursing-maternal-postpartum-hypertension-086",
    examId: "saudi-nursing",
    domainId: "maternal-newborn",
    categoryId: "saudi-nursing-maternal-child",
    competencyId: "priority-response",
    topic: bi("Postpartum severe hypertension", "ارتفاع ضغط الدم الشديد بعد الولادة"),
    difficultyId: "advanced",
    stem: bi(
      "Four days after birth, a woman reports a severe headache and flashing lights. Her blood pressure is 166/108 mmHg. What is the priority response?",
      "بعد أربعة أيام من الولادة، تُبلغ امرأة عن صداع شديد ورؤية ومضات ضوئية، وضغطها 166/108 ملم زئبق. ما الاستجابة ذات الأولوية؟",
    ),
    choices: [
      choice(
        "a",
        "Advise rest at home and arrange a routine check next week.",
        "انصحها بالراحة في المنزل وحدد فحصاً روتينياً الأسبوع المقبل.",
        "Severe hypertension with neurological symptoms after birth is an emergency and is unsafe for routine follow-up.",
        "ارتفاع الضغط الشديد المصحوب بأعراض عصبية بعد الولادة حالة طارئة ولا يناسبها الانتظار للمتابعة الروتينية.",
      ),
      choice(
        "b",
        "Treat the headache with an over-the-counter analgesic and recheck tomorrow.",
        "عالج الصداع بمسكن دون وصفة وأعد الفحص غداً.",
        "Symptom relief does not address the risk of eclampsia, stroke, or other hypertensive complications.",
        "لا يعالج تخفيف الأعراض خطر الإرجاج أو السكتة الدماغية أو غيرها من مضاعفات ارتفاع الضغط.",
      ),
      choice(
        "c",
        "Escalate urgently, repeat and monitor observations, institute seizure-safety measures, and activate the postpartum hypertension protocol.",
        "صعّد الحالة عاجلاً، وأعد العلامات الحيوية وراقبها، وطبّق تدابير الوقاية من أذى التشنجات، وفعّل بروتوكول ارتفاع الضغط بعد الولادة.",
        "Severe-range blood pressure with headache and visual symptoms postpartum requires immediate assessment and protocol-directed treatment.",
        "يستلزم ضغط الدم في النطاق الشديد مع الصداع والأعراض البصرية بعد الولادة تقييماً فورياً وعلاجاً وفق البروتوكول.",
      ),
      choice(
        "d",
        "Encourage vigorous walking to lower the blood pressure.",
        "شجّعها على المشي المجهد لخفض ضغط الدم.",
        "Exercise is not an emergency treatment and may be unsafe in severe symptomatic hypertension.",
        "ليست الرياضة علاجاً طارئاً وقد تكون غير آمنة عند ارتفاع الضغط الشديد المصحوب بأعراض.",
      ),
    ],
    correctOptionId: "c",
    referenceIds: ["nice-hypertension-pregnancy-ng133"],
    clinicalRisk: "high-alert",
    riskDomains: ["postpartum-hypertension", "eclampsia", "stroke"],
  }),
];

const usedExpansionReferenceIds = new Set(
  questionBankExpansionDrafts.flatMap((question) => question.referenceIds),
);

// Only expose sources actually mapped to this file's 15 questions. The private
// candidate list makes later split-file merging safe without publishing unused
// evidence records from domains owned by another authoring pass.
export const questionBankExpansionSources = expansionSourceCandidates.filter(
  (item) => usedExpansionReferenceIds.has(item.id),
);

export const questionBankExpansionDistribution = Object.freeze({
  "adult-medical-surgical": 4,
  "emergency-critical-care": 4,
  pediatrics: 4,
  "maternal-newborn": 3,
});

const hasBilingualText = (value) => (
  value
  && typeof value.en === "string"
  && value.en.trim().length > 0
  && typeof value.ar === "string"
  && value.ar.trim().length > 0
);

export const validateQuestionBankExpansion = () => {
  const errors = [];
  const sourceIds = new Set(questionBankExpansionSources.map((item) => item.id));
  const questionIds = new Set();
  const actualDistribution = Object.fromEntries(
    Object.keys(questionBankExpansionDistribution).map((domainId) => [domainId, 0]),
  );

  if (questionBankExpansionDrafts.length !== 15) {
    errors.push(`Expected 15 questions; found ${questionBankExpansionDrafts.length}.`);
  }

  for (const question of questionBankExpansionDrafts) {
    if (questionIds.has(question.id)) {
      errors.push(`Duplicate question id: ${question.id}.`);
    }
    questionIds.add(question.id);

    if (!(question.domainId in actualDistribution)) {
      errors.push(`${question.id}: unexpected domain ${question.domainId}.`);
    } else {
      actualDistribution[question.domainId] += 1;
    }

    if (!hasBilingualText(question.topic) || !hasBilingualText(question.stem) || !hasBilingualText(question.rationale)) {
      errors.push(`${question.id}: missing bilingual topic, stem, or keyed rationale.`);
    }

    if (!question.categoryId || !question.competencyId || !question.difficultyId) {
      errors.push(`${question.id}: category, competency, and difficulty ids are required.`);
    }

    if (!question.domain || !question.category || !question.competency || !question.difficulty) {
      errors.push(`${question.id}: an id does not resolve to a bilingual display label.`);
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      errors.push(`${question.id}: exactly four options are required.`);
      continue;
    }

    const optionIds = new Set(question.options.map((answer) => answer.id));
    if (optionIds.size !== 4) {
      errors.push(`${question.id}: option ids must be unique.`);
    }
    if (!optionIds.has(question.correctOptionId)) {
      errors.push(`${question.id}: correctOptionId does not identify an option.`);
    }

    for (const answer of question.options) {
      if (!hasBilingualText(answer.text)) {
        errors.push(`${question.id}.${answer.id}: missing bilingual option text.`);
      }
      if (!hasBilingualText(question.optionRationales?.[answer.id])) {
        errors.push(`${question.id}.${answer.id}: missing bilingual option rationale.`);
      }
    }

    if (!Array.isArray(question.referenceIds) || question.referenceIds.length === 0) {
      errors.push(`${question.id}: at least one internal clinical reference is required.`);
    } else {
      for (const referenceId of question.referenceIds) {
        if (!sourceIds.has(referenceId)) {
          errors.push(`${question.id}: unknown reference id ${referenceId}.`);
        }
      }
    }

    if (
      question.reviewStatus !== "draft"
      || question.clinicalReview?.status !== "pending"
      || question.legalReview?.status !== "pending"
      || question.translationReview?.status !== "pending"
    ) {
      errors.push(`${question.id}: all human-review gates must remain draft/pending.`);
    }

    if (question.provenance?.origin !== "independently-authored-clean-room") {
      errors.push(`${question.id}: clean-room provenance is required.`);
    }
  }

  for (const [domainId, expected] of Object.entries(questionBankExpansionDistribution)) {
    if (actualDistribution[domainId] !== expected) {
      errors.push(`${domainId}: expected ${expected}; found ${actualDistribution[domainId]}.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    questionCount: questionBankExpansionDrafts.length,
    sourceCount: questionBankExpansionSources.length,
    distribution: actualDistribution,
  };
};

export const questionBankExpansion = Object.freeze({
  schemaVersion: "1.0.0",
  contentVersion: "1.5.0-expansion-draft",
  intakePolicyVersion: INTAKE_POLICY_VERSION,
  sources: questionBankExpansionSources,
  questions: questionBankExpansionDrafts,
  distribution: questionBankExpansionDistribution,
  releaseGate: bi(
    "Internal draft only — qualified human clinical, legal, and Arabic-language review is required before publication.",
    "مسودة داخلية فقط — يلزم إجراء مراجعة بشرية مؤهلة سريرياً وقانونياً ولغوياً بالعربية قبل النشر.",
  ),
});
