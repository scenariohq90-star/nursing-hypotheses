const bi = (en, ar) => ({ en, ar });

const DOMAIN_CATALOG = {
  "assessment-recognition": bi(
    "Assessment and risk recognition",
    "التقييم والتعرّف على المخاطر",
  ),
  "prioritization-response": bi(
    "Prioritisation and immediate response",
    "تحديد الأولويات والاستجابة الفورية",
  ),
  "escalation-coordination": bi(
    "Escalation and team coordination",
    "التصعيد وتنسيق الفريق",
  ),
  "reassessment-monitoring": bi(
    "Reassessment and trend monitoring",
    "إعادة التقييم ومراقبة الاتجاهات",
  ),
  "communication-handover": bi(
    "Team communication and handover",
    "تواصل الفريق والتسليم",
  ),
  "safety-quality": bi(
    "Patient safety and quality improvement",
    "سلامة المرضى وتحسين الجودة",
  ),
  "person-centred-care": bi(
    "Person-centred and respectful care",
    "الرعاية المتمحورة حول الشخص والمحترمة",
  ),
};

const COMPETENCY_DOMAIN_BY_SKILL = {
  "rapid-assessment": "assessment-recognition",
  prioritization: "prioritization-response",
  reassessment: "reassessment-monitoring",
  escalation: "escalation-coordination",
  "team-communication": "communication-handover",
  handover: "communication-handover",
  "suicide-risk-screening": "assessment-recognition",
  "de-escalation": "person-centred-care",
  "mental-health-handover": "communication-handover",
  "source-control": "prioritization-response",
  "standard-precautions": "safety-quality",
  "exposure-management": "safety-quality",
  "medication-verification": "safety-quality",
  "allergy-safety": "safety-quality",
  "near-miss-learning": "safety-quality",
  "trend-recognition": "reassessment-monitoring",
  "emergency-escalation": "escalation-coordination",
  "safe-transfer": "communication-handover",
  "pediatric-assessment": "assessment-recognition",
  "pediatric-escalation": "escalation-coordination",
  "family-handover": "person-centred-care",
  "maternal-risk-recognition": "assessment-recognition",
  "maternal-emergency-response": "prioritization-response",
  "respectful-continuity": "person-centred-care",
  "deterioration-recognition": "assessment-recognition",
  "sepsis-escalation": "escalation-coordination",
  "perfusion-reassessment": "reassessment-monitoring",
  "delirium-recognition": "assessment-recognition",
  "mobility-safety": "safety-quality",
  "oncology-deterioration": "assessment-recognition",
  "procedure-verification": "safety-quality",
  "speak-up-escalation": "escalation-coordination",
  "medication-reconciliation": "safety-quality",
  "teach-back": "person-centred-care",
};

export const competencyDomains = Object.entries(DOMAIN_CATALOG).map(([slug, label]) => ({
  slug,
  label,
}));

const vital = (en, ar, value, unitEn = "", unitAr = "") => ({
  label: bi(en, ar),
  value: String(value),
  unit: bi(unitEn, unitAr),
});

const competency = (slug, en, ar) => ({ slug, label: bi(en, ar) });

const choice = (
  id,
  text,
  score,
  classification,
  feedback,
  rationale,
  competencySlug,
) => ({
  id,
  text,
  score,
  classification,
  feedback,
  rationale,
  competency: competencySlug,
  competencyDomain: COMPETENCY_DOMAIN_BY_SKILL[competencySlug] ?? competencySlug,
  competencyDomainLabel:
    DOMAIN_CATALOG[COMPETENCY_DOMAIN_BY_SKILL[competencySlug]] ?? bi(competencySlug, competencySlug),
});

/**
 * Publisher and regulator sources used as clinical context for the original cases.
 * A link is not an endorsement or permission to reproduce a linked work.
 */
export const references = [
  {
    id: "aha-2025",
    title: bi(
      "2025 American Heart Association Guidelines for CPR and Emergency Cardiovascular Care",
      "إرشادات جمعية القلب الأمريكية لعام 2025 للإنعاش القلبي الرئوي والعناية القلبية الوعائية الطارئة",
    ),
    organization: bi("American Heart Association", "جمعية القلب الأمريكية"),
    year: 2025,
    url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines",
    accessNote: bi(
      "Official public guideline hub; some linked learning products may require access or purchase.",
      "بوابة الإرشادات الرسمية متاحة للعامة؛ وقد تتطلب بعض المنتجات التعليمية المرتبطة صلاحية دخول أو شراء.",
    ),
    licensingNote: bi(
      "AHA content is copyrighted; this site cites the source and does not reproduce algorithms or course questions.",
      "محتوى الجمعية محمي بحقوق النشر؛ يكتفي هذا الموقع بالإحالة إلى المصدر ولا يعيد نشر الخوارزميات أو أسئلة الدورات.",
    ),
  },
  {
    id: "ssc-2026",
    title: bi(
      "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026",
      "حملة النجاة من الإنتان: الإرشادات الدولية لتدبير الإنتان والصدمة الإنتانية 2026",
    ),
    organization: bi(
      "Society of Critical Care Medicine / European Society of Intensive Care Medicine",
      "جمعية طب العناية الحرجة / الجمعية الأوروبية لطب العناية المركزة",
    ),
    year: 2026,
    url: "https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
    accessNote: bi(
      "Official public recommendations hub with links to the full journal guideline.",
      "بوابة توصيات رسمية متاحة للعامة وتتضمن روابط للإرشاد الكامل في المجلات العلمية.",
    ),
    licensingNote: bi(
      "Publisher terms apply; recommendations are summarized in original educational language.",
      "تسري شروط الناشر؛ وقد صيغت الخلاصات التعليمية هنا بلغة أصلية.",
    ),
  },
  {
    id: "who-bec",
    title: bi(
      "WHO-ICRC Basic Emergency Care: Approach to the Acutely Ill and Injured",
      "الرعاية الأساسية للطوارئ من منظمة الصحة العالمية واللجنة الدولية للصليب الأحمر: منهج التعامل مع المرضى والمصابين ذوي الحالات الحادة",
    ),
    organization: bi(
      "World Health Organization / International Committee of the Red Cross / International Federation for Emergency Medicine",
      "منظمة الصحة العالمية / اللجنة الدولية للصليب الأحمر / الاتحاد الدولي لطب الطوارئ",
    ),
    year: 2018,
    url: "https://www.who.int/publications/i/item/basic-emergency-care-approach-to-the-acutely-ill-and-injured",
    accessNote: bi(
      "The official course landing page provides open-access materials and current learning routes.",
      "توفر صفحة الدورة الرسمية مواد مفتوحة الوصول ومسارات التعلم الحالية.",
    ),
    licensingNote: bi(
      "Use and adaptation remain subject to WHO and partner terms; no course items are copied here.",
      "يظل الاستخدام والاقتباس خاضعين لشروط المنظمة وشركائها؛ ولم تُنسخ هنا أي عناصر من الدورة.",
    ),
  },
  {
    id: "who-patient-safety-2021",
    title: bi(
      "Global Patient Safety Action Plan 2021-2030",
      "خطة العمل العالمية لسلامة المرضى 2021-2030",
    ),
    organization: bi("World Health Organization", "منظمة الصحة العالمية"),
    year: 2021,
    url: "https://www.who.int/publications/b/57613",
    accessNote: bi(
      "Official publication page with the full document and language editions.",
      "صفحة نشر رسمية تتضمن الوثيقة الكاملة وإصدارات بلغات متعددة.",
    ),
    licensingNote: bi(
      "WHO lists the work under CC BY-NC-SA 3.0 IGO; attribution and licence conditions apply.",
      "تدرج المنظمة العمل بترخيص CC BY-NC-SA 3.0 IGO؛ ويلزم الالتزام بالإسناد وشروط الترخيص.",
    ),
  },
  {
    id: "who-medication-safety-2024",
    title: bi(
      "Medication Without Harm: Policy Brief",
      "دواء بلا ضرر: موجز سياسات",
    ),
    organization: bi("World Health Organization", "منظمة الصحة العالمية"),
    year: 2024,
    url: "https://www.who.int/publications/i/item/9789240062764/",
    accessNote: bi(
      "Official public publication page with a downloadable policy brief.",
      "صفحة نشر رسمية متاحة للعامة وتتضمن موجز السياسات للتحميل.",
    ),
    licensingNote: bi(
      "WHO publication terms apply; this site uses independent examples rather than reproduced material.",
      "تسري شروط منشورات منظمة الصحة العالمية؛ ويستخدم الموقع أمثلة مستقلة بدلاً من إعادة نشر المحتوى.",
    ),
  },
  {
    id: "cdc-core-practices-2024",
    title: bi(
      "Core Infection Prevention and Control Practices for Safe Healthcare Delivery in All Settings",
      "ممارسات الوقاية من العدوى ومكافحتها الأساسية لتقديم رعاية صحية آمنة في جميع البيئات",
    ),
    organization: bi(
      "US Centers for Disease Control and Prevention",
      "المراكز الأمريكية لمكافحة الأمراض والوقاية منها",
    ),
    year: 2024,
    url: "https://www.cdc.gov/infection-control/hcp/core-practices/index.html",
    accessNote: bi(
      "Official public web guidance; page dated April 12, 2024.",
      "إرشادات رسمية متاحة للعامة؛ الصفحة مؤرخة في 12 أبريل 2024.",
    ),
    licensingNote: bi(
      "Follow CDC reuse and attribution guidance for any downstream reproduction.",
      "يجب اتباع إرشادات مراكز مكافحة الأمراض بشأن إعادة الاستخدام والإسناد عند إعادة النشر.",
    ),
  },
  {
    id: "nice-ng253-2025",
    title: bi(
      "NG253: Suspected Sepsis in People Aged 16 or Over — Recognition, Assessment and Early Management",
      "NG253: الاشتباه في الإنتان لدى من أعمارهم 16 عاماً فأكثر — التعرف والتقييم والتدبير المبكر",
    ),
    organization: bi(
      "National Institute for Health and Care Excellence",
      "المعهد الوطني للصحة وجودة الرعاية",
    ),
    year: 2025,
    url: "https://www.nice.org.uk/guidance/NG253",
    accessNote: bi(
      "Official public guideline published November 19, 2025.",
      "إرشاد رسمي متاح للعامة نُشر في 19 نوفمبر 2025.",
    ),
    licensingNote: bi(
      "NICE copyright and reuse terms apply; local policy and clinical judgement remain required.",
      "تسري حقوق النشر وشروط إعادة الاستخدام الخاصة بـ NICE؛ وتظل سياسة المنشأة والحكم السريري لازمين.",
    ),
  },
  {
    id: "nice-cg50",
    title: bi(
      "CG50: Acutely Ill Adults in Hospital — Recognising and Responding to Deterioration",
      "CG50: البالغون ذوو الحالات الحادة في المستشفى — التعرف على التدهور والاستجابة له",
    ),
    organization: bi(
      "National Institute for Health and Care Excellence",
      "المعهد الوطني للصحة وجودة الرعاية",
    ),
    year: 2007,
    url: "https://www.nice.org.uk/guidance/CG50",
    accessNote: bi(
      "Official public guideline; the source page records its current surveillance status.",
      "إرشاد رسمي متاح للعامة؛ وتوضح صفحة المصدر حالة مراجعته الحالية.",
    ),
    licensingNote: bi(
      "NICE copyright and reuse terms apply; this scenario set paraphrases principles only.",
      "تسري حقوق النشر وشروط إعادة الاستخدام الخاصة بـ NICE؛ وتعيد هذه السيناريوهات صياغة المبادئ فقط.",
    ),
  },
  {
    id: "inacsl-2025",
    title: bi(
      "Healthcare Simulation Standards of Best Practice, Fourth Edition",
      "معايير أفضل الممارسات في المحاكاة الصحية، الإصدار الرابع",
    ),
    organization: bi(
      "International Nursing Association for Clinical Simulation and Learning",
      "الجمعية الدولية للتمريض للمحاكاة والتعلم السريري",
    ),
    year: 2025,
    url: "https://www.inacsl.org/healthcare-simulation-standards-of-best-practice-",
    accessNote: bi(
      "Official standards hub describing the 2025 revisions and links to individual standards.",
      "بوابة المعايير الرسمية التي تصف تحديثات 2025 وتربط بالمعايير التفصيلية.",
    ),
    licensingNote: bi(
      "INACSL standards are copyrighted; the cases are newly authored and do not reproduce standard text.",
      "معايير INACSL محمية بحقوق النشر؛ وقد أُلفت الحالات من الصفر ولا تعيد نشر نص المعايير.",
    ),
  },
  {
    id: "ena-esi-5",
    title: bi(
      "Emergency Severity Index Handbook, Fifth Edition",
      "دليل مؤشر شدة الطوارئ، الإصدار الخامس",
    ),
    organization: bi("Emergency Nurses Association", "جمعية ممرضي الطوارئ"),
    year: 2023,
    url: "https://www.ena.org/education/emergency-nursing-triage-education-program/triage-portfolio",
    accessNote: bi(
      "The official ENA triage page links to the free fifth-edition handbook and current training.",
      "تربط صفحة الفرز الرسمية للجمعية بالدليل المجاني للإصدار الخامس وبالتدريب الحالي.",
    ),
    licensingNote: bi(
      "ENA materials retain copyright; no ESI case, test item or algorithm text is reproduced here.",
      "تظل مواد الجمعية محمية بحقوق النشر؛ ولم تُنسخ هنا أي حالة أو سؤال اختبار أو نص خوارزمية من ESI.",
    ),
  },
  {
    id: "scfhs-scope-2023",
    title: bi(
      "Scope of Nursing and Midwifery Practice in Saudi Arabia",
      "نطاق ممارسة التمريض والقبالة في المملكة العربية السعودية",
    ),
    organization: bi(
      "Saudi Commission for Health Specialties",
      "الهيئة السعودية للتخصصات الصحية",
    ),
    year: 2023,
    url: "https://scfhs.org.sa/sites/default/files/2024-02/The%20Scope%20of%20Nursing%20and%20Midwifery%20Practice%20in%20Saudi%20Arabia%20%20%282%29_0.pdf",
    accessNote: bi(
      "Official publicly accessible PDF defining professional scope, accountability and competency.",
      "ملف PDF رسمي متاح للعامة يحدد نطاق الممارسة والمسؤولية والكفاءة المهنية.",
    ),
    licensingNote: bi(
      "SCFHS retains applicable rights; users must consult the current official version and employer policy.",
      "تحتفظ الهيئة بالحقوق المطبقة؛ وعلى المستخدم الرجوع إلى النسخة الرسمية الحالية وسياسة جهة العمل.",
    ),
  },
  {
    id: "spsc-standards-2026",
    title: bi("Patient Safety Standards", "معايير سلامة المرضى"),
    organization: bi("Saudi Patient Safety Center", "المركز السعودي لسلامة المرضى"),
    year: 2026,
    url: "https://www.spsc.gov.sa/en/Home/PatientSafetyStandardsInfo",
    accessNote: bi(
      "Official public overview of the Saudi patient-safety standards framework.",
      "نظرة عامة رسمية ومتاحة للعامة على إطار معايير سلامة المرضى السعودي.",
    ),
    licensingNote: bi(
      "SPSC terms apply; the scenarios are educational interpretations and not certification material.",
      "تسري شروط المركز؛ والسيناريوهات تفسيرات تعليمية وليست مواد اعتماد.",
    ),
  },
  {
    id: "spsc-resources-2026",
    title: bi(
      "Saudi Patient Safety Resources and National Policies",
      "موارد وسياسات سلامة المرضى الوطنية السعودية",
    ),
    organization: bi("Saudi Patient Safety Center", "المركز السعودي لسلامة المرضى"),
    year: 2026,
    url: "https://www.spsc.gov.sa/en/Home/ResourcesInfo",
    accessNote: bi(
      "Official public index for medication safety, suicide reduction, agitation, handover and incident resources.",
      "فهرس رسمي متاح للعامة لموارد سلامة الدواء وخفض الانتحار والهياج والتسليم والحوادث.",
    ),
    licensingNote: bi(
      "Linked documents retain their own terms; always follow the current local policy version.",
      "تحتفظ الوثائق المرتبطة بشروطها الخاصة؛ ويجب دائماً اتباع النسخة الحالية من السياسة المحلية.",
    ),
  },
  {
    id: "saudi-moh-protocols-2026",
    title: bi(
      "Clinical Guidelines and Treatment Protocols",
      "الأدلة الإرشادية والبروتوكولات العلاجية",
    ),
    organization: bi("Saudi Ministry of Health", "وزارة الصحة السعودية"),
    year: 2026,
    url: "https://www.moh.gov.sa/ministry/mediacenter/publications/pages/protocols.aspx",
    accessNote: bi(
      "Official public index for current national protocols, including adult oxygen therapy and maternal and pediatric sepsis.",
      "فهرس رسمي متاح للعامة للبروتوكولات الوطنية الحالية، ومنها أكسجة البالغين وإنتان الأمهات والأطفال.",
    ),
    licensingNote: bi(
      "Ministry and linked-document terms apply; institutional protocols and authorised orders take precedence.",
      "تسري شروط الوزارة والوثائق المرتبطة؛ وتبقى بروتوكولات المنشأة والأوامر المعتمدة هي المرجع التنفيذي.",
    ),
  },
  {
    id: "cdc-tb-infection-control",
    title: bi(
      "Tuberculosis Infection Control in Health Care Settings",
      "مكافحة عدوى السل في بيئات الرعاية الصحية",
    ),
    organization: bi(
      "US Centers for Disease Control and Prevention",
      "المراكز الأمريكية لمكافحة الأمراض والوقاية منها",
    ),
    year: 2023,
    url: "https://www.cdc.gov/tb-healthcare-settings/hcp/infection-control/index.html",
    accessNote: bi(
      "Publisher page describing prompt detection, airborne precautions, source control, isolation rooms and respiratory-protection programmes; accessed 2026-09-04.",
      "صفحة الناشر التي تصف الاكتشاف السريع واحتياطات الانتقال بالهواء والسيطرة على المصدر وغرف العزل وبرامج حماية التنفس؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "CDC reuse and attribution rules apply; the scenario uses independently written teaching language.",
      "تسري قواعد إعادة الاستخدام والإسناد الخاصة بالمراكز؛ ويستخدم السيناريو صياغة تعليمية مستقلة.",
    ),
  },
  {
    id: "cdc-cdiff-clinical-guidance",
    title: bi(
      "Clinical Guidance for C. difficile Infection Prevention in Acute Care Facilities",
      "الإرشاد السريري للوقاية من عدوى المطثية العسيرة في منشآت الرعاية الحادة",
    ),
    organization: bi(
      "US Centers for Disease Control and Prevention",
      "المراكز الأمريكية لمكافحة الأمراض والوقاية منها",
    ),
    year: 2024,
    url: "https://www.cdc.gov/c-diff/hcp/clinical-guidance/",
    accessNote: bi(
      "Publisher guidance covering rapid isolation, contact precautions, dedicated equipment and environmental cleaning; accessed 2026-09-04.",
      "إرشاد الناشر بشأن العزل السريع واحتياطات التلامس والمعدات المخصصة والتنظيف البيئي؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "CDC reuse and attribution rules apply; local infection-prevention policy remains controlling.",
      "تسري قواعد إعادة الاستخدام والإسناد الخاصة بالمراكز؛ وتبقى سياسة مكافحة العدوى المحلية هي المرجع التنفيذي.",
    ),
  },
  {
    id: "nice-antenatal-bleeding-ng201",
    title: bi(
      "NG201 Antenatal Care — Recommendations on Unexplained Vaginal Bleeding",
      "إرشاد NG201 لرعاية الحمل — توصيات النزف المهبلي غير المفسر",
    ),
    organization: bi(
      "National Institute for Health and Care Excellence",
      "المعهد الوطني للصحة وجودة الرعاية",
    ),
    year: 2021,
    url: "https://www.nice.org.uk/guidance/ng201/chapter/recommendations",
    accessNote: bi(
      "Publisher recommendations include risk assessment and placental localisation when the placental site is unknown; accessed 2026-09-04.",
      "تتضمن توصيات الناشر تقييم الخطر وتحديد موضع المشيمة عندما يكون موقعها غير معروف؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "NICE copyright and reuse terms apply; the item is independently worded and local obstetric policy takes precedence.",
      "تسري حقوق النشر وشروط إعادة الاستخدام الخاصة بـ NICE؛ والسؤال مصاغ بصورة مستقلة وتتقدم عليه سياسة التوليد المحلية.",
    ),
  },
  {
    id: "who-pph-2025",
    title: bi(
      "Consolidated Guidelines for the Prevention, Diagnosis and Treatment of Postpartum Haemorrhage",
      "الإرشادات الموحّدة للوقاية من نزف ما بعد الولادة وتشخيصه وعلاجه",
    ),
    organization: bi("World Health Organization", "منظمة الصحة العالمية"),
    year: 2025,
    url: "https://www.who.int/publications/i/item/9789240115637",
    accessNote: bi(
      "Publisher page for the 2025 consolidated evidence-based recommendations; accessed 2026-09-04.",
      "صفحة الناشر للتوصيات الموحّدة المبنية على الأدلة لعام 2025؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "WHO identifies the publication as CC BY-NC-SA 3.0 IGO for non-commercial use; commercial reuse requires a separate rights review.",
      "تذكر منظمة الصحة العالمية أن المنشور مرخص CC BY-NC-SA 3.0 IGO للاستخدام غير التجاري؛ ويتطلب الاستخدام التجاري مراجعة حقوق منفصلة.",
    ),
  },
  {
    id: "eviq-extravasation-procedure",
    title: bi(
      "Extravasation Management — Clinical Procedure",
      "إدارة التسرب خارج الوعاء — إجراء سريري",
    ),
    organization: bi("eviQ Cancer Treatments Online", "eviQ لعلاجات السرطان عبر الإنترنت"),
    year: 2025,
    url: "https://www.eviq.org.au/clinical-resources/extravasation/4156-extravasation-management-clinical-procedure",
    accessNote: bi(
      "Publisher procedure describing stop, leave the vascular device in place, aspirate without flushing and plan agent-specific actions; accessed 2026-09-04.",
      "إجراء الناشر الذي يصف الإيقاف وترك جهاز الوصول الوعائي في مكانه والشفط دون غسل ثم تخطيط التدابير الخاصة بالمادة؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "Publisher terms apply; the practice item paraphrases limited safety principles and does not reproduce the procedure.",
      "تسري شروط الناشر؛ ويعيد سؤال التدريب صياغة مبادئ سلامة محدودة ولا يعيد نشر الإجراء.",
    ),
  },
  {
    id: "lifeblood-transfusion-reaction",
    title: bi(
      "Management of Suspected Transfusion Reactions",
      "إدارة تفاعلات نقل الدم المشتبه بها",
    ),
    organization: bi("Australian Red Cross Lifeblood", "خدمة الدم التابعة للصليب الأحمر الأسترالي"),
    year: 2025,
    url: "https://www.lifeblood.com.au/health-professionals/clinical-practice/adverse-events/management-of-suspected-reactions",
    accessNote: bi(
      "Publisher guidance updated October 2025: stop the transfusion, assess, maintain access without flushing the existing line, notify and follow local procedure; accessed 2026-09-04.",
      "إرشاد الناشر المحدث في أكتوبر 2025: أوقف نقل الدم وقيّم الحالة وحافظ على الوصول دون غسل الخط الحالي وأبلغ واتبع الإجراء المحلي؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "Publisher terms apply; the item is independently written and local transfusion policy is controlling.",
      "تسري شروط الناشر؛ والسؤال مؤلف بصورة مستقلة وتبقى سياسة نقل الدم المحلية هي المرجع التنفيذي.",
    ),
  },
  {
    id: "nice-neutropenic-sepsis-cg151",
    title: bi(
      "CG151 Neutropenic Sepsis — Prevention and Management in People with Cancer",
      "إرشاد CG151 لإنتان نقص العدلات — الوقاية والتدبير لدى مرضى السرطان",
    ),
    organization: bi(
      "National Institute for Health and Care Excellence",
      "المعهد الوطني للصحة وجودة الرعاية",
    ),
    year: 2012,
    url: "https://www.nice.org.uk/guidance/cg151",
    accessNote: bi(
      "Publisher guidance covering urgent referral and management of suspected neutropenic sepsis in people receiving cancer treatment; accessed 2026-09-04.",
      "إرشاد الناشر بشأن الإحالة والتدبير العاجلين عند الاشتباه بإنتان نقص العدلات لدى من يتلقون علاج السرطان؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "NICE copyright and reuse terms apply; the scenario is independently authored and uses the current local threshold and pathway.",
      "تسري حقوق النشر وشروط إعادة الاستخدام الخاصة بـ NICE؛ والسيناريو مؤلف بصورة مستقلة ويستخدم العتبة والمسار المحليين الحاليين.",
    ),
  },
  {
    id: "ada-hypoglycemia-2026",
    title: bi(
      "Glycemic Goals, Hypoglycemia, and Hyperglycemic Crises: Standards of Care in Diabetes—2026",
      "الأهداف السكرية وانخفاض سكر الدم وأزمات فرط السكر: معايير الرعاية في السكري 2026",
    ),
    organization: bi("American Diabetes Association", "الجمعية الأمريكية للسكري"),
    year: 2026,
    url: "https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic",
    accessNote: bi(
      "Publisher article describing the alert threshold, fast-acting oral glucose for an alert person and reassessment after 15 minutes; accessed 2026-09-04.",
      "مقال الناشر الذي يصف عتبة التنبيه والغلوكوز الفموي سريع المفعول للشخص الواعي وإعادة التقييم بعد 15 دقيقة؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "Publisher copyright applies; the practice item is independently written and defers to the authorised local protocol.",
      "تسري حقوق نشر الناشر؛ والسؤال مؤلف بصورة مستقلة ويُحيل إلى البروتوكول المحلي المعتمد.",
    ),
  },
  {
    id: "rcuk-abcde-2024",
    title: bi("The ABCDE Approach", "منهج ABCDE للتقييم والاستجابة"),
    organization: bi("Resuscitation Council UK", "مجلس الإنعاش البريطاني"),
    year: 2024,
    url: "https://www.resus.org.uk/library/abcde-approach",
    accessNote: bi(
      "Official guidance updated July 2024 on structured assessment, treating life threats first, reassessment and early help; accessed 2026-09-04.",
      "إرشاد رسمي محدث في يوليو 2024 حول التقييم المنظم وعلاج مهددات الحياة أولاً وإعادة التقييم وطلب المساعدة مبكراً؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "Resuscitation Council UK copyright applies; the practice items use independently written clinical situations and do not reproduce its algorithms.",
      "تسري حقوق نشر مجلس الإنعاش البريطاني؛ وتستخدم أسئلة التدريب مواقف سريرية مؤلفة بصورة مستقلة ولا تعيد نشر خوارزمياته.",
    ),
  },
  {
    id: "dailymed-potassium-chloride-2026",
    title: bi("Potassium Chloride Injection, Solution, Concentrate — Official Drug Label", "نشرة دواء كلوريد البوتاسيوم المركز للحقن"),
    organization: bi("US National Library of Medicine — DailyMed", "المكتبة الوطنية الأمريكية للطب — DailyMed"),
    year: 2026,
    url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=559a0a8c-a8fe-40a5-b196-21f9308780ab",
    accessNote: bi(
      "Official label updated July 2026 states that the concentrate must be diluted and is for intravenous infusion only; accessed 2026-09-04.",
      "تنص النشرة الرسمية المحدثة في يوليو 2026 على وجوب تخفيف المستحضر المركز وأنه للتسريب الوريدي فقط؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "The label is cited for a narrow safety fact; the question and explanation are independently authored and local medication policy controls practice.",
      "أُحيل إلى النشرة لحقيقة سلامة محدودة؛ والسؤال والشرح مؤلفان بصورة مستقلة وتبقى سياسة الأدوية المحلية هي المرجع التنفيذي.",
    ),
  },
  {
    id: "rch-croup-2024",
    title: bi("Clinical Practice Guideline: Croup", "إرشاد الممارسة السريرية للخُنّاق"),
    organization: bi("The Royal Children's Hospital Melbourne", "مستشفى الأطفال الملكي في ملبورن"),
    year: 2024,
    url: "https://www.rch.org.au/clinicalguide/guideline_index/croup_laryngotracheobronchitis/",
    accessNote: bi(
      "Official clinical guideline updated September 2024; severe croup needs minimal distress, senior help, nebulised adrenaline and airway readiness; accessed 2026-09-04.",
      "إرشاد سريري رسمي محدث في سبتمبر 2024؛ يتطلب الخُنّاق الشديد تقليل إزعاج الطفل وطلب المساعدة العليا والأدرينالين المرذذ والاستعداد لمجرى الهواء؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "Publisher terms apply; no dose table, flowchart or source wording is reproduced in the independently authored item.",
      "تسري شروط الناشر؛ ولا يعاد نشر جدول جرعات أو مخطط أو نص المصدر في السؤال المؤلف بصورة مستقلة.",
    ),
  },
  {
    id: "nice-bronchiolitis-ng9",
    title: bi("NG9 Bronchiolitis in Children: Diagnosis and Management", "إرشاد NG9 لتشخيص التهاب القصيبات لدى الأطفال وتدبيره"),
    organization: bi("National Institute for Health and Care Excellence", "المعهد الوطني للصحة وجودة الرعاية"),
    year: 2021,
    url: "https://www.nice.org.uk/guidance/ng9/chapter/Recommendations",
    accessNote: bi(
      "Official recommendations last updated August 2021, with later link maintenance, including oxygen and escalation thresholds; accessed 2026-09-04.",
      "توصيات رسمية كان آخر تحديث أدلتها في أغسطس 2021 مع صيانة روابط لاحقة، وتشمل عتبات الأكسجين والتصعيد؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "NICE copyright and reuse terms apply; the item is independently written and local paediatric policy takes precedence.",
      "تسري حقوق النشر وشروط إعادة الاستخدام الخاصة بـ NICE؛ والسؤال مؤلف بصورة مستقلة وتتقدم عليه سياسة الأطفال المحلية.",
    ),
  },
  {
    id: "joint-commission-suicide-risk-2026",
    title: bi("Suicide Risk Reduction Resource Center", "مركز موارد خفض خطر الانتحار"),
    organization: bi("The Joint Commission", "اللجنة المشتركة"),
    year: 2026,
    url: "https://www.jointcommission.org/en-us/knowledge-library/suicide-prevention",
    accessNote: bi(
      "Official resource describing direct risk assessment, environmental mitigation, monitoring and written procedures for people at high risk; accessed 2026-09-04.",
      "مورد رسمي يصف تقييم الخطر المباشر وتقليل مخاطر البيئة والمراقبة والإجراءات المكتوبة للأشخاص ذوي الخطر المرتفع؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "Joint Commission copyright and trademark terms apply; this site cites the page and does not claim accreditation or reproduce standards products.",
      "تسري حقوق النشر والعلامات للجنة المشتركة؛ ويكتفي الموقع بالإحالة ولا يدعي اعتماداً ولا يعيد نشر منتجات المعايير.",
    ),
  },
  {
    id: "rcuk-anaphylaxis-2021",
    title: bi("Emergency Treatment of Anaphylaxis: Guidelines for Healthcare Providers", "العلاج الطارئ للتأق: إرشادات لمقدمي الرعاية الصحية"),
    organization: bi("Resuscitation Council UK", "مجلس الإنعاش البريطاني"),
    year: 2021,
    url: "https://www.resus.org.uk/library/additional-guidance/guidance-anaphylaxis/emergency-treatment-anaphylactic-reactions",
    accessNote: bi(
      "Official healthcare-provider guideline for recognition and emergency treatment of anaphylaxis; accessed 2026-09-04.",
      "إرشاد رسمي لمقدمي الرعاية حول التعرف على التأق وعلاجه الطارئ؛ تم الوصول في 2026-09-04.",
    ),
    licensingNote: bi(
      "Resuscitation Council UK copyright applies; the item is independently authored and does not reproduce the source algorithm or course content.",
      "تسري حقوق نشر مجلس الإنعاش البريطاني؛ والسؤال مؤلف بصورة مستقلة ولا يعيد نشر خوارزمية المصدر أو محتوى دوراته.",
    ),
  },
];

const authoredScenarios = [
  {
    id: "ed-older-adult-dyspnea",
    title: bi("Breathless at Triage", "ضيق التنفس عند الفرز"),
    summary: bi(
      "An older adult with worsening shortness of breath requires rapid assessment, prioritisation, reassessment and a safe transfer of care.",
      "يحتاج بالغ أكبر سناً يعاني ضيق تنفس متفاقماً إلى تقييم سريع وتحديد الأولويات وإعادة التقييم وتسليم آمن للرعاية.",
    ),
    departmentId: "emergency",
    department: bi("Emergency Department", "قسم الطوارئ"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 12,
    duration: bi("12 minutes", "12 دقيقة"),
    competencies: [
      competency("rapid-assessment", "Rapid assessment", "التقييم السريع"),
      competency("prioritization", "Clinical prioritisation", "تحديد الأولويات السريرية"),
      competency("reassessment", "Trend-based reassessment", "إعادة التقييم اعتماداً على الاتجاهات"),
      competency("escalation", "Timely escalation", "التصعيد في الوقت المناسب"),
      competency("team-communication", "Team communication", "التواصل مع الفريق"),
      competency("handover", "Structured handover", "التسليم المنظم"),
    ],
    referenceIds: [
      "who-bec",
      "ena-esi-5",
      "nice-cg50",
      "aha-2025",
      "scfhs-scope-2023",
      "saudi-moh-protocols-2026",
    ],
    steps: [
      {
        id: "ed-dyspnea-arrival",
        time: "00:00",
        narrative: bi(
          "A 72-year-old arrives with two hours of worsening shortness of breath. The structured priority check covers airway, breathing, circulation, disability and exposure (ABCDE).",
          "يصل مريض يبلغ 72 عاماً بعد ساعتين من تفاقم ضيق التنفس. يشمل فحص الأولوية المنهجي مجرى الهواء والتنفس والدورة الدموية والحالة العصبية والتعرّض (ABCDE).",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 106, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 24, "/min", "/دقيقة"),
          vital("SpO2", "تشبع الأكسجين", 91, "% on room air", "% على هواء الغرفة"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi(
          "What is the best first nursing response?",
          "ما أفضل استجابة تمريضية أولى؟",
        ),
        choices: [
          choice(
            "ed-dyspnea-arrival-a",
            bi(
              "Start the structured ABCDE assessment, monitoring and immediate triage escalation.",
              "ابدأ تقييم ABCDE المنهجي والمراقبة والتصعيد الفوري لمسؤول الفرز.",
            ),
            100,
            "safe",
            bi("Correct: immediate physiology and risk come first.", "صحيح: تأتي الحالة الفسيولوجية والخطر الفوري أولاً."),
            bi(
              "A systematic initial assessment detects threats early while escalation and monitoring continue in parallel.",
              "يكشف التقييم الأولي المنهجي الأخطار مبكراً مع استمرار التصعيد والمراقبة بالتوازي.",
            ),
            "rapid-assessment",
          ),
          choice(
            "ed-dyspnea-arrival-b",
            bi(
              "Complete registration and the full administrative history before starting observations.",
              "أكمل أولاً إجراءات التسجيل والتاريخ الإداري الكامل قبل بدء الملاحظات السريرية.",
            ),
            0,
            "unsafe",
            bi("Unsafe: administrative tasks must not delay assessment of breathing difficulty.", "غير آمن: يجب ألا تؤخر الإجراءات الإدارية تقييم صعوبة التنفس."),
            bi(
              "Short-phrase speech and visible work of breathing can signal time-critical deterioration.",
              "قد يشير الكلام بعبارات قصيرة والجهد التنفسي الظاهر إلى تدهور حساس للوقت.",
            ),
            "rapid-assessment",
          ),
          choice(
            "ed-dyspnea-arrival-c",
            bi(
              "Take a complete chronic-disease history before deciding whether monitoring is needed.",
              "خذ تاريخاً كاملاً للأمراض المزمنة قبل تحديد الحاجة إلى المراقبة.",
            ),
            35,
            "delay",
            bi("History matters, but this sequence delays immediate assessment.", "التاريخ مهم، لكن هذا التسلسل يؤخر التقييم الفوري."),
            bi(
              "Focused history should occur alongside, not ahead of, assessment and stabilisation of immediate threats.",
              "ينبغي أخذ التاريخ المركز بالتوازي مع تقييم الأخطار الفورية وتثبيت الحالة، لا قبلهما.",
            ),
            "rapid-assessment",
          ),
        ],
      },
      {
        id: "ed-dyspnea-priority",
        time: "02:00",
        narrative: bi(
          "The patient reports mild chest tightness, no fever, hypertension and COPD treated with inhaled medicines. A full set of observations is now available.",
          "يذكر المريض وجود ضيق خفيف في الصدر من دون حمى، ولديه ارتفاع ضغط ومرض انسداد رئوي مزمن يُعالج بأدوية مستنشقة. أصبحت مجموعة العلامات الحيوية كاملة الآن.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 112, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 26, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "148/88", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 89, "% on room air", "% على هواء الغرفة"),
        ],
        question: bi(
          "What is the priority action now?",
          "ما الإجراء ذو الأولوية الآن؟",
        ),
        choices: [
          choice(
            "ed-dyspnea-priority-a",
            bi(
              "Support oxygenation to the local COPD target, position for comfort and request urgent review.",
              "ادعم الأكسجة وفق الهدف المحلي لمرض الانسداد الرئوي، وضع المريض براحة واطلب مراجعة عاجلة.",
            ),
            100,
            "safe",
            bi("Correct: address the immediate breathing and oxygenation problem while escalating.", "صحيح: عالج مشكلة التنفس والأكسجة الفورية مع التصعيد."),
            bi(
              "Hypoxaemia with increased work of breathing requires protocol-guided support and close response monitoring; the exact device and target remain local clinical decisions.",
              "يتطلب نقص الأكسجة المصحوب بزيادة الجهد التنفسي دعماً موجهاً بالبروتوكول ومراقبة لصيقة للاستجابة؛ ويظل الجهاز والهدف الدقيقان قرارين سريريين محليين.",
            ),
            "prioritization",
          ),
          choice(
            "ed-dyspnea-priority-b",
            bi(
              "Obtain a 12-lead ECG before providing any oxygenation support or reassessing breathing.",
              "أجرِ تخطيط قلب بـ12 اشتقاقاً قبل تقديم أي دعم للأكسجة أو إعادة تقييم التنفس.",
            ),
            45,
            "delay",
            bi("An ECG is important for chest symptoms, but it should not precede immediate breathing support.", "تخطيط القلب مهم لأعراض الصدر، لكنه لا ينبغي أن يسبق دعم التنفس الفوري."),
            bi(
              "Diagnostic work can proceed in parallel after immediate threats are addressed.",
              "يمكن أن تسير الفحوص التشخيصية بالتوازي بعد معالجة الأخطار الفورية.",
            ),
            "prioritization",
          ),
          choice(
            "ed-dyspnea-priority-c",
            bi(
              "Insert vascular access and prepare routine laboratory samples before acting on the oxygen saturation.",
              "أنشئ منفذاً وعائياً وجهّز عينات المختبر الروتينية قبل الاستجابة لقراءة تشبع الأكسجين.",
            ),
            30,
            "delay",
            bi("This delays treatment of the most immediate problem.", "يؤخر هذا معالجة المشكلة الأكثر إلحاحاً."),
            bi(
              "Access and investigations may be needed, but they do not replace prompt airway and breathing priorities.",
              "قد يلزم المنفذ والفحوص، لكنهما لا يحلان محل أولويات مجرى الهواء والتنفس العاجلة.",
            ),
            "prioritization",
          ),
        ],
      },
      {
        id: "ed-dyspnea-reassess",
        time: "05:00",
        narrative: bi(
          "After initial support, chest tightness remains. The team uses Situation, Background, Assessment and Recommendation (SBAR) for structured handover.",
          "بعد الدعم الأولي، بقي انقباض الصدر. يستخدم الفريق نموذج الحالة والخلفية والتقييم والتوصية (SBAR) للتسليم المنظم.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 108, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 23, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "142/84", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 92, "% with support", "% مع الدعم"),
        ],
        question: bi(
          "Which action best continues safe care?",
          "أي إجراء يواصل الرعاية الآمنة على أفضل وجه؟",
        ),
        choices: [
          choice(
            "ed-dyspnea-reassess-a",
            bi(
              "Reassess ABCDE and symptoms, obtain the ECG while monitoring, then use an SBAR handover.",
              "أعد تقييم ABCDE والأعراض، وأجرِ تخطيط القلب مع استمرار المراقبة، ثم استخدم تسليم SBAR.",
            ),
            100,
            "safe",
            bi("Correct: reassessment and parallel diagnostics make the response visible.", "صحيح: تجعل إعادة التقييم والفحوص المتوازية الاستجابة واضحة."),
            bi(
              "One improved number does not close the assessment; persistent chest symptoms still require timely investigation and escalation.",
              "لا تكفي قراءة واحدة متحسنة لإنهاء التقييم؛ فاستمرار أعراض الصدر يتطلب فحصاً وتصعيداً في الوقت المناسب.",
            ),
            "reassessment",
          ),
          choice(
            "ed-dyspnea-reassess-b",
            bi(
              "Reduce observation frequency because the saturation has improved once.",
              "قلّل تكرار المراقبة لأن التشبع تحسن في قراءة واحدة.",
            ),
            20,
            "gap",
            bi("A single improvement does not establish stability.", "لا يثبت التحسن في قراءة واحدة استقرار الحالة."),
            bi(
              "Trend, work of breathing, mental state and persistent symptoms must all inform monitoring intensity.",
              "يجب أن يحدد اتجاه القراءات والجهد التنفسي والحالة الذهنية واستمرار الأعراض شدة المراقبة.",
            ),
            "reassessment",
          ),
          choice(
            "ed-dyspnea-reassess-c",
            bi(
              "Ask the patient to walk in the corridor to test exercise tolerance before clinician review.",
              "اطلب من المريض المشي في الممر لاختبار تحمل الجهد قبل المراجعة السريرية.",
            ),
            0,
            "unsafe",
            bi("Unsafe: exertion can worsen an incompletely assessed acute presentation.", "غير آمن: قد يزيد الجهد حالة حادة لم يكتمل تقييمها سوءاً."),
            bi(
              "The patient still has active chest and respiratory symptoms and requires monitored evaluation.",
              "ما تزال لدى المريض أعراض صدرية وتنفسية نشطة ويحتاج إلى تقييم تحت المراقبة.",
            ),
            "reassessment",
          ),
        ],
      },
      {
        id: "ed-dyspnea-deterioration",
        time: "07:00",
        narrative: bi(
          "The patient suddenly becomes drowsy. Breathing is shallow and the monitor alarms repeatedly despite the initial support.",
          "يصبح المريض فجأة نعساً، ويغدو تنفسه سطحياً، ويكرر جهاز المراقبة الإنذار رغم الدعم الأولي.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 118, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 10, "/min, shallow", "/دقيقة، سطحي"),
          vital("Blood pressure", "ضغط الدم", "96/62", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 84, "% with support", "% مع الدعم"),
        ],
        question: bi(
          "What is the safest immediate response?",
          "ما الاستجابة الفورية الأكثر أماناً؟",
        ),
        choices: [
          choice(
            "ed-dyspnea-deterioration-a",
            bi(
              "Activate the emergency response and begin airway support within your authorised scope.",
              "فعّل الاستجابة الطارئة وابدأ دعم مجرى الهواء ضمن نطاقك المعتمد.",
            ),
            100,
            "safe",
            bi("Correct: this is a time-critical airway and breathing deterioration.", "صحيح: هذا تدهور حرج زمنياً في مجرى الهواء والتنفس."),
            bi(
              "Reduced consciousness, shallow breathing and falling saturation require immediate team activation and supported care within scope.",
              "يتطلب انخفاض الوعي والتنفس السطحي وهبوط التشبع تفعيل الفريق فوراً وتقديم الدعم ضمن نطاق الممارسة.",
            ),
            "escalation",
          ),
          choice(
            "ed-dyspnea-deterioration-b",
            bi(
              "Wait five minutes for another complete set of observations to confirm the trend.",
              "انتظر خمس دقائق لمجموعة علامات حيوية كاملة أخرى لتأكيد الاتجاه.",
            ),
            0,
            "unsafe",
            bi("Unsafe: the current findings already show critical deterioration.", "غير آمن: النتائج الحالية تُظهر تدهوراً حرجاً بالفعل."),
            bi(
              "Delaying escalation risks respiratory arrest and removes time for coordinated response.",
              "يعرّض تأخير التصعيد المريض لتوقف التنفس ويهدر وقت الاستجابة المنسقة.",
            ),
            "escalation",
          ),
          choice(
            "ed-dyspnea-deterioration-c",
            bi(
              "Call the family first to clarify the complete medical history.",
              "اتصل بالعائلة أولاً لتوضيح التاريخ الطبي الكامل.",
            ),
            15,
            "delay",
            bi("Collateral history can help later, but it must not delay emergency action.", "قد يفيد التاريخ من الأسرة لاحقاً، لكنه يجب ألا يؤخر الإجراء الطارئ."),
            bi(
              "Immediate physiologic support and escalation take precedence over nonessential history at this moment.",
              "يسبق الدعم الفسيولوجي الفوري والتصعيد جمع التاريخ غير الضروري في هذه اللحظة.",
            ),
            "escalation",
          ),
        ],
      },
      {
        id: "ed-dyspnea-team-response",
        time: "09:00",
        narrative: bi(
          "The emergency team is present and airway support is improving ventilation. Several clinicians are assigning tasks at the bedside.",
          "حضر فريق الطوارئ وبدأ دعم مجرى الهواء يحسن التهوية. يوزع عدة ممارسين مهام عند السرير.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 110, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 18, "/min, supported", "/دقيقة، مدعوم"),
          vital("Blood pressure", "ضغط الدم", "104/68", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 93, "% with support", "% مع الدعم"),
        ],
        question: bi(
          "How should the nurse contribute most safely during the team response?",
          "كيف يساهم الممرض بأكبر قدر من الأمان أثناء استجابة الفريق؟",
        ),
        choices: [
          choice(
            "ed-dyspnea-team-response-a",
            bi(
              "Use closed-loop communication and report each timed response aloud.",
              "استخدم التواصل مغلق الحلقة وأعلن كل استجابة مرتبطة بالوقت بوضوح.",
            ),
            100,
            "safe",
            bi("Correct: closed-loop communication reduces omission and duplication.", "صحيح: يقلل التواصل مغلق الحلقة الإغفال وتكرار المهام."),
            bi(
              "Shared situational awareness helps a rapidly changing team coordinate safely.",
              "يساعد الوعي المشترك بالموقف الفريق سريع التغير على التنسيق بأمان.",
            ),
            "team-communication",
          ),
          choice(
            "ed-dyspnea-team-response-b",
            bi(
              "Independently change the respiratory device settings beyond the agreed plan to speed recovery.",
              "غيّر إعدادات جهاز الدعم التنفسي بشكل مستقل خارج الخطة المتفق عليها لتسريع التحسن.",
            ),
            0,
            "unsafe",
            bi("Unsafe: uncoordinated changes outside scope can cause harm.", "غير آمن: قد تسبب التغييرات غير المنسقة وخارج النطاق ضرراً."),
            bi(
              "Device changes require authorised decisions, shared awareness and monitoring of effect.",
              "تتطلب تغييرات الجهاز قرارات معتمدة ووعياً مشتركاً ومراقبة للأثر.",
            ),
            "team-communication",
          ),
          choice(
            "ed-dyspnea-team-response-c",
            bi(
              "Remain silent after completing tasks so the team is not distracted.",
              "ابقَ صامتاً بعد تنفيذ المهام حتى لا يتشتت الفريق.",
            ),
            45,
            "gap",
            bi("Task completion without confirmation leaves the team uncertain.", "إنجاز المهمة دون تأكيد يترك الفريق غير متأكد."),
            bi(
              "Concise read-back and response reporting are safety behaviours, not distractions.",
              "إعادة القراءة المختصرة والإبلاغ عن الاستجابة سلوكان للسلامة وليسا تشتيتاً.",
            ),
            "team-communication",
          ),
        ],
      },
      {
        id: "ed-dyspnea-handover",
        time: "12:00",
        narrative: bi(
          "The patient is transferring to a higher-acuity area for continued investigation and respiratory support.",
          "سيُنقل المريض إلى منطقة أعلى حدة لاستكمال الفحوص ودعم التنفس.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 104, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 19, "/min, supported", "/دقيقة، مدعوم"),
          vital("Blood pressure", "ضغط الدم", "112/70", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 93, "% at prescribed target", "% ضمن الهدف الموصوف"),
        ],
        question: bi(
          "Which handover best protects continuity of care?",
          "أي تسليم يحمي استمرارية الرعاية على أفضل وجه؟",
        ),
        choices: [
          choice(
            "ed-dyspnea-handover-a",
            bi(
              "Give a structured handover of baseline, trends, interventions, response and remaining risks.",
              "قدّم تسليماً منظماً يشمل خط الأساس والاتجاهات والتدخلات والاستجابة والمخاطر المتبقية.",
            ),
            100,
            "safe",
            bi("Correct: the receiving team gets both current state and trajectory.", "صحيح: يتلقى الفريق المستلم الحالة الحالية ومسارها معاً."),
            bi(
              "A time-linked, structured handover preserves clinical reasoning and unresolved concerns during transfer.",
              "يحفظ التسليم المنظم والمرتبط بالوقت الاستدلال السريري والمخاوف غير المحسومة أثناء النقل.",
            ),
            "handover",
          ),
          choice(
            "ed-dyspnea-handover-b",
            bi(
              "Send only the latest monitor values because earlier changes are no longer relevant.",
              "أرسل أحدث قيم جهاز المراقبة فقط لأن التغيرات السابقة لم تعد مهمة.",
            ),
            25,
            "gap",
            bi("The latest values alone hide the severity and response trajectory.", "القيم الأخيرة وحدها تخفي شدة الحالة ومسار الاستجابة."),
            bi(
              "Trend and treatment response inform future risk and monitoring needs.",
              "يساعد اتجاه القراءات والاستجابة للتدخل في تحديد الخطر اللاحق واحتياجات المراقبة.",
            ),
            "handover",
          ),
          choice(
            "ed-dyspnea-handover-c",
            bi(
              "Delay transfer until every diagnostic result is final.",
              "أخّر النقل حتى تصدر جميع النتائج التشخيصية نهائياً.",
            ),
            20,
            "delay",
            bi("Awaiting nonessential results can delay the level of care the patient needs.", "قد يؤخر انتظار النتائج غير الضرورية مستوى الرعاية الذي يحتاجه المريض."),
            bi(
              "Outstanding results can be clearly handed over and actively followed in the receiving area.",
              "يمكن تسليم النتائج المعلقة بوضوح ومتابعتها بفاعلية في المنطقة المستلمة.",
            ),
            "handover",
          ),
        ],
      },
    ],
  },
  {
    id: "mental-health-crisis-safety",
    title: bi("Calm Does Not Mean Low Risk", "الهدوء لا يعني انخفاض الخطر"),
    summary: bi(
      "A person in emotional crisis moves between withdrawal and agitation while the nurse maintains safety, dignity and a clear escalation path.",
      "يتنقل شخص في أزمة نفسية بين الانسحاب والهياج بينما يحافظ الممرض على السلامة والكرامة ومسار تصعيد واضح.",
    ),
    departmentId: "mental-health",
    department: bi("Mental Health", "الصحة النفسية"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 9,
    duration: bi("9 minutes", "9 دقائق"),
    competencies: [
      competency("suicide-risk-screening", "Suicide risk screening", "تقصي خطر الانتحار"),
      competency("de-escalation", "Trauma-informed de-escalation", "خفض التصعيد المراعي للصدمات"),
      competency("mental-health-handover", "Safety planning and handover", "تخطيط السلامة والتسليم"),
    ],
    referenceIds: [
      "who-patient-safety-2021",
      "spsc-resources-2026",
      "spsc-standards-2026",
      "scfhs-scope-2023",
    ],
    steps: [
      {
        id: "mental-health-screen",
        time: "00:00",
        narrative: bi(
          "A 28-year-old presents voluntarily after a relationship crisis and quietly says, “Sometimes I wish I would not wake up.” The person is calm and avoids eye contact.",
          "يحضر شخص يبلغ 28 عاماً طوعاً بعد أزمة عاطفية ويقول بهدوء: «أحياناً أتمنى ألا أستيقظ». يبدو هادئاً ويتجنب التواصل البصري.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 88, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 18, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "124/76", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi(
          "What is the most therapeutic and safe first response?",
          "ما الاستجابة الأولى الأكثر علاجية وأماناً؟",
        ),
        choices: [
          choice(
            "mental-health-screen-a",
            bi(
              "Move with the person to a private, clinically observable safe setting, maintain supervision, and begin a direct suicide-risk assessment while arranging trained help under the local pathway.",
              "انتقل مع الشخص إلى مكان خاص وآمن يتيح المراقبة السريرية، وحافظ على الإشراف، وابدأ تقييماً مباشراً لخطر الانتحار مع ترتيب مساعدة الفريق المدرّب وفق المسار المحلي.",
            ),
            100,
            "safe",
            bi("Correct: privacy must be combined with continued observation, direct assessment and immediate access to help.", "صحيح: يجب الجمع بين الخصوصية واستمرار المراقبة والتقييم المباشر وإمكانية الحصول على المساعدة فوراً."),
            bi(
              "A wish not to wake up requires timely direct suicide-risk assessment. A private setting protects dignity but must not leave the person isolated while risk remains undetermined.",
              "يتطلب التصريح بعدم الرغبة في الاستيقاظ تقييماً مباشراً وفي الوقت المناسب لخطر الانتحار. يحمي المكان الخاص الكرامة، لكنه يجب ألا يؤدي إلى عزل الشخص بينما لم يتحدد مستوى الخطر بعد.",
            ),
            "suicide-risk-screening",
          ),
          choice(
            "mental-health-screen-b",
            bi(
              "Reassure the person that everyone feels this way sometimes and change the subject.",
              "طمئن الشخص بأن الجميع يشعر بذلك أحياناً وغيّر الموضوع.",
            ),
            0,
            "unsafe",
            bi("Unsafe: minimising the disclosure can miss imminent risk and shut down communication.", "غير آمن: قد يؤدي التقليل من الإفصاح إلى تفويت خطر وشيك وإغلاق باب التواصل."),
            bi(
              "Validation and direct assessment are required before the level of risk can be understood.",
              "يلزم التحقق من الشعور والتقييم المباشر قبل فهم مستوى الخطر.",
            ),
            "suicide-risk-screening",
          ),
          choice(
            "mental-health-screen-c",
            bi(
              "Ask relatives in the waiting area to describe the crisis while the person remains within hearing distance of others.",
              "اطلب من الأقارب في منطقة الانتظار وصف الأزمة بينما يبقى الشخص على مسمع من الآخرين.",
            ),
            0,
            "unsafe",
            bi("Unsafe: discussing the crisis within hearing of others breaches privacy and delays direct assessment.", "غير آمن: مناقشة الأزمة على مسمع من الآخرين تنتهك الخصوصية وتؤخر التقييم المباشر."),
            bi(
              "Information should be gathered in a private, respectful way and shared only as safety and consent allow.",
              "ينبغي جمع المعلومات بخصوصية واحترام ومشاركتها بقدر ما تسمح به السلامة والموافقة.",
            ),
            "suicide-risk-screening",
          ),
        ],
      },
      {
        id: "mental-health-deescalate",
        time: "04:00",
        narrative: bi(
          "After a distressing phone notification, the person begins pacing, raises their voice and says staff are not listening. The exit remains clear.",
          "بعد إشعار هاتفي مزعج يبدأ الشخص بالمشي ذهاباً وإياباً ويرفع صوته ويقول إن الطاقم لا يستمع. ما يزال المخرج خالياً.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 104, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 24, "/min", "/دقيقة"),
          vital("SpO2", "تشبع الأكسجين", 98, "%", "%"),
          vital("Behaviour", "السلوك", "Pacing", "observed", "مُلاحظ"),
        ],
        question: bi(
          "Which action best supports de-escalation?",
          "أي إجراء يدعم خفض التصعيد على أفضل وجه؟",
        ),
        choices: [
          choice(
            "mental-health-deescalate-a",
            bi(
              "Use one calm speaker, reduce stimulation and offer space and simple choices.",
              "استخدم متحدثاً واحداً هادئاً، وقلل المثيرات، وامنح مساحة وخيارات بسيطة.",
            ),
            100,
            "safe",
            bi("Correct: the approach lowers threat while preserving safety and dignity.", "صحيح: يخفض هذا النهج الإحساس بالتهديد مع حفظ السلامة والكرامة."),
            bi(
              "Trauma-informed verbal de-escalation and the least restrictive safe response should be attempted when feasible.",
              "ينبغي تجربة خفض التصعيد اللفظي المراعي للصدمات وأقل استجابة آمنة تقييداً متى كان ذلك ممكناً.",
            ),
            "de-escalation",
          ),
          choice(
            "mental-health-deescalate-b",
            bi(
              "Stand very close, block the exit and demand immediate compliance.",
              "قف قريباً جداً، وأغلق المخرج، واطلب الامتثال الفوري بصرامة.",
            ),
            0,
            "unsafe",
            bi("Unsafe: crowding and blocking can increase perceived threat and escalation.", "غير آمن: قد تزيد الملاصقة وإغلاق المخرج الإحساس بالتهديد والتصعيد."),
            bi(
              "Staff should maintain safe positioning, access to assistance and non-confrontational communication.",
              "ينبغي للطاقم الحفاظ على تموضع آمن وإمكانية طلب المساعدة وتواصل غير تصادمي.",
            ),
            "de-escalation",
          ),
          choice(
            "mental-health-deescalate-c",
            bi(
              "Have several staff members speak at once so the person understands the seriousness.",
              "اطلب من عدة أفراد من الطاقم التحدث في الوقت نفسه ليفهم الشخص جدية الموقف.",
            ),
            20,
            "gap",
            bi("Multiple voices can increase stimulation and confusion.", "قد تزيد الأصوات المتعددة المثيرات والارتباك."),
            bi(
              "A single designated communicator makes boundaries and choices easier to process.",
              "يجعل المتحدث الواحد المحدد الحدود والخيارات أسهل للفهم.",
            ),
            "de-escalation",
          ),
        ],
      },
      {
        id: "mental-health-handover",
        time: "08:00",
        narrative: bi(
          "Once calmer, the person discloses a specific suicide plan and access to the means at home. A specialist mental-health assessment is being arranged.",
          "بعد أن هدأ الشخص أفصح عن خطة انتحار محددة وإمكانية الوصول إلى الوسيلة في المنزل. يجري ترتيب تقييم متخصص للصحة النفسية.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 92, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 18, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "126/78", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi(
          "What is the safest disposition-related action?",
          "ما الإجراء الأكثر أماناً المتعلق بمسار الرعاية؟",
        ),
        choices: [
          choice(
            "mental-health-handover-a",
            bi(
              "Maintain safe observation, escalate urgently and give an active handover with confirmed receipt.",
              "حافظ على المراقبة الآمنة، وصعّد عاجلاً، وقدّم تسليماً نشطاً مع تأكيد الاستلام.",
            ),
            100,
            "safe",
            bi("Correct: apparent calm does not negate a disclosed plan and access to means.", "صحيح: لا يلغي الهدوء الظاهر وجود خطة معلنة وإمكانية الوصول إلى الوسيلة."),
            bi(
              "Continuous safety measures and closed-loop specialist transfer are needed until responsibility is formally accepted.",
              "تلزم تدابير السلامة المستمرة والنقل مغلق الحلقة إلى المختص حتى قبول المسؤولية رسمياً.",
            ),
            "mental-health-handover",
          ),
          choice(
            "mental-health-handover-b",
            bi(
              "Discharge the person because behaviour is calm and vital signs are normal.",
              "اخرج الشخص لأن سلوكه هادئ وعلاماته الحيوية طبيعية.",
            ),
            0,
            "unsafe",
            bi("Unsafe: normal vital signs do not measure suicide risk.", "غير آمن: لا تقيس العلامات الحيوية الطبيعية خطر الانتحار."),
            bi(
              "The disclosed plan and access to means require urgent specialist evaluation and a safe disposition.",
              "تتطلب الخطة المعلنة والوصول إلى الوسيلة تقييماً متخصصاً عاجلاً ومساراً آمناً للرعاية.",
            ),
            "mental-health-handover",
          ),
          choice(
            "mental-health-handover-c",
            bi(
              "Promise absolute secrecy so the person will keep talking.",
              "عِد بالسرية المطلقة حتى يستمر الشخص في الحديث.",
            ),
            0,
            "unsafe",
            bi("Absolute secrecy cannot be promised when immediate safety is at risk.", "لا يمكن التعهد بسرية مطلقة عندما تكون السلامة الفورية معرضة للخطر."),
            bi(
              "Explain transparently that only necessary information will be shared with people responsible for safety and care.",
              "اشرح بشفافية أن المعلومات الضرورية فقط ستشارك مع المسؤولين عن السلامة والرعاية.",
            ),
            "mental-health-handover",
          ),
        ],
      },
    ],
  },
  {
    id: "infection-control-respiratory-risk",
    title: bi("Protect Before the Diagnosis", "احمِ قبل اكتمال التشخيص"),
    summary: bi(
      "A patient with a possible transmissible respiratory illness requires early source control, risk-based precautions and confidential exposure follow-up.",
      "يحتاج مريض يُشتبه بمرض تنفسي قابل للانتقال إلى سيطرة مبكرة على مصدر العدوى واحتياطات مبنية على الخطر ومتابعة سرية للتعرض.",
    ),
    departmentId: "infection-prevention",
    department: bi("Infection Prevention and Control", "مكافحة العدوى والوقاية منها"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("source-control", "Source control and placement", "السيطرة على مصدر العدوى ووضع المريض في المكان المخصص"),
      competency("standard-precautions", "Standard and transmission-based precautions", "الاحتياطات القياسية والاحتياطات المبنية على الانتقال"),
      competency("exposure-management", "Exposure management", "إدارة التعرض"),
    ],
    referenceIds: [
      "cdc-tb-infection-control",
      "cdc-core-practices-2024",
      "who-patient-safety-2021",
      "spsc-standards-2026",
      "saudi-moh-protocols-2026",
    ],
    steps: [
      {
        id: "ipc-respiratory-source-control",
        time: "00:00",
        narrative: bi(
          "A patient arrives coughing frequently with fever and weight loss, raising concern for infectious pulmonary tuberculosis. The infection prevention and control (IPC) team supports the local airborne-risk pathway.",
          "يصل مريض وهو يسعل كثيراً مع حمى ونقص وزن، ما يثير الاشتباه بسل رئوي معدٍ. يدعم فريق الوقاية من العدوى ومكافحتها (IPC) مسار خطر العدوى المنقولة بالهواء المحلي.",
        ),
        vitals: [
          vital("Temperature", "الحرارة", 38.2, "°C", "°م"),
          vital("Heart rate", "معدل القلب", 102, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 22, "/min", "/دقيقة"),
          vital("SpO2", "تشبع الأكسجين", 94, "% on room air", "% على هواء الغرفة"),
        ],
        question: bi(
          "What is the best immediate infection-prevention action?",
          "ما أفضل إجراء فوري للوقاية من العدوى؟",
        ),
        choices: [
          choice(
            "ipc-respiratory-source-control-a",
            bi(
              "Offer the patient a procedure mask if tolerated, place them in an airborne infection isolation room if available, and notify the clinical and IPC teams.",
              "قدّم للمريض كمامة إجراءات إذا تحملها، وضعه في غرفة عزل للعدوى المنقولة بالهواء إن توفرت، وأبلغ الفريق السريري وفريق IPC.",
            ),
            100,
            "safe",
            bi("Correct: precautions are based on risk and should not wait for a final diagnosis.", "صحيح: تُبنى الاحتياطات على الخطر ولا ينبغي أن تنتظر التشخيص النهائي."),
            bi(
              "Early source control, airborne precautions, appropriate placement and notification reduce avoidable exposure while assessment continues. If an isolation room is unavailable, follow the facility's IPC placement or transfer plan.",
              "تقلل السيطرة المبكرة على مصدر العدوى واحتياطات الانتقال بالهواء والوضع المناسب والإبلاغ من التعرض الممكن تجنبه أثناء استمرار التقييم. وإذا لم تتوفر غرفة عزل فاتبع خطة المنشأة للوضع أو النقل بالتنسيق مع IPC.",
            ),
            "source-control",
          ),
          choice(
            "ipc-respiratory-source-control-b",
            bi(
              "Keep the patient in the shared bay until a laboratory diagnosis is confirmed.",
              "أبقِ المريض في الغرفة المشتركة حتى يؤكد المختبر التشخيص.",
            ),
            0,
            "unsafe",
            bi("Unsafe: waiting can expose patients, visitors and staff.", "غير آمن: قد يعرض الانتظار المرضى والزوار والطاقم للعدوى."),
            bi(
              "Transmission-risk controls should begin from credible suspicion and then be adjusted as evidence changes.",
              "ينبغي بدء ضوابط خطر الانتقال عند وجود اشتباه معتبر ثم تعديلها مع تغير الأدلة.",
            ),
            "source-control",
          ),
          choice(
            "ipc-respiratory-source-control-c",
            bi(
              "Open nearby doors for airflow but leave the patient in the corridor.",
              "افتح الأبواب القريبة للتهوية لكن اترك المريض في الممر.",
            ),
            0,
            "unsafe",
            bi("Unsafe: a corridor exposes others and improvised airflow can spread rather than contain airborne particles.", "غير آمن: يعرّض الممر الآخرين وقد تنشر التهوية المرتجلة الجسيمات المنقولة بالهواء بدلاً من احتوائها."),
            bi(
              "Facilities should use their designated rooms, pathways and IPC risk assessment rather than improvised controls.",
              "ينبغي للمنشآت استخدام غرفها ومساراتها وتقييم مكافحة العدوى المحدد بدلاً من ضوابط مرتجلة.",
            ),
            "source-control",
          ),
        ],
      },
      {
        id: "ipc-respiratory-procedure",
        time: "03:00",
        narrative: bi(
          "Non-urgent sputum induction has been proposed, but the current room is not approved for an aerosol-generating procedure. Personal protective equipment (PPE) must match the task and airborne risk.",
          "اقتُرح تحريض البلغم بصورة غير عاجلة، لكن الغرفة الحالية غير معتمدة لإجراء مولد للرذاذ. يجب أن تتناسب معدات الوقاية الشخصية (PPE) مع المهمة وخطر الانتقال بالهواء.",
        ),
        vitals: [
          vital("Temperature", "الحرارة", 38.1, "°C", "°م"),
          vital("Respiratory rate", "معدل التنفس", 21, "/min", "/دقيقة"),
          vital("SpO2", "تشبع الأكسجين", 95, "% on room air", "% على هواء الغرفة"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi(
          "Which preparation is safest?",
          "أي استعداد هو الأكثر أماناً؟",
        ),
        choices: [
          choice(
            "ipc-respiratory-procedure-a",
            bi(
              "Do not proceed in this room; coordinate an approved airborne setting and trained team, using a fit-tested respirator and all task-specific PPE under the local AGP protocol.",
              "لا تنفذ الإجراء في هذه الغرفة؛ نسّق مكاناً معتمداً للعدوى المنقولة بالهواء وفريقاً مدرباً، مع استخدام جهاز تنفس مختبر الملاءمة وجميع معدات الوقاية الخاصة بالمهمة وفق بروتوكول الإجراءات المولدة للرذاذ المحلي.",
            ),
            100,
            "safe",
            bi("Correct: a non-urgent aerosol-generating procedure should wait for the approved setting, controls and trained team.", "صحيح: ينبغي تأجيل الإجراء غير العاجل المولد للرذاذ حتى يتوفر المكان المعتمد والضوابط والفريق المدرب."),
            bi(
              "Airborne engineering controls, source control, hand hygiene and task-specific PPE work together. Staff respiratory protection must follow the fit-testing and respiratory-protection programme.",
              "تعمل الضوابط الهندسية للعدوى المنقولة بالهواء والسيطرة على المصدر ونظافة اليدين ومعدات الوقاية الخاصة بالمهمة معاً. ويجب أن تتبع حماية تنفس الموظفين برنامج اختبار الملاءمة والحماية التنفسية.",
            ),
            "standard-precautions",
          ),
          choice(
            "ipc-respiratory-procedure-b",
            bi(
              "Proceed in the current room wearing gloves only because the specimen is the main risk.",
              "نفّذ الإجراء في الغرفة الحالية مرتدياً القفازات فقط لأن العينة هي الخطر الأساسي.",
            ),
            0,
            "unsafe",
            bi("Unsafe: gloves do not control airborne exposure or make an unsuitable room safe for an aerosol-generating procedure.", "غير آمن: لا تتحكم القفازات في التعرض المنقول بالهواء ولا تجعل الغرفة غير المناسبة آمنة لإجراء مولد للرذاذ."),
            bi(
              "The procedure requires the approved setting, respiratory protection, other task-specific PPE and hand hygiene under local protocol.",
              "يتطلب الإجراء المكان المعتمد وحماية تنفسية ومعدات وقاية أخرى خاصة بالمهمة ونظافة اليدين وفق البروتوكول المحلي.",
            ),
            "standard-precautions",
          ),
          choice(
            "ipc-respiratory-procedure-c",
            bi(
              "Skip hand hygiene after removing PPE because the skin was covered.",
              "تجاوز تنظيف اليدين بعد نزع معدات الوقاية لأن الجلد كان مغطى.",
            ),
            0,
            "unsafe",
            bi("Unsafe: hands can become contaminated during care or PPE removal.", "غير آمن: قد تتلوث اليدان أثناء الرعاية أو نزع معدات الوقاية."),
            bi(
              "Correct hand-hygiene moments remain essential even when PPE is used.",
              "تظل أوقات نظافة اليدين الصحيحة أساسية حتى مع استخدام معدات الوقاية.",
            ),
            "standard-precautions",
          ),
        ],
      },
      {
        id: "ipc-respiratory-exposure",
        time: "07:00",
        narrative: bi(
          "Review shows that a roommate and one staff member may have had unprotected contact before precautions began. No one is currently symptomatic.",
          "تُظهر المراجعة احتمال تعرض زميل بالغرفة وأحد أفراد الطاقم دون حماية قبل بدء الاحتياطات. لا توجد أعراض حالياً لدى أي منهما.",
        ),
        vitals: [
          vital("Index patient temperature", "حرارة المريض الأساسي", 38.0, "°C", "°م"),
          vital("Index patient SpO2", "تشبع المريض الأساسي", 95, "%", "%"),
          vital("Roommate symptoms", "أعراض زميل الغرفة", "None", "reported", "حسب الإفادة"),
          vital("Staff symptoms", "أعراض الموظف", "None", "reported", "حسب الإفادة"),
        ],
        question: bi(
          "What is the best next infection-prevention step?",
          "ما أفضل خطوة تالية للوقاية من العدوى؟",
        ),
        choices: [
          choice(
            "ipc-respiratory-exposure-a",
            bi(
              "Notify IPC and the unit lead, document facts securely and follow the exposure pathway.",
              "أبلغ IPC ومسؤول الوحدة، ووثّق الحقائق بأمان، واتبع مسار التعامل مع التعرض.",
            ),
            100,
            "safe",
            bi("Correct: exposure management should be timely, systematic and confidential.", "صحيح: ينبغي أن تكون إدارة التعرض سريعة ومنهجية وسرية."),
            bi(
              "A formal pathway enables appropriate testing, monitoring, work advice and communication without unnecessary disclosure.",
              "يتيح المسار الرسمي الفحص والمراقبة وإرشاد العمل والتواصل المناسب دون كشف غير ضروري.",
            ),
            "exposure-management",
          ),
          choice(
            "ipc-respiratory-exposure-b",
            bi(
              "Post the names and exposure details in the unit group chat so everyone can watch for symptoms.",
              "انشر الأسماء وتفاصيل التعرض في مجموعة الوحدة ليتمكن الجميع من مراقبة الأعراض.",
            ),
            0,
            "unsafe",
            bi("Unsafe: broad disclosure breaches privacy and bypasses formal follow-up.", "غير آمن: ينتهك الكشف الواسع الخصوصية ويتجاوز المتابعة الرسمية."),
            bi(
              "Only those responsible for exposure management need the minimum necessary identifiable information.",
              "يحتاج المسؤولون عن إدارة التعرض فقط إلى الحد الأدنى اللازم من المعلومات التعريفية.",
            ),
            "exposure-management",
          ),
          choice(
            "ipc-respiratory-exposure-c",
            bi(
              "Wait until the end of the week because no exposed person has symptoms yet.",
              "انتظر حتى نهاية الأسبوع لأنه لا توجد أعراض لدى الأشخاص المتعرضين بعد.",
            ),
            10,
            "delay",
            bi("Symptom absence now does not remove the need for prompt risk assessment.", "غياب الأعراض حالياً لا يلغي الحاجة إلى تقييم الخطر سريعاً."),
            bi(
              "Early notification allows the responsible team to determine whether any time-sensitive follow-up is needed.",
              "يتيح الإبلاغ المبكر للفريق المسؤول تحديد ما إذا كانت هناك متابعة حساسة للوقت.",
            ),
            "exposure-management",
          ),
        ],
      },
    ],
  },
  {
    id: "medication-safety-label-mismatch",
    title: bi("The Label Does Not Match", "الملصق غير مطابق"),
    summary: bi(
      "A high-alert medicine discrepancy, an unrecorded allergy and a near miss test the nurse's verification and reporting behaviours.",
      "يختبر اختلاف في دواء عالي الخطورة وحساسية غير مسجلة وحادثة وشيكة سلوكيات التحقق والإبلاغ لدى الممرض.",
    ),
    departmentId: "medication-safety",
    department: bi("Medication Safety", "سلامة الدواء"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("medication-verification", "Medication verification", "التحقق من الدواء"),
      competency("allergy-safety", "Allergy reconciliation", "مطابقة الحساسية"),
      competency("near-miss-learning", "Near-miss reporting and learning", "الإبلاغ عن الحوادث الوشيكة والتعلم منها"),
    ],
    referenceIds: [
      "who-medication-safety-2024",
      "cdc-core-practices-2024",
      "spsc-resources-2026",
      "spsc-standards-2026",
      "scfhs-scope-2023",
    ],
    steps: [
      {
        id: "medication-mismatch-stop",
        time: "00:00",
        narrative: bi(
          "At the bedside, a nurse notices that the concentration printed on a prepared high-alert infusion does not match the active medication record. The infusion has not been connected.",
          "عند السرير يلاحظ الممرض أن التركيز المطبوع على تسريب دوائي عالي الخطورة ومجهز مسبقاً لا يطابق سجل الدواء النشط. لم يُوصل التسريب بعد.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 82, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 16, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "118/72", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 98, "%", "%"),
        ],
        question: bi(
          "What is the safest immediate response?",
          "ما الاستجابة الفورية الأكثر أماناً؟",
        ),
        choices: [
          choice(
            "medication-mismatch-stop-a",
            bi(
              "Stop administration and independently verify the patient, order, label and allergies.",
              "أوقف الإعطاء وتحقق بشكل مستقل من المريض والأمر والملصق والحساسيات.",
            ),
            100,
            "safe",
            bi("Correct: a mismatch is a stop signal, not a calculation challenge at the bedside.", "صحيح: عدم التطابق إشارة للتوقف وليس مسألة حساب تُحل عند السرير."),
            bi(
              "High-alert products require deliberate source verification and the safeguards defined by local policy.",
              "تتطلب المنتجات عالية الخطورة تحققاً مقصوداً من المصدر وضوابط السلامة المحددة في السياسة المحلية.",
            ),
            "medication-verification",
          ),
          choice(
            "medication-mismatch-stop-b",
            bi(
              "Administer it because it came from the pharmacy and correct the record later.",
              "أعطه لأنه وصل من الصيدلية وصحح السجل لاحقاً.",
            ),
            0,
            "unsafe",
            bi("Unsafe: origin does not override an unresolved patient-specific mismatch.", "غير آمن: لا يلغي مصدر المنتج اختلافاً غير محلول خاصاً بالمريض."),
            bi(
              "The nurse remains accountable for final verification and should not administer an ambiguous preparation.",
              "يبقى الممرض مسؤولاً عن التحقق النهائي ولا ينبغي له إعطاء مستحضر ملتبس.",
            ),
            "medication-verification",
          ),
          choice(
            "medication-mismatch-stop-c",
            bi(
              "Ask a nearby colleague whether the label looks familiar and proceed if they agree.",
              "اسأل زميلاً قريباً ما إذا كان الملصق مألوفاً ثم تابع إذا وافق.",
            ),
            25,
            "gap",
            bi("Informal familiarity is not an independent source verification.", "الألفة غير الرسمية ليست تحققاً مستقلاً من المصدر."),
            bi(
              "The check must compare authoritative patient, order and product information using the defined workflow.",
              "يجب أن تقارن المراجعة معلومات المريض والأمر والمنتج الموثوقة وفق سير العمل المحدد.",
            ),
            "medication-verification",
          ),
        ],
      },
      {
        id: "medication-allergy-reconcile",
        time: "03:00",
        narrative: bi(
          "During verification, the patient reports a previous severe reaction to the same medicine class. The current electronic allergy field is blank.",
          "أثناء التحقق يذكر المريض تفاعلاً شديداً سابقاً تجاه الفئة الدوائية نفسها. حقل الحساسية الإلكتروني الحالي فارغ.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 84, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 17, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "120/74", "mmHg", "ملم زئبق"),
          vital("Symptoms now", "الأعراض حالياً", "None", "reported", "حسب الإفادة"),
        ],
        question: bi(
          "What should the nurse do next?",
          "ماذا ينبغي للممرض أن يفعل تالياً؟",
        ),
        choices: [
          choice(
            "medication-allergy-reconcile-a",
            bi(
              "Hold the medicine, clarify the allergy, update the record and notify pharmacy and prescriber.",
              "أبقِ الدواء موقوفاً، ووضّح الحساسية، وحدّث السجل، وأبلغ الصيدلية والواصف.",
            ),
            100,
            "safe",
            bi("Correct: patient-reported allergy information is a safety signal requiring reconciliation.", "صحيح: معلومات الحساسية التي يذكرها المريض إشارة سلامة تتطلب المطابقة."),
            bi(
              "A blank field is not proof of no allergy; conflicting information must be resolved and communicated before exposure.",
              "لا يثبت الحقل الفارغ عدم وجود حساسية؛ ويجب حل المعلومات المتعارضة وإبلاغها قبل التعرض.",
            ),
            "allergy-safety",
          ),
          choice(
            "medication-allergy-reconcile-b",
            bi(
              "Trust the blank electronic field over the patient's account and continue.",
              "اعتمد الحقل الإلكتروني الفارغ بدلاً من إفادة المريض وتابع.",
            ),
            0,
            "unsafe",
            bi("Unsafe: incomplete records can fail and must be reconciled with new information.", "غير آمن: قد تكون السجلات ناقصة ويجب مطابقتها مع المعلومات الجديدة."),
            bi(
              "Ignoring the patient's history could expose them to preventable severe harm.",
              "قد يؤدي تجاهل تاريخ المريض إلى تعريضه لضرر شديد يمكن منعه.",
            ),
            "allergy-safety",
          ),
          choice(
            "medication-allergy-reconcile-c",
            bi(
              "Finish the medication round first and clarify the allergy near the end of the shift.",
              "أكمل جولة الأدوية أولاً ثم وضح الحساسية قرب نهاية المناوبة.",
            ),
            15,
            "delay",
            bi("Delaying reconciliation leaves the unresolved medicine and allergy risk active.", "يُبقي تأخير المطابقة خطر الدواء والحساسية غير المحسوم قائماً."),
            bi(
              "The product should remain controlled and the discrepancy should be resolved promptly with the responsible team.",
              "يجب إبقاء المنتج تحت السيطرة وحل الاختلاف سريعاً مع الفريق المسؤول.",
            ),
            "allergy-safety",
          ),
        ],
      },
      {
        id: "medication-near-miss-report",
        time: "07:00",
        narrative: bi(
          "The order is corrected and a replacement product is arranged. No medicine reached the patient, but another similar package is found in the same storage bin.",
          "صُحح الأمر ورُتب منتج بديل. لم يصل الدواء إلى المريض، لكن عُثر على عبوة مشابهة أخرى في حاوية التخزين نفسها.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 80, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 16, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "118/70", "mmHg", "ملم زئبق"),
          vital("Patient exposure", "تعرض المريض", "None", "verified", "تم التحقق"),
        ],
        question: bi(
          "Which follow-up best supports system learning?",
          "أي متابعة تدعم تعلم النظام على أفضل وجه؟",
        ),
        choices: [
          choice(
            "medication-near-miss-report-a",
            bi(
              "Secure the similar stock and file a factual, blame-free near-miss report.",
              "اعزل المخزون المشابه وقدّم بلاغاً واقعياً بلا لوم عن الحادثة الوشيكة.",
            ),
            100,
            "safe",
            bi("Correct: a near miss reveals a system hazard before patient harm occurs.", "صحيح: تكشف الحادثة الوشيكة خطراً نظامياً قبل وقوع ضرر للمريض."),
            bi(
              "Prompt containment and just-culture reporting support wider risk reduction and traceable follow-up.",
              "يدعم الاحتواء السريع والإبلاغ وفق ثقافة عادلة خفض الخطر على نطاق أوسع والمتابعة القابلة للتتبع.",
            ),
            "near-miss-learning",
          ),
          choice(
            "medication-near-miss-report-b",
            bi(
              "Discard the mismatched product and do not report because the patient was unharmed.",
              "تخلص من المنتج غير المطابق ولا تبلغ لأن المريض لم يتضرر.",
            ),
            0,
            "unsafe",
            bi("Unsafe: silent disposal removes evidence while leaving the system hazard in place.", "غير آمن: يزيل التخلص الصامت الدليل ويترك الخطر النظامي قائماً."),
            bi(
              "Near-miss reporting enables investigation, containment and prevention across other patients and shifts.",
              "يتيح الإبلاغ عن الحوادث الوشيكة التحقيق والاحتواء والوقاية لبقية المرضى والمناوبات.",
            ),
            "near-miss-learning",
          ),
          choice(
            "medication-near-miss-report-c",
            bi(
              "Photograph the patient label and share it in a personal messaging group to warn colleagues.",
              "صوّر ملصق المريض وشاركه في مجموعة مراسلة شخصية لتحذير الزملاء.",
            ),
            0,
            "unsafe",
            bi("Unsafe: personal channels can expose patient information and bypass controlled incident handling.", "غير آمن: قد تكشف القنوات الشخصية معلومات المريض وتتجاوز معالجة الحوادث المنضبطة."),
            bi(
              "Use approved confidential reporting and operational communication channels with minimum necessary information.",
              "استخدم قنوات الإبلاغ والتواصل التشغيلي السرية والمعتمدة مع الحد الأدنى اللازم من المعلومات.",
            ),
            "near-miss-learning",
          ),
        ],
      },
    ],
  },
  {
    id: "ward-postoperative-deterioration",
    title: bi("The Trend Behind the Numbers", "الاتجاه خلف الأرقام"),
    summary: bi(
      "A surgical-ward patient develops a subtle then rapid post-operative deterioration requiring recognition, escalation and safe transfer.",
      "يتعرض مريض في جناح جراحي لتدهور خفي ثم سريع بعد العملية، مما يتطلب التعرف والتصعيد والنقل الآمن.",
    ),
    departmentId: "medical-surgical",
    department: bi("Medical-Surgical Ward", "الجناح الباطني والجراحي"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("trend-recognition", "Trend recognition", "التعرف على اتجاه التغير"),
      competency("emergency-escalation", "Emergency escalation", "التصعيد الطارئ"),
      competency("safe-transfer", "Safe transfer of care", "النقل الآمن للرعاية"),
    ],
    referenceIds: [
      "nice-cg50",
      "who-patient-safety-2021",
      "spsc-standards-2026",
      "scfhs-scope-2023",
    ],
    steps: [
      {
        id: "ward-deterioration-trend",
        time: "00:00",
        narrative: bi(
          "Six hours after abdominal surgery, the patient says, “I feel faint.” The patient is pale; earlier blood pressure was 132/78 and heart rate was 84.",
          "بعد ست ساعات من جراحة في البطن يقول المريض: «أشعر أنني سأفقد الوعي». يبدو شاحباً؛ وكان ضغطه سابقاً 132/78 ومعدل قلبه 84.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 104, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 22, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "102/64", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 95, "%", "%"),
        ],
        question: bi(
          "What is the most appropriate nursing response to this change?",
          "ما الاستجابة التمريضية الأنسب لهذا التغير؟",
        ),
        choices: [
          choice(
            "ward-deterioration-trend-a",
            bi(
              "Repeat a structured assessment, compare trends and activate the local escalation trigger.",
              "أعد تقييماً منظماً، وقارن الاتجاهات، وفعّل مؤشر التصعيد المحلي.",
            ),
            100,
            "safe",
            bi("Correct: relative change and symptoms can reveal deterioration before an extreme value appears.", "صحيح: قد يكشف التغير النسبي والأعراض التدهور قبل ظهور قيمة شديدة."),
            bi(
              "A track-and-trigger approach combines observations, trajectory and clinical concern rather than waiting for one threshold.",
              "يجمع نظام الرصد وعتبات التصعيد بين الملاحظات ومسار التغير والقلق السريري بدلاً من انتظار حد واحد.",
            ),
            "trend-recognition",
          ),
          choice(
            "ward-deterioration-trend-b",
            bi(
              "Record the values as acceptable and repeat them at the next routine four-hour round.",
              "سجّل القيم على أنها مقبولة وأعدها في جولة الساعات الأربع الروتينية التالية.",
            ),
            10,
            "delay",
            bi("This misses the meaningful fall from baseline and the new symptom.", "يفوّت هذا الانخفاض المهم عن خط الأساس والعرض الجديد."),
            bi(
              "Clinical concern should increase observation and response, even before severe absolute thresholds are reached.",
              "يجب أن يزيد القلق السريري شدة المراقبة والاستجابة حتى قبل بلوغ الحدود المطلقة الشديدة.",
            ),
            "trend-recognition",
          ),
          choice(
            "ward-deterioration-trend-c",
            bi(
              "Assume the dizziness is an expected medicine effect and offer reassurance without reassessment.",
              "افترض أن الدوخة أثر دوائي متوقع وقدّم الطمأنة دون إعادة تقييم.",
            ),
            20,
            "gap",
            bi("A possible explanation should not replace assessment of a new deterioration pattern.", "لا ينبغي لتفسير محتمل أن يحل محل تقييم نمط تدهور جديد."),
            bi(
              "Premature attribution can delay recognition of bleeding, infection or other acute causes.",
              "قد يؤخر الإسناد المبكر التعرف على نزف أو عدوى أو أسباب حادة أخرى.",
            ),
            "trend-recognition",
          ),
        ],
      },
      {
        id: "ward-deterioration-emergency",
        time: "03:00",
        narrative: bi(
          "While being reassessed, the patient becomes clammy and increasingly light-headed. The wound dressing appears more saturated than at the previous check.",
          "أثناء إعادة التقييم يصبح المريض متعرقاً وبارد الجلد وتزداد دوخته. تبدو ضمادة الجرح أكثر تشبعاً من الفحص السابق.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 120, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 28, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "86/52", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert, dizzy", "AVPU", "مقياس AVPU، مع دوخة"),
        ],
        question: bi(
          "What is the priority now?",
          "ما الأولوية الآن؟",
        ),
        choices: [
          choice(
            "ward-deterioration-emergency-a",
            bi(
              "Activate the urgent response, stay with the patient and continue support within scope.",
              "فعّل الاستجابة العاجلة، وابقَ مع المريض، وواصل الدعم ضمن نطاقك.",
            ),
            100,
            "safe",
            bi("Correct: the patient now has signs of circulatory compromise.", "صحيح: لدى المريض الآن علامات قصور في الدورة الدموية."),
            bi(
              "Rapid escalation and supportive nursing actions reduce delay while the cause is evaluated by the responsible team.",
              "يقلل التصعيد السريع والإجراءات التمريضية الداعمة التأخير بينما يقيّم الفريق المسؤول السبب.",
            ),
            "emergency-escalation",
          ),
          choice(
            "ward-deterioration-emergency-b",
            bi(
              "Help the patient walk to the bathroom before calling the team.",
              "ساعد المريض على المشي إلى دورة المياه قبل استدعاء الفريق.",
            ),
            0,
            "unsafe",
            bi("Unsafe: hypotension and dizziness create immediate collapse and fall risk.", "غير آمن: يسبب انخفاض الضغط والدوخة خطر الانهيار والسقوط فوراً."),
            bi(
              "The patient should remain supported and monitored while urgent help is activated.",
              "يجب إبقاء المريض مدعوماً وتحت المراقبة أثناء تفعيل المساعدة العاجلة.",
            ),
            "emergency-escalation",
          ),
          choice(
            "ward-deterioration-emergency-c",
            bi(
              "Send a non-urgent message to the surgical team and continue the medication round.",
              "أرسل رسالة غير عاجلة إلى الفريق الجراحي وواصل جولة الأدوية.",
            ),
            5,
            "delay",
            bi("The current instability requires an immediate response, not asynchronous review.", "يتطلب عدم الاستقرار الحالي استجابة فورية لا مراجعة غير متزامنة."),
            bi(
              "Competing routine tasks should be handed over when a patient becomes acutely unstable.",
              "ينبغي تسليم المهام الروتينية المتعارضة عندما يصبح المريض غير مستقر بشكل حاد.",
            ),
            "emergency-escalation",
          ),
        ],
      },
      {
        id: "ward-deterioration-transfer",
        time: "07:00",
        narrative: bi(
          "The response team has initiated the authorised plan. The patient is transferring for urgent evaluation; one requested investigation remains pending.",
          "بدأ فريق الاستجابة الخطة المعتمدة. سيُنقل المريض للتقييم العاجل؛ وما يزال أحد الفحوص المطلوبة معلقاً.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 110, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 24, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "96/58", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 96, "% with support", "% مع الدعم"),
        ],
        question: bi(
          "Which transfer action is safest?",
          "أي إجراء عند النقل هو الأكثر أماناً؟",
        ),
        choices: [
          choice(
            "ward-deterioration-transfer-a",
            bi(
              "Use a monitored transfer and assign ownership of the pending result during handover.",
              "استخدم نقلاً تحت المراقبة وحدد مسؤولية النتيجة المعلقة أثناء التسليم.",
            ),
            100,
            "safe",
            bi("Correct: transfer includes active risk control and clear accountability.", "صحيح: يشمل النقل ضبطاً نشطاً للمخاطر ومساءلة واضحة."),
            bi(
              "Patient movement is a high-risk transition; monitoring, communication and result follow-up must remain continuous.",
              "يمثل نقل المريض انتقالاً عالي الخطورة؛ ويجب استمرار المراقبة والتواصل ومتابعة النتائج دون انقطاع.",
            ),
            "safe-transfer",
          ),
          choice(
            "ward-deterioration-transfer-b",
            bi(
              "Send the patient with a porter and ask the receiving area to read the electronic record later.",
              "أرسل المريض مع ناقل واطلب من المنطقة المستلمة قراءة السجل الإلكتروني لاحقاً.",
            ),
            0,
            "unsafe",
            bi("Unsafe: an unstable patient needs appropriate escort, monitoring and live handover.", "غير آمن: يحتاج المريض غير المستقر إلى مرافقة ومراقبة وتسليم مباشر مناسب."),
            bi(
              "The record supports but does not replace responsibility transfer and immediate situational awareness.",
              "يدعم السجل نقل المسؤولية والوعي الفوري بالحالة لكنه لا يحل محلهما.",
            ),
            "safe-transfer",
          ),
          choice(
            "ward-deterioration-transfer-c",
            bi(
              "Assume the pending result will automatically reach the right clinician without naming an owner.",
              "افترض أن النتيجة المعلقة ستصل تلقائياً إلى الممارس المناسب دون تسمية مسؤول عنها.",
            ),
            35,
            "gap",
            bi("Unassigned follow-up is vulnerable to omission during transitions.", "المتابعة غير المسندة عرضة للإغفال أثناء الانتقال."),
            bi(
              "Closed-loop transfer requires a named receiver for unresolved tasks and results.",
              "يتطلب نقل المسؤولية مغلق الحلقة مستلماً محدداً للمهام والنتائج غير المحسومة.",
            ),
            "safe-transfer",
          ),
        ],
      },
    ],
  },
  {
    id: "pediatric-febrile-deterioration",
    title: bi("The Caregiver Notices First", "المرافق يلاحظ أولاً"),
    summary: bi(
      "A febrile child shows worsening respiratory effort and perfusion while the caregiver reports a marked change from normal.",
      "يُظهر طفل مصاب بالحمى تزايداً في الجهد التنفسي وتدهوراً في الإرواء، بينما يذكر المرافق تغيراً واضحاً عن المعتاد.",
    ),
    departmentId: "pediatrics",
    department: bi("Pediatrics", "طب الأطفال"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("pediatric-assessment", "Pediatric assessment", "تقييم الأطفال"),
      competency("pediatric-escalation", "Pediatric escalation", "التصعيد في حالات الأطفال"),
      competency("family-handover", "Family-inclusive handover", "التسليم بمشاركة الأسرة"),
    ],
    referenceIds: [
      "who-bec",
      "who-patient-safety-2021",
      "scfhs-scope-2023",
      "saudi-moh-protocols-2026",
    ],
    steps: [
      {
        id: "peds-fever-assess",
        time: "00:00",
        narrative: bi(
          "A four-year-old with fever is unusually quiet and does not engage with a favourite toy. The caregiver says, “This is not how my child usually looks when sick.”",
          "طفل عمره أربع سنوات مصاب بالحمى هادئ على غير عادته ولا يتفاعل مع لعبته المفضلة. يقول المرافق: «هذه ليست هيئته المعتادة عندما يمرض». ",
        ),
        vitals: [
          vital("Temperature", "الحرارة", 39.0, "°C", "°م"),
          vital("Heart rate", "معدل القلب", 148, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 34, "/min", "/دقيقة"),
          vital("Capillary refill", "امتلاء الشعيرات", 4, "seconds", "ثوانٍ"),
        ],
        question: bi(
          "What is the best first response?",
          "ما أفضل استجابة أولى؟",
        ),
        choices: [
          choice(
            "peds-fever-assess-a",
            bi(
              "Perform an age-appropriate assessment, include the caregiver's concern and escalate urgently.",
              "أجرِ تقييماً مناسباً للعمر، وضمّن قلق المرافق، وصعّد الحالة عاجلاً.",
            ),
            100,
            "safe",
            bi("Correct: behaviour and caregiver concern are clinically meaningful alongside vital signs.", "صحيح: للسلوك وقلق المرافق دلالة سريرية إلى جانب العلامات الحيوية."),
            bi(
              "Children can compensate before deteriorating rapidly, so a structured early assessment and escalation are essential.",
              "قد يعوض الأطفال قبل أن يتدهوروا سريعاً، لذا يعد التقييم المبكر المنظم والتصعيد ضروريين.",
            ),
            "pediatric-assessment",
          ),
          choice(
            "peds-fever-assess-b",
            bi(
              "Keep the child in the routine waiting area because the blood pressure has not yet been recorded.",
              "أبقِ الطفل في منطقة الانتظار الروتينية لأن ضغط الدم لم يُسجل بعد.",
            ),
            0,
            "unsafe",
            bi("Unsafe: missing one measurement should not override current high-risk signs.", "غير آمن: لا ينبغي لغياب قياس واحد أن يلغي علامات الخطر الحالية."),
            bi(
              "Assessment and urgent placement can continue while a complete, correctly sized set of observations is obtained.",
              "يمكن استمرار التقييم والوضع العاجل أثناء استكمال العلامات الحيوية باستخدام المقاسات الصحيحة.",
            ),
            "pediatric-assessment",
          ),
          choice(
            "peds-fever-assess-c",
            bi(
              "Ask the caregiver to offer a drink, then reassess after the waiting-room queue clears.",
              "اطلب من المرافق تقديم مشروب ثم أعد التقييم بعد انتهاء قائمة الانتظار.",
            ),
            15,
            "delay",
            bi("This delays assessment of abnormal perfusion and responsiveness.", "يؤخر هذا تقييم الإرواء والاستجابة غير الطبيعيين."),
            bi(
              "Oral intake is not a substitute for urgent assessment and may be inappropriate if consciousness worsens.",
              "لا يحل تناول السوائل فموياً محل التقييم العاجل وقد لا يكون مناسباً إذا تراجع الوعي.",
            ),
            "pediatric-assessment",
          ),
        ],
      },
      {
        id: "peds-fever-deteriorate",
        time: "03:00",
        narrative: bi(
          "The child becomes drowsier and develops visible chest recession. The caregiver remains at the bedside and can help describe the change.",
          "يزداد نعاس الطفل ويظهر انكماش واضح في جدار الصدر. يبقى المرافق عند السرير ويمكنه وصف التغير.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 156, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 40, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "82/46", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 89, "% on room air", "% على هواء الغرفة"),
        ],
        question: bi(
          "What is the safest immediate action?",
          "ما الإجراء الفوري الأكثر أماناً؟",
        ),
        choices: [
          choice(
            "peds-fever-deteriorate-a",
            bi(
              "Activate the pediatric response and provide age-appropriate ABCDE support within scope.",
              "فعّل استجابة الأطفال وقدّم دعم ABCDE المناسب للعمر ضمن نطاقك.",
            ),
            100,
            "safe",
            bi("Correct: respiratory and circulatory deterioration require immediate coordinated help.", "صحيح: يتطلب التدهور التنفسي والدوراني مساعدة منسقة فورية."),
            bi(
              "Rapid team activation, supported care and repeated observations are priorities; exact therapies follow pediatric orders and protocols.",
              "الأولويات هي تفعيل الفريق سريعاً وتقديم الدعم وتكرار الملاحظات؛ أما العلاجات الدقيقة فتتبع أوامر وبروتوكولات الأطفال.",
            ),
            "pediatric-escalation",
          ),
          choice(
            "peds-fever-deteriorate-b",
            bi(
              "Give a medicine brought from home before checking its label, dose history or authorisation.",
              "أعطِ دواءً أُحضر من المنزل قبل التحقق من ملصقه وتاريخ الجرعات واعتماده.",
            ),
            0,
            "unsafe",
            bi("Unsafe: unverified medication creates immediate dosing and interaction risk.", "غير آمن: يخلق الدواء غير المتحقق منه خطر جرعة وتداخل فورياً."),
            bi(
              "Medication administration requires patient-specific verification, an authorised plan and weight-aware safeguards.",
              "يتطلب إعطاء الدواء تحققاً خاصاً بالمريض وخطة معتمدة وضوابط تراعي الوزن.",
            ),
            "pediatric-escalation",
          ),
          choice(
            "peds-fever-deteriorate-c",
            bi(
              "Move the child to an unmonitored quiet room and reassess after the child sleeps.",
              "انقل الطفل إلى غرفة هادئة دون مراقبة وأعد التقييم بعد نومه.",
            ),
            0,
            "unsafe",
            bi("Unsafe: drowsiness here may represent worsening illness, not restorative sleep.", "غير آمن: قد يمثل النعاس هنا تفاقم المرض لا نوماً طبيعياً."),
            bi(
              "The child requires continuous observation and urgent expert assessment.",
              "يحتاج الطفل إلى مراقبة مستمرة وتقييم خبير عاجل.",
            ),
            "pediatric-escalation",
          ),
        ],
      },
      {
        id: "peds-fever-handover",
        time: "07:00",
        narrative: bi(
          "After the emergency response, the child's work of breathing is improving. Transfer to a higher-acuity pediatric area is arranged.",
          "بعد الاستجابة الطارئة يتحسن جهد تنفس الطفل. رُتب نقله إلى منطقة أطفال أعلى حدة.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 142, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 32, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "90/52", "mmHg", "ملم زئبق"),
          vital("SpO2", "تشبع الأكسجين", 95, "% with support", "% مع الدعم"),
        ],
        question: bi(
          "What information is essential in the handover?",
          "ما المعلومات الأساسية في التسليم؟",
        ),
        choices: [
          choice(
            "peds-fever-handover-a",
            bi(
              "Hand over verified weight, allergies, baseline, vital trends, response and remaining concerns.",
              "سلّم الوزن المتحقق منه والحساسيات وخط الأساس واتجاه العلامات والاستجابة والمخاوف المتبقية.",
            ),
            100,
            "safe",
            bi("Correct: pediatric safety depends on accurate context as well as current observations.", "صحيح: تعتمد سلامة الأطفال على السياق الدقيق إلى جانب الملاحظات الحالية."),
            bi(
              "Weight, baseline behaviour and caregiver knowledge can materially affect risk assessment and downstream decisions.",
              "قد يؤثر الوزن والسلوك المعتاد ومعرفة المرافق بشكل جوهري في تقييم الخطر والقرارات اللاحقة.",
            ),
            "family-handover",
          ),
          choice(
            "peds-fever-handover-b",
            bi(
              "Report only the latest oxygen saturation because the receiving team can repeat everything else.",
              "أبلغ عن أحدث تشبع للأكسجين فقط لأن الفريق المستلم يستطيع إعادة كل شيء آخر.",
            ),
            20,
            "gap",
            bi("This omits the deterioration trajectory and key pediatric safeguards.", "يغفل هذا مسار التدهور وضوابط سلامة أساسية للأطفال."),
            bi(
              "Repeating measurements does not recover lost context about timing, baseline or treatment response.",
              "لا تستعيد إعادة القياسات السياق المفقود عن التوقيت وخط الأساس والاستجابة للعلاج.",
            ),
            "family-handover",
          ),
          choice(
            "peds-fever-handover-c",
            bi(
              "Exclude the caregiver from all communication because clinical information should come only from staff.",
              "استبعد المرافق من كل تواصل لأن المعلومات السريرية يجب أن تأتي من الطاقم فقط.",
            ),
            35,
            "gap",
            bi("Caregiver observations can be an important safety signal.", "قد تكون ملاحظات المرافق إشارة سلامة مهمة."),
            bi(
              "Family-inclusive care respects privacy while using the caregiver's knowledge of the child's baseline and change.",
              "تحترم الرعاية بمشاركة الأسرة الخصوصية وتستفيد من معرفة المرافق بخط أساس الطفل وتغيره.",
            ),
            "family-handover",
          ),
        ],
      },
    ],
  },
  {
    id: "maternity-postpartum-sepsis",
    title: bi("Not Just Postpartum Fatigue", "ليس مجرد إرهاق ما بعد الولادة"),
    summary: bi(
      "A recently postpartum patient develops possible maternal sepsis and needs respectful, rapid escalation and continuing reassessment.",
      "تظهر على مريضة حديثة الولادة علامات إنتان أمومي محتمل وتحتاج إلى تصعيد سريع ومحترم وإعادة تقييم مستمرة.",
    ),
    departmentId: "maternity",
    department: bi("Maternity and Postnatal Care", "الأمومة ورعاية ما بعد الولادة"),
    difficultyId: "advanced",
    difficulty: bi("Advanced", "متقدم"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("maternal-risk-recognition", "Maternal risk recognition", "التعرف على مخاطر الأمومة"),
      competency("maternal-emergency-response", "Maternal emergency response", "الاستجابة لطوارئ الأمومة"),
      competency("respectful-continuity", "Respectful continuity of care", "استمرارية الرعاية باحترام"),
    ],
    referenceIds: [
      "who-bec",
      "who-patient-safety-2021",
      "scfhs-scope-2023",
      "saudi-moh-protocols-2026",
    ],
    steps: [
      {
        id: "maternity-sepsis-recognise",
        time: "00:00",
        narrative: bi(
          "On the third day after birth, a patient reports shaking chills, worsening lower abdominal pain and feeling much weaker than yesterday.",
          "في اليوم الثالث بعد الولادة تذكر المريضة قشعريرة شديدة وألماً متزايداً أسفل البطن وضعفاً أكبر بكثير من الأمس.",
        ),
        vitals: [
          vital("Temperature", "الحرارة", 39.1, "°C", "°م"),
          vital("Heart rate", "معدل القلب", 116, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 24, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "100/62", "mmHg", "ملم زئبق"),
        ],
        question: bi(
          "What is the most appropriate initial nursing action?",
          "ما الإجراء التمريضي الأولي الأنسب؟",
        ),
        choices: [
          choice(
            "maternity-sepsis-recognise-a",
            bi(
              "Treat this as possible maternal sepsis and activate the maternity escalation pathway.",
              "تعامل مع الحالة كإنتان أمومي محتمل وفعّل مسار تصعيد الأمومة.",
            ),
            100,
            "safe",
            bi("Correct: postpartum status does not make systemic deterioration routine.", "صحيح: لا تجعل فترة ما بعد الولادة التدهور الجهازي أمراً اعتيادياً."),
            bi(
              "Fever, tachycardia, pain and marked change from baseline require prompt maternal assessment and escalation.",
              "تتطلب الحمى وتسارع القلب والألم والتغير الواضح عن خط الأساس تقييماً وتصعيداً أموميين عاجلين.",
            ),
            "maternal-risk-recognition",
          ),
          choice(
            "maternity-sepsis-recognise-b",
            bi(
              "Reassure the patient that fatigue and chills are expected after birth and review tomorrow.",
              "طمئن المريضة بأن الإرهاق والقشعريرة متوقعان بعد الولادة وراجعها غداً.",
            ),
            0,
            "unsafe",
            bi("Unsafe: the current combination may signal a time-critical infection.", "غير آمن: قد يشير هذا المزيج الحالي إلى عدوى حساسة للوقت."),
            bi(
              "Normalising significant deterioration can delay recognition of maternal sepsis.",
              "قد يؤدي اعتبار التدهور المهم طبيعياً إلى تأخير التعرف على الإنتان الأمومي.",
            ),
            "maternal-risk-recognition",
          ),
          choice(
            "maternity-sepsis-recognise-c",
            bi(
              "Focus on the pain score only and defer the complete observations until after routine care.",
              "ركّز على درجة الألم فقط وأجّل العلامات الحيوية الكاملة إلى ما بعد الرعاية الروتينية.",
            ),
            20,
            "gap",
            bi("Pain matters, but the systemic pattern needs a full assessment now.", "الألم مهم، لكن النمط الجهازي يحتاج إلى تقييم كامل الآن."),
            bi(
              "Single-symptom assessment can miss worsening circulation, breathing or mentation.",
              "قد يفوّت تقييم عرض واحد تدهور الدورة الدموية أو التنفس أو الوعي.",
            ),
            "maternal-risk-recognition",
          ),
        ],
      },
      {
        id: "maternity-sepsis-emergency",
        time: "03:00",
        narrative: bi(
          "During reassessment, the patient becomes confused and says she may faint. Peripheral perfusion is poor.",
          "أثناء إعادة التقييم تصبح المريضة مشوشة وتقول إنها قد تفقد الوعي. الإرواء الطرفي ضعيف.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 128, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 30, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "86/48", "mmHg", "ملم زئبق"),
          vital("Capillary refill", "امتلاء الشعيرات", 4, "seconds", "ثوانٍ"),
        ],
        question: bi(
          "What is the safest next action?",
          "ما الإجراء التالي الأكثر أماناً؟",
        ),
        choices: [
          choice(
            "maternity-sepsis-emergency-a",
            bi(
              "Activate the maternal emergency response and support ABCDE within your authorised scope.",
              "فعّل استجابة طوارئ الأمومة وادعم ABCDE ضمن نطاقك المعتمد.",
            ),
            100,
            "safe",
            bi("Correct: confusion and hypotension indicate critical deterioration.", "صحيح: يشير التشوش وانخفاض الضغط إلى تدهور حرج."),
            bi(
              "Urgent coordinated care should begin from clinical recognition; exact diagnostics and treatments follow authorised local pathways.",
              "ينبغي أن تبدأ الرعاية المنسقة العاجلة عند التعرف السريري؛ وتتبع الفحوص والعلاجات الدقيقة المسارات المحلية المعتمدة.",
            ),
            "maternal-emergency-response",
          ),
          choice(
            "maternity-sepsis-emergency-b",
            bi(
              "Wait for a confirmed culture result before activating the emergency response.",
              "انتظر نتيجة مزرعة مؤكدة قبل تفعيل الاستجابة الطارئة.",
            ),
            0,
            "unsafe",
            bi("Unsafe: shock signs require action before diagnostic confirmation.", "غير آمن: تتطلب علامات الصدمة إجراءً قبل التأكيد التشخيصي."),
            bi(
              "Tests support diagnosis, but they must not delay response to current instability.",
              "تدعم الفحوص التشخيص، لكنها يجب ألا تؤخر الاستجابة لعدم الاستقرار الحالي.",
            ),
            "maternal-emergency-response",
          ),
          choice(
            "maternity-sepsis-emergency-c",
            bi(
              "Ask the patient to shower alone while waiting because cooling may improve comfort.",
              "اطلب من المريضة الاستحمام وحدها أثناء الانتظار لأن التبريد قد يحسن الراحة.",
            ),
            0,
            "unsafe",
            bi("Unsafe: confusion and hypotension create severe collapse and fall risk.", "غير آمن: يسبب التشوش وانخفاض الضغط خطراً شديداً للانهيار والسقوط."),
            bi(
              "The patient needs immediate observation, support and emergency review.",
              "تحتاج المريضة إلى مراقبة ودعم ومراجعة طارئة فوراً.",
            ),
            "maternal-emergency-response",
          ),
        ],
      },
      {
        id: "maternity-sepsis-continuity",
        time: "07:00",
        narrative: bi(
          "The emergency plan is underway and circulation is improving. The patient is frightened and asks what will happen to her baby during transfer.",
          "بدأت الخطة الطارئة ويتحسن الدوران. تشعر المريضة بالخوف وتسأل عما سيحدث لطفلها أثناء النقل.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 114, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 24, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "98/60", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi(
          "Which response best combines clinical and respectful care?",
          "أي استجابة تجمع الرعاية السريرية والمحترمة على أفضل وجه؟",
        ),
        choices: [
          choice(
            "maternity-sepsis-continuity-a",
            bi(
              "Reassess frequently, explain the transfer and coordinate safe baby care with the team.",
              "أعد التقييم كثيراً، واشرح النقل، ونسّق رعاية آمنة للطفل مع الفريق.",
            ),
            100,
            "safe",
            bi("Correct: safety includes physiology, communication and the patient's priorities.", "صحيح: تشمل السلامة الحالة الفسيولوجية والتواصل وأولويات المريضة."),
            bi(
              "Respectful information and coordinated family needs can occur without delaying high-acuity care.",
              "يمكن تقديم معلومات باحترام وتنسيق احتياجات الأسرة دون تأخير الرعاية عالية الحدة.",
            ),
            "respectful-continuity",
          ),
          choice(
            "maternity-sepsis-continuity-b",
            bi(
              "Avoid answering questions until every investigation is complete.",
              "تجنب الإجابة عن الأسئلة حتى تكتمل جميع الفحوص.",
            ),
            30,
            "gap",
            bi("Uncertainty can be explained honestly without withholding all communication.", "يمكن شرح عدم اليقين بصدق دون حجب التواصل كله."),
            bi(
              "Clear updates reduce distress and support informed participation during urgent care.",
              "تقلل التحديثات الواضحة الضيق وتدعم المشاركة الواعية أثناء الرعاية العاجلة.",
            ),
            "respectful-continuity",
          ),
          choice(
            "maternity-sepsis-continuity-c",
            bi(
              "Discuss the full case loudly in the corridor so relatives can arrange baby care.",
              "ناقش الحالة كاملة بصوت مرتفع في الممر ليتمكن الأقارب من ترتيب رعاية الطفل.",
            ),
            0,
            "unsafe",
            bi("Unsafe: urgency does not remove confidentiality obligations.", "غير آمن: لا تلغي الحالة العاجلة واجبات السرية."),
            bi(
              "Information should be shared privately with authorised people and only to the extent needed for safe care.",
              "ينبغي مشاركة المعلومات بخصوصية مع الأشخاص المصرح لهم وبالقدر اللازم للرعاية الآمنة فقط.",
            ),
            "respectful-continuity",
          ),
        ],
      },
    ],
  },
  {
    id: "icu-postoperative-sepsis",
    title: bi("A Quiet Shift Changes", "تحول مفاجئ في مناوبة هادئة"),
    summary: bi(
      "A post-operative critical-care patient develops signs of possible sepsis and worsening perfusion.",
      "تظهر على مريض بعد الجراحة في العناية الحرجة علامات إنتان محتمل وتدهور في الإرواء.",
    ),
    departmentId: "critical-care",
    department: bi("Critical Care", "العناية الحرجة"),
    difficultyId: "advanced",
    difficulty: bi("Advanced", "متقدم"),
    durationMinutes: 9,
    duration: bi("9 minutes", "9 دقائق"),
    competencies: [
      competency("deterioration-recognition", "Recognition of deterioration", "التعرف على التدهور"),
      competency("sepsis-escalation", "Sepsis pathway escalation", "تفعيل مسار الإنتان"),
      competency("perfusion-reassessment", "Perfusion reassessment", "إعادة تقييم الإرواء"),
    ],
    referenceIds: [
      "ssc-2026",
      "nice-ng253-2025",
      "nice-cg50",
      "scfhs-scope-2023",
      "saudi-moh-protocols-2026",
    ],
    steps: [
      {
        id: "icu-sepsis-recognise",
        time: "00:00",
        narrative: bi(
          "On post-operative day two, a previously oriented patient is newly confused. Urine output has fallen over the last two observation periods and the surgical site is more tender.",
          "في اليوم الثاني بعد الجراحة، أصبح مريض كان واعياً بالمكان والزمان مشوشاً حديثاً. انخفض إخراج البول خلال فترتي المراقبة الأخيرتين وأصبح موضع الجراحة أكثر إيلاماً.",
        ),
        vitals: [
          vital("Temperature", "الحرارة", 38.6, "°C", "°م"),
          vital("Heart rate", "معدل القلب", 118, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 28, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "94/56", "mmHg", "ملم زئبق"),
        ],
        question: bi(
          "What is the best interpretation and next nursing action?",
          "ما أفضل تفسير وإجراء تمريضي تالٍ؟",
        ),
        choices: [
          choice(
            "icu-sepsis-recognise-a",
            bi(
              "Treat this as acute deterioration, reassess and escalate possible sepsis urgently.",
              "تعامل مع الحالة كتدهور حاد، وأعد التقييم، وصعّد احتمال الإنتان عاجلاً.",
            ),
            100,
            "safe",
            bi("Correct: the pattern is more important than any single value.", "صحيح: النمط المجمع أهم من أي قيمة منفردة."),
            bi(
              "New altered mentation, tachypnoea, hypotension and falling urine output require prompt recognition and escalation.",
              "يتطلب تغير الوعي وتسارع التنفس وانخفاض الضغط ونقص البول تعرفاً وتصعيداً عاجلين.",
            ),
            "deterioration-recognition",
          ),
          choice(
            "icu-sepsis-recognise-b",
            bi(
              "Document the values and wait for the next scheduled round to see whether they persist.",
              "وثّق القيم وانتظر الجولة المجدولة التالية لمعرفة ما إذا كانت ستستمر.",
            ),
            0,
            "unsafe",
            bi("Unsafe: waiting ignores multiple current signs of organ dysfunction.", "غير آمن: يتجاهل الانتظار علامات حالية متعددة لخلل الأعضاء."),
            bi(
              "Sepsis-related deterioration is time sensitive and should not depend on a routine observation interval.",
              "التدهور المرتبط بالإنتان حساس للوقت ولا ينبغي ربطه بفاصل المراقبة الروتيني.",
            ),
            "deterioration-recognition",
          ),
          choice(
            "icu-sepsis-recognise-c",
            bi(
              "Attribute the confusion and tachycardia to post-operative pain without completing another assessment.",
              "انسب التشوش وتسارع القلب إلى ألم ما بعد الجراحة دون استكمال تقييم آخر.",
            ),
            30,
            "gap",
            bi("Pain may contribute, but it does not explain away the full deterioration pattern.", "قد يساهم الألم، لكنه لا يفسر نمط التدهور كاملاً."),
            bi(
              "Premature closure can miss infection, shock or another time-critical cause.",
              "قد يؤدي الإغلاق التشخيصي المبكر إلى تفويت عدوى أو صدمة أو سبب آخر حساس للوقت.",
            ),
            "deterioration-recognition",
          ),
        ],
      },
      {
        id: "icu-sepsis-coordinate",
        time: "03:00",
        narrative: bi(
          "The clinician is on the way. The patient is cool peripherally with delayed capillary refill; investigations have been requested but are not yet resulted.",
          "الطبيب في الطريق. أطراف المريض باردة وزمن امتلاء الشعيرات متأخر؛ طُلبت الفحوص لكن نتائجها لم تصدر بعد.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 124, "bpm", "نبضة/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "86/50", "mmHg", "ملم زئبق"),
          vital("Capillary refill", "امتلاء الشعيرات", 4, "seconds", "ثوانٍ"),
          vital("SpO2", "تشبع الأكسجين", 93, "%", "%"),
        ],
        question: bi(
          "What should the nurse prioritise while the team assembles?",
          "ما الذي ينبغي للممرض إعطاؤه الأولوية أثناء تجمع الفريق؟",
        ),
        choices: [
          choice(
            "icu-sepsis-coordinate-a",
            bi(
              "Continue ABCDE support and begin the authorised sepsis pathway without waiting for every result.",
              "واصل دعم ABCDE وابدأ مسار الإنتان المعتمد دون انتظار كل النتائج.",
            ),
            100,
            "safe",
            bi("Correct: stabilisation, diagnostics and escalation should move together.", "صحيح: يجب أن يسير التثبيت والفحوص والتصعيد معاً."),
            bi(
              "Shock physiology warrants time-sensitive team care; exact tests and therapies follow authorised orders and local protocol.",
              "تستدعي فسيولوجيا الصدمة رعاية فريق حساسة للوقت؛ وتُتبع الفحوص والعلاجات الدقيقة وفق الأوامر المعتمدة والبروتوكول المحلي.",
            ),
            "sepsis-escalation",
          ),
          choice(
            "icu-sepsis-coordinate-b",
            bi(
              "Wait for the final laboratory results before escalating the blood-pressure change.",
              "انتظر النتائج المخبرية النهائية قبل تصعيد تغير ضغط الدم.",
            ),
            10,
            "delay",
            bi("Laboratory confirmation must not delay response to current shock signs.", "يجب ألا يؤخر التأكيد المخبري الاستجابة لعلامات الصدمة الحالية."),
            bi(
              "Clinical deterioration can be recognised and supported while diagnostic uncertainty remains.",
              "يمكن التعرف على التدهور السريري ودعمه مع بقاء عدم اليقين التشخيصي.",
            ),
            "sepsis-escalation",
          ),
          choice(
            "icu-sepsis-coordinate-c",
            bi(
              "Start a treatment prepared for another patient because the presentation looks similar.",
              "ابدأ علاجاً جُهز لمريض آخر لأن العرض يبدو مشابهاً.",
            ),
            0,
            "unsafe",
            bi("Unsafe: treatments must be patient-specific, verified and authorised.", "غير آمن: يجب أن تكون العلاجات خاصة بالمريض ومتحققاً منها ومعتمدة."),
            bi(
              "Bypassing identity, order and allergy safeguards creates immediate medication risk.",
              "يخلق تجاوز التحقق من الهوية والأمر والحساسية خطراً دوائياً فورياً.",
            ),
            "sepsis-escalation",
          ),
        ],
      },
      {
        id: "icu-sepsis-reassess",
        time: "08:00",
        narrative: bi(
          "The sepsis response is underway. The blood pressure is improving, but the patient remains confused and urine output remains low.",
          "بدأت استجابة الإنتان. يتحسن ضغط الدم، لكن المريض ما يزال مشوشاً وإخراج البول ما يزال منخفضاً.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 112, "bpm", "نبضة/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "98/60", "mmHg", "ملم زئبق"),
          vital("Capillary refill", "امتلاء الشعيرات", 3, "seconds", "ثوانٍ"),
          vital("Consciousness", "الوعي", "Confused", "AVPU", "مقياس AVPU"),
        ],
        question: bi(
          "Which follow-up best supports ongoing safety?",
          "أي متابعة تدعم السلامة المستمرة على أفضل وجه؟",
        ),
        choices: [
          choice(
            "icu-sepsis-reassess-a",
            bi(
              "Trend perfusion, mentation, breathing and urine output, then report non-resolution promptly.",
              "تابع اتجاه الإرواء والوعي والتنفس وإخراج البول، ثم أبلغ سريعاً عن عدم التحسن.",
            ),
            100,
            "safe",
            bi("Correct: improving blood pressure does not mean organ dysfunction has resolved.", "صحيح: تحسن ضغط الدم لا يعني زوال خلل الأعضاء."),
            bi(
              "Repeated multidomain assessment identifies response, residual risk and the need for further escalation.",
              "يحدد التقييم المتكرر متعدد الجوانب الاستجابة والخطر المتبقي والحاجة إلى مزيد من التصعيد.",
            ),
            "perfusion-reassessment",
          ),
          choice(
            "icu-sepsis-reassess-b",
            bi(
              "Return immediately to routine observation intervals because the blood pressure has risen.",
              "عُد فوراً إلى فواصل المراقبة الروتينية لأن ضغط الدم ارتفع.",
            ),
            25,
            "gap",
            bi("Residual confusion and low urine output still require close reassessment.", "ما يزال التشوش ونقص البول يتطلبان إعادة تقييم لصيقة."),
            bi(
              "A partial response should trigger continued trend monitoring, not premature de-escalation.",
              "ينبغي أن تؤدي الاستجابة الجزئية إلى استمرار متابعة الاتجاه لا خفض المتابعة مبكراً.",
            ),
            "perfusion-reassessment",
          ),
          choice(
            "icu-sepsis-reassess-c",
            bi(
              "Monitor temperature only because fever is the defining sign of sepsis.",
              "راقب الحرارة فقط لأنها العلامة المحددة للإنتان.",
            ),
            20,
            "gap",
            bi("Sepsis can progress with many organ signs; fever alone is insufficient.", "قد يتقدم الإنتان بعلامات أعضاء متعددة؛ والحرارة وحدها غير كافية."),
            bi(
              "Perfusion, breathing, consciousness and output are essential parts of the response assessment.",
              "يشكل الإرواء والتنفس والوعي والإخراج أجزاء أساسية من تقييم الاستجابة.",
            ),
            "perfusion-reassessment",
          ),
        ],
      },
    ],
  },
  {
    id: "older-adult-acute-confusion",
    title: bi("The Change Is the Clue", "التغير هو الدليل"),
    summary: bi(
      "An older adult becomes newly confused during admission, requiring structured assessment, immediate mobility safety and a precise handover.",
      "يظهر على بالغ كبير في السن تشوش جديد أثناء التنويم، ما يتطلب تقييماً منظماً وسلامة فورية للحركة وتسليماً دقيقاً.",
    ),
    departmentId: "older-adult-care",
    department: bi("Older Adult Care", "رعاية كبار السن"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("delirium-recognition", "Acute-change recognition", "التعرّف على التغير الحاد"),
      competency("mobility-safety", "Mobility and fall safety", "سلامة الحركة والوقاية من السقوط"),
      competency("handover", "Trend-based handover", "التسليم القائم على الاتجاهات"),
    ],
    referenceIds: ["nice-cg50", "spsc-standards-2026", "spsc-resources-2026", "scfhs-scope-2023"],
    steps: [
      {
        id: "older-adult-recognise",
        time: "00:00",
        narrative: bi(
          "An 82-year-old admitted after a minor fall was conversational an hour ago but now cannot state the place and repeatedly removes the observation probe.",
          "كان مريض يبلغ 82 عاماً أُدخل بعد سقوط بسيط يتحدث بصورة طبيعية قبل ساعة، لكنه الآن لا يستطيع تحديد المكان وينزع مجس المراقبة مراراً.",
        ),
        vitals: [
          vital("Heart rate", "معدل القلب", 104, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 22, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "108/66", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Confused", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What is the priority nursing response?", "ما الاستجابة التمريضية ذات الأولوية؟"),
        choices: [
          choice("older-adult-recognise-a", bi("Treat the change as acute: assess airway, breathing, circulation, glucose and vital trends, then escalate findings.", "تعامل مع التغير كحالة حادة: قيّم مجرى الهواء والتنفس والدوران والسكر واتجاه العلامات الحيوية، ثم صعّد النتائج."), 100, "safe", bi("Correct: a sudden cognitive change may be the first sign of physiological deterioration.", "صحيح: قد يكون التغير الإدراكي المفاجئ أول علامة على تدهور فسيولوجي."), bi("A structured assessment looks for reversible threats while timely escalation avoids dismissing the change as age-related.", "يبحث التقييم المنظم عن الأخطار القابلة للعكس، ويمنع التصعيد في الوقت المناسب إرجاع التغير إلى العمر فقط."), "delirium-recognition"),
          choice("older-adult-recognise-b", bi("Document dementia as the cause and wait for the next routine round.", "وثّق الخرف بوصفه السبب وانتظر الجولة الروتينية التالية."), 0, "unsafe", bi("Unsafe: an unverified label can delay recognition of acute deterioration.", "غير آمن: قد يؤخر الوصف غير المتحقق منه اكتشاف التدهور الحاد."), bi("New confusion is a change from baseline and requires prompt assessment rather than assumption.", "التشوش الجديد تغير عن خط الأساس ويتطلب تقييماً سريعاً بدلاً من الافتراض."), "delirium-recognition"),
          choice("older-adult-recognise-c", bi("Ask the family to reorient the patient and collect a detailed life history before beginning any physiological observations.", "اطلب من الأسرة إعادة توجيه المريض وجمع تاريخ حياته بالتفصيل قبل أن تبدأ أي قياس للعلامات أو تقييم فسيولوجي للحالة الحالية."), 35, "delay", bi("Family support may help, but it must not delay physiological assessment.", "قد يفيد دعم الأسرة، لكنه يجب ألا يؤخر التقييم الفسيولوجي."), bi("Reorientation is supportive care after immediate threats and changes from baseline are assessed.", "إعادة التوجيه رعاية داعمة بعد تقييم الأخطار الفورية والتغيرات عن خط الأساس."), "delirium-recognition"),
        ],
      },
      {
        id: "older-adult-mobility",
        time: "03:00",
        narrative: bi("While assessment continues, the patient tries to stand without assistance and says the bathroom is across the corridor.", "أثناء استمرار التقييم يحاول المريض الوقوف دون مساعدة ويقول إن دورة المياه في الجهة المقابلة من الممر."),
        vitals: [
          vital("Heart rate", "معدل القلب", 108, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 24, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "104/62", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Confused", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What should the nurse do first?", "ما الذي ينبغي أن يفعله الممرض أولاً؟"),
        choices: [
          choice("older-adult-mobility-a", bi("Remain with the patient, prevent unassisted standing and arrange safe toileting while continuing assessment.", "ابقَ مع المريض، وامنع الوقوف دون مساعدة، ونظّم قضاء الحاجة بأمان مع استمرار التقييم."), 100, "safe", bi("Correct: immediate supervision reduces harm without unnecessary restraint.", "صحيح: يقلل الإشراف الفوري الضرر دون تقييد غير ضروري."), bi("The response addresses the immediate fall risk while preserving dignity and investigating the acute change.", "تعالج الاستجابة خطر السقوط الفوري مع حفظ الكرامة واستقصاء التغير الحاد."), "mobility-safety"),
          choice("older-adult-mobility-b", bi("Leave briefly to find paperwork because the bed alarm is active.", "غادر لفترة قصيرة للبحث عن الأوراق لأن إنذار السرير مفعل."), 0, "unsafe", bi("Unsafe: an alarm does not replace direct help during an active attempt to stand.", "غير آمن: لا يحل الإنذار محل المساعدة المباشرة أثناء محاولة فعلية للوقوف."), bi("Immediate presence and a safe alternative are needed when risk is already occurring.", "يلزم الحضور الفوري وتوفير بديل آمن عندما يكون الخطر واقعاً بالفعل."), "mobility-safety"),
          choice("older-adult-mobility-c", bi("Tell the patient not to move and continue documentation at the desk.", "أخبر المريض ألا يتحرك واستمر في التوثيق عند المكتب."), 25, "gap", bi("A verbal instruction alone is unreliable during acute confusion.", "التوجيه اللفظي وحده غير موثوق أثناء التشوش الحاد."), bi("Supervision and assistance are required; communication should be calm, brief and paired with action.", "يلزم الإشراف والمساعدة؛ وينبغي أن يكون التواصل هادئاً ومختصراً ومقترناً بالفعل."), "mobility-safety"),
        ],
      },
      {
        id: "older-adult-handover",
        time: "07:00",
        narrative: bi("The rapid review is underway and the receiving clinician asks what changed and what remains unsafe.", "بدأت المراجعة العاجلة ويسأل الممارس المستلم عما تغير وما يزال غير آمن."),
        vitals: [
          vital("Heart rate", "معدل القلب", 102, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 22, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "110/68", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Confused", "AVPU", "مقياس AVPU"),
        ],
        question: bi("Which handover is most useful?", "أي تسليم هو الأكثر فائدة؟"),
        choices: [
          choice("older-adult-handover-a", bi("State the verified baseline, time and features of the change, current observations, assessments completed, safety actions and outstanding concerns.", "اذكر خط الأساس المتحقق منه ووقت التغير وخصائصه والمشاهدات الحالية والتقييمات المنجزة وإجراءات السلامة والمخاوف المتبقية."), 100, "safe", bi("Correct: the handover preserves the trend and the unresolved risk.", "صحيح: يحفظ التسليم اتجاه الحالة والخطر غير المحسوم."), bi("Specific chronology and response information help the next clinician reassess rather than start from an unqualified label.", "تساعد المعلومات المحددة زمنياً ومعلومات الاستجابة الممارس التالي على إعادة التقييم بدلاً من البدء بوصف غير دقيق."), "handover"),
          choice("older-adult-handover-b", bi("Report only that the patient is difficult and keeps trying to get up.", "أبلغ فقط بأن المريض صعب التعامل ويواصل محاولة النهوض."), 15, "gap", bi("This judgemental description omits the acute change and clinical evidence.", "هذا الوصف الحُكمي يغفل التغير الحاد والدليل السريري."), bi("A useful handover is objective, respectful and tied to baseline, assessment and response.", "يكون التسليم المفيد موضوعياً ومحترماً ومرتبطاً بخط الأساس والتقييم والاستجابة."), "handover"),
          choice("older-adult-handover-c", bi("Wait until every investigation is complete before sharing any update.", "انتظر اكتمال جميع الفحوص قبل مشاركة أي تحديث."), 20, "delay", bi("Delayed handover can interrupt precautions and reassessment.", "قد يعطل تأخر التسليم الاحتياطات وإعادة التقييم."), bi("Communicate what is known, what is uncertain and what is pending at the point of transfer.", "بلّغ بما هو معروف وما هو غير مؤكد وما هو قيد الانتظار عند نقطة الانتقال."), "handover"),
        ],
      },
    ],
  },
  {
    id: "oncology-fever-between-cycles",
    title: bi("Fever Between Cycles", "حمى بين دورات العلاج"),
    summary: bi("A patient recently receiving myelosuppressive systemic anticancer therapy reports fever and rigors, prompting recognition of possible neutropenic sepsis and repeated reassessment.", "يبلغ مريض تلقى حديثاً علاجاً جهازياً مضاداً للسرطان ومثبطاً لنخاع العظم عن حمى وقشعريرة شديدة، ما يتطلب التعرف على احتمال إنتان نقص العدلات وإعادة التقييم المتكرر."),
    departmentId: "oncology",
    department: bi("Oncology", "الأورام"),
    difficultyId: "advanced",
    difficulty: bi("Advanced", "متقدم"),
    durationMinutes: 9,
    duration: bi("9 minutes", "9 دقائق"),
    competencies: [
      competency("oncology-deterioration", "Risk recognition after myelosuppressive therapy", "التعرف على الخطر بعد العلاج المثبط لنخاع العظم"),
      competency("sepsis-escalation", "Time-sensitive escalation", "التصعيد الحساس للوقت"),
      competency("reassessment", "Response reassessment", "إعادة تقييم الاستجابة"),
    ],
    referenceIds: ["nice-neutropenic-sepsis-cg151", "ssc-2026", "saudi-moh-protocols-2026", "scfhs-scope-2023"],
    steps: [
      {
        id: "oncology-recognise",
        time: "00:00",
        narrative: bi("A patient calls the oncology unit six days after myelosuppressive systemic anticancer therapy. The patient's written oncology plan identifies the measured temperature as meeting the urgent fever threshold. The patient reports shaking chills, marked weakness and a home temperature of 38.3 °C.", "يتصل مريض بوحدة الأورام بعد ستة أيام من علاج جهازي مضاد للسرطان ومثبط لنخاع العظم. تحدد خطة الأورام المكتوبة للمريض أن الحرارة المقاسة بلغت عتبة الحمى التي تستلزم تقييماً عاجلاً. ويبلغ المريض عن قشعريرة شديدة وضعف واضح وحرارة منزلية بلغت 38.3°م."),
        vitals: [
          vital("Temperature", "الحرارة", 38.3, "°C", "°م"),
          vital("Heart rate", "معدل القلب", 116, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 24, "/min", "/دقيقة"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What is the safest first nursing response?", "ما الاستجابة التمريضية الأولى الأكثر أماناً؟"),
        choices: [
          choice("oncology-recognise-a", bi("Treat this as time-sensitive deterioration and activate the approved oncology or emergency assessment pathway now.", "تعامل مع الحالة كتدهور حساس للوقت وفعّل الآن مسار تقييم الأورام أو الطوارئ المعتمد."), 100, "safe", bi("Correct: fever with systemic symptoms after myelosuppressive treatment requires urgent assessment.", "صحيح: تتطلب الحمى مع أعراض جهازية بعد علاج مثبط لنخاع العظم تقييماً عاجلاً."), bi("Fever and rigors after myelosuppressive anticancer therapy may indicate neutropenic sepsis. Urgent assessment must not wait for a neutrophil-count result or the next appointment.", "قد تشير الحمى والقشعريرة الشديدة بعد علاج مضاد للسرطان ومثبط لنخاع العظم إلى إنتان نقص العدلات. يجب ألا ينتظر التقييم العاجل نتيجة العد المطلق للعدلات أو الموعد التالي."), "oncology-deterioration"),
          choice("oncology-recognise-b", bi("Advise the patient to sleep and call again tomorrow if the fever continues.", "انصح المريض بالنوم والاتصال غداً إذا استمرت الحمى."), 0, "unsafe", bi("Unsafe: waiting may delay assessment of a rapidly progressive infection.", "غير آمن: قد يؤخر الانتظار تقييم عدوى سريعة التقدم."), bi("Recent cancer treatment changes the risk context; systemic symptoms need urgent assessment.", "يغير علاج السرطان الحديث سياق الخطر؛ وتحتاج الأعراض الجهازية إلى تقييم عاجل."), "oncology-deterioration"),
          choice("oncology-recognise-c", bi("Suggest taking leftover antibiotics before any assessment.", "اقترح تناول مضاد حيوي متبقٍ قبل أي تقييم."), 0, "unsafe", bi("Unsafe: unverified medication can obscure assessment and is outside a safe authorised pathway.", "غير آمن: قد يحجب الدواء غير المتحقق منه التقييم ويقع خارج مسار معتمد وآمن."), bi("Activate the authorised urgent pathway rather than recommend unsupervised treatment.", "فعّل المسار العاجل المعتمد بدلاً من التوصية بعلاج دون إشراف."), "oncology-deterioration"),
        ],
      },
      {
        id: "oncology-escalate",
        time: "04:00",
        narrative: bi("The patient arrives for urgent assessment and now appears pale, dizzy and slower to answer than during the call.", "يصل المريض للتقييم العاجل ويبدو الآن شاحباً ودوّاراً وأبطأ في الإجابة مما كان عليه أثناء الاتصال."),
        vitals: [
          vital("Heart rate", "معدل القلب", 124, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 28, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "92/56", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Confused", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What is the priority now?", "ما الأولوية الآن؟"),
        choices: [
          choice("oncology-escalate-a", bi("Activate the emergency deterioration response, complete a structured assessment and support the authorised sepsis pathway without delay.", "فعّل استجابة التدهور الطارئ، وأكمل تقييماً منظماً، وادعم مسار الإنتان المعتمد دون تأخير."), 100, "safe", bi("Correct: hypotension and altered mentation indicate escalating physiological risk.", "صحيح: يدل انخفاض الضغط وتغير الوعي على خطر فسيولوجي متصاعد."), bi("Immediate coordinated assessment and escalation take priority; treatment proceeds under the approved pathway.", "يحظى التقييم والتصعيد المنسقان فوراً بالأولوية؛ ويستمر العلاج وفق المسار المعتمد."), "sepsis-escalation"),
          choice("oncology-escalate-b", bi("Ask the patient to complete registration paperwork before reassessment.", "اطلب من المريض إكمال أوراق التسجيل قبل إعادة التقييم."), 0, "unsafe", bi("Unsafe: administrative work must not delay response to deterioration.", "غير آمن: يجب ألا تؤخر الإجراءات الإدارية الاستجابة للتدهور."), bi("Changes in perfusion and mentation require immediate clinical action.", "تتطلب تغيرات الإرواء والوعي إجراءً سريرياً فورياً."), "sepsis-escalation"),
          choice("oncology-escalate-c", bi("Repeat the temperature only and wait for the scheduled medical round.", "أعد قياس الحرارة فقط وانتظر الجولة الطبية المجدولة."), 0, "unsafe", bi("Unsafe: the risk is multidomain and already worsening.", "غير آمن: الخطر متعدد الجوانب ويتفاقم بالفعل."), bi("A single observation cannot safely contain hypotension, tachypnoea and altered mentation.", "لا يمكن لمشاهدة واحدة احتواء انخفاض الضغط وتسارع التنفس وتغير الوعي بأمان."), "sepsis-escalation"),
        ],
      },
      {
        id: "oncology-reassess",
        time: "08:00",
        narrative: bi("The emergency pathway is active. Blood pressure has improved slightly, but the patient remains drowsy and breathing is still rapid.", "تم تفعيل المسار الطارئ. تحسن ضغط الدم قليلاً، لكن المريض ما يزال نعساً والتنفس ما يزال سريعاً."),
        vitals: [
          vital("Heart rate", "معدل القلب", 114, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 26, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "98/60", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Responds to voice", "AVPU", "مقياس AVPU"),
        ],
        question: bi("Which follow-up is most appropriate?", "أي متابعة هي الأنسب؟"),
        choices: [
          choice("oncology-reassess-a", bi("Continue frequent multidomain reassessment and report the persistent abnormalities and trend to the response team.", "استمر في إعادة التقييم المتكرر متعدد الجوانب وأبلغ فريق الاستجابة بالشذوذ المستمر واتجاه الحالة."), 100, "safe", bi("Correct: partial improvement does not end the need for close reassessment.", "صحيح: لا ينهي التحسن الجزئي الحاجة إلى إعادة تقييم لصيقة."), bi("Trending breathing, circulation and mentation helps determine response and the need for further escalation.", "تساعد متابعة اتجاه التنفس والدوران والوعي في تحديد الاستجابة والحاجة إلى مزيد من التصعيد."), "reassessment"),
          choice("oncology-reassess-b", bi("Return to routine observation intervals because the blood pressure increased.", "عُد إلى فواصل المراقبة الروتينية لأن ضغط الدم ارتفع."), 0, "unsafe", bi("Unsafe: persistent drowsiness and tachypnoea still indicate unresolved risk.", "غير آمن: ما يزال النعاس وتسارع التنفس يدلان على خطر غير محسوم."), bi("One improving value should be interpreted within the whole trend, not in isolation.", "ينبغي تفسير تحسن قيمة واحدة ضمن الاتجاه الكامل لا بمعزل عنه."), "reassessment"),
          choice("oncology-reassess-c", bi("Avoid documenting the changes until the final diagnosis is known.", "تجنب توثيق التغيرات حتى يُعرف التشخيص النهائي."), 0, "unsafe", bi("Unsafe: delayed documentation can disrupt continuity and response.", "غير آمن: قد يعطل تأخر التوثيق استمرارية الرعاية والاستجابة."), bi("Record observations, actions and response as they occur, including uncertainty and pending evaluation.", "وثّق المشاهدات والإجراءات والاستجابة عند حدوثها، بما في ذلك عدم اليقين والتقييم المعلق."), "reassessment"),
        ],
      },
    ],
  },
  {
    id: "perioperative-verification-pause",
    title: bi("Pause Before the Procedure", "توقف قبل الإجراء"),
    summary: bi(
      "A laterality mismatch appears during preparation, testing verification, respectful speaking up and safe near-miss learning.",
      "يظهر اختلاف في جهة الإجراء أثناء التحضير، ما يختبر التحقق والتحدث باحترام والتعلم الآمن من الحادثة الوشيكة.",
    ),
    departmentId: "perioperative",
    department: bi("Perioperative Care", "الرعاية المحيطة بالجراحة"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("procedure-verification", "Procedure verification", "التحقق من الإجراء"),
      competency("speak-up-escalation", "Safety speaking up", "التحدث من أجل السلامة"),
      competency("near-miss-learning", "Near-miss learning", "التعلم من الحادثة الوشيكة"),
    ],
    referenceIds: ["who-patient-safety-2021", "spsc-standards-2026", "spsc-resources-2026", "scfhs-scope-2023"],
    steps: [
      {
        id: "perioperative-identify",
        time: "00:00",
        narrative: bi("During pre-procedure verification, the schedule lists the left side while the consent and the alert patient identify the right side.", "أثناء التحقق قبل الإجراء، يذكر الجدول الجهة اليسرى بينما تحدد الموافقة والمريض الواعي الجهة اليمنى."),
        vitals: [
          vital("Heart rate", "معدل القلب", 86, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 17, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "132/78", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What is the best first action?", "ما أفضل إجراء أول؟"),
        choices: [
          choice("perioperative-identify-a", bi("Stop preparation and initiate the approved discrepancy-resolution and verification process with the team.", "أوقف التحضير وابدأ آلية حل الاختلاف والتحقق المعتمدة مع الفريق."), 100, "safe", bi("Correct: conflicting identifiers require a formal pause before the procedure continues.", "صحيح: تتطلب المعرفات المتعارضة توقفاً رسمياً قبل استمرار الإجراء."), bi("No single document should be informally corrected; the team must reconcile identity, procedure and site through the approved process.", "لا ينبغي تصحيح أي وثيقة بصورة غير رسمية؛ بل يجب على الفريق مطابقة الهوية والإجراء والموضع وفق الآلية المعتمدة."), "procedure-verification"),
          choice("perioperative-identify-b", bi("Change the schedule to match the consent and continue alone.", "غيّر الجدول ليتطابق مع الموافقة واستمر بمفردك."), 0, "unsafe", bi("Unsafe: unilateral alteration bypasses team verification.", "غير آمن: يتجاوز التعديل المنفرد تحقق الفريق."), bi("A discrepancy must be resolved transparently using source documents and the authorised process.", "يجب حل الاختلاف بشفافية باستخدام الوثائق الأصلية والآلية المعتمدة."), "procedure-verification"),
          choice("perioperative-identify-c", bi("Continue because the patient appears certain, then ask the circulating nurse to correct every conflicting record after the procedure.", "استمر لأن المريض يبدو متأكداً، ثم اطلب من ممرض الدوران تصحيح جميع السجلات المتعارضة بعد انتهاء الإجراء بالكامل."), 0, "unsafe", bi("Unsafe: patient input is essential but does not replace the complete verification process.", "غير آمن: إفادة المريض أساسية لكنها لا تستبدل عملية التحقق الكاملة."), bi("All required elements must agree before proceeding.", "يجب أن تتطابق جميع العناصر المطلوبة قبل المتابعة."), "procedure-verification"),
        ],
      },
      {
        id: "perioperative-speak-up",
        time: "03:00",
        narrative: bi("A colleague says the list is probably a clerical error and asks the nurse to continue while the next case is waiting.", "يقول زميل إن القائمة على الأرجح تحتوي خطأ كتابياً ويطلب من الممرض الاستمرار لأن الحالة التالية تنتظر."),
        vitals: [
          vital("Heart rate", "معدل القلب", 90, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 18, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "136/80", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi("How should the nurse respond?", "كيف ينبغي أن يستجيب الممرض؟"),
        choices: [
          choice("perioperative-speak-up-a", bi("Maintain the pause, state the unresolved safety concern clearly and escalate through the local chain until verification is complete.", "حافظ على التوقف، واذكر مخاوف السلامة غير المحسومة بوضوح، وصعّد عبر التسلسل المحلي حتى يكتمل التحقق."), 100, "safe", bi("Correct: schedule pressure does not override an unresolved verification failure.", "صحيح: لا يتغلب ضغط الجدول على إخفاق تحقق غير محسوم."), bi("Respectful, specific speaking up and closed-loop escalation protect the patient and the team.", "يحمي التحدث المحترم والمحدد والتصعيد بحلقة مغلقة المريض والفريق."), "speak-up-escalation"),
          choice("perioperative-speak-up-b", bi("Proceed silently and mention the concern after the procedure.", "استمر بصمت واذكر المخاوف بعد الإجراء."), 0, "unsafe", bi("Unsafe: reporting afterward cannot prevent a wrong-site event.", "غير آمن: لا يستطيع الإبلاغ بعد الإجراء منع حدث في الموضع الخطأ."), bi("The concern must be resolved before the irreversible step.", "يجب حل المخاوف قبل الخطوة غير القابلة للتراجع."), "speak-up-escalation"),
          choice("perioperative-speak-up-c", bi("Argue about who entered the schedule instead of maintaining the safety pause.", "جادل حول من أدخل الجدول بدلاً من الحفاظ على توقف السلامة."), 20, "gap", bi("Blame distracts from the immediate verification task.", "يصرف اللوم الانتباه عن مهمة التحقق الفورية."), bi("First contain the risk and reconcile the facts; system learning follows after safety is restored.", "احتوِ الخطر أولاً وطابق الحقائق؛ ثم يأتي التعلم من النظام بعد استعادة السلامة."), "speak-up-escalation"),
        ],
      },
      {
        id: "perioperative-close-loop",
        time: "07:00",
        narrative: bi("The discrepancy is formally resolved and the team repeats the complete verification before proceeding.", "حُل الاختلاف رسمياً وأعاد الفريق التحقق الكامل قبل المتابعة."),
        vitals: [
          vital("Heart rate", "معدل القلب", 82, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 16, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "130/76", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What best completes the nursing response?", "ما الذي يكمل الاستجابة التمريضية على أفضل وجه؟"),
        choices: [
          choice("perioperative-close-loop-a", bi("Document the verified resolution and submit the near-miss through the approved learning system without altering the clinical record.", "وثّق الحل المتحقق منه وقدّم الحادثة الوشيكة عبر نظام التعلم المعتمد دون تغيير السجل السريري."), 100, "safe", bi("Correct: factual documentation and system reporting support continuity and prevention.", "صحيح: يدعم التوثيق الواقعي والإبلاغ النظامي الاستمرارية والوقاية."), bi("A near-miss should produce traceable learning while the health record remains accurate and clinically relevant.", "ينبغي أن تنتج الحادثة الوشيكة تعلماً قابلاً للتتبع مع بقاء السجل الصحي دقيقاً ومرتبطاً بالرعاية."), "near-miss-learning"),
          choice("perioperative-close-loop-b", bi("Delete the original schedule entry so no discrepancy is visible.", "احذف إدخال الجدول الأصلي حتى لا يظهر الاختلاف."), 0, "unsafe", bi("Unsafe: removing the trace undermines auditability and learning.", "غير آمن: يضعف إزالة الأثر قابلية التدقيق والتعلم."), bi("Corrections and reports must follow authorised, traceable processes.", "يجب أن تتبع التصحيحات والبلاغات إجراءات معتمدة وقابلة للتتبع."), "near-miss-learning"),
          choice("perioperative-close-loop-c", bi("Avoid reporting because no harm reached the patient.", "تجنب الإبلاغ لأن الضرر لم يصل إلى المريض."), 20, "gap", bi("A near-miss still reveals a preventable system weakness.", "تكشف الحادثة الوشيكة مع ذلك ضعفاً نظامياً قابلاً للوقاية."), bi("Learning systems use near-misses to reduce recurrence without waiting for harm.", "تستخدم أنظمة التعلم الحوادث الوشيكة لتقليل التكرار دون انتظار وقوع الضرر."), "near-miss-learning"),
        ],
      },
    ],
  },
  {
    id: "home-care-medication-reconciliation",
    title: bi("Two Lists, One Safe Plan", "قائمتان وخطة آمنة واحدة"),
    summary: bi(
      "A home visit uncovers conflicting medicine lists, dizziness and a need for verified reconciliation and teach-back.",
      "تكشف زيارة منزلية عن قائمتين دوائيتين متعارضتين ودوار وحاجة إلى مطابقة متحققة وتعليم بطريقة الاسترجاع.",
    ),
    departmentId: "home-community",
    department: bi("Home and Community Care", "الرعاية المنزلية والمجتمعية"),
    difficultyId: "intermediate",
    difficulty: bi("Intermediate", "متوسط"),
    durationMinutes: 8,
    duration: bi("8 minutes", "8 دقائق"),
    competencies: [
      competency("medication-reconciliation", "Medication reconciliation", "مطابقة الأدوية"),
      competency("mobility-safety", "Immediate home safety", "السلامة المنزلية الفورية"),
      competency("teach-back", "Teach-back and shared planning", "الاسترجاع التعليمي والتخطيط المشترك"),
    ],
    referenceIds: ["who-medication-safety-2024", "spsc-resources-2026", "spsc-standards-2026", "scfhs-scope-2023"],
    steps: [
      {
        id: "home-medication-compare",
        time: "00:00",
        narrative: bi("At a post-discharge home visit, the printed discharge list conflicts with two medicine bottles, and the patient is unsure which instructions are current.", "في زيارة منزلية بعد الخروج، تتعارض قائمة الخروج المطبوعة مع عبوتين دوائيتين، ولا يعرف المريض أي التعليمات هي الحالية."),
        vitals: [
          vital("Heart rate", "معدل القلب", 78, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 16, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "118/70", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What is the safest first action?", "ما الإجراء الأول الأكثر أماناً؟"),
        choices: [
          choice("home-medication-compare-a", bi("Pause assumptions, collect the available lists and containers, and verify the intended regimen through the authorised prescriber or pharmacy pathway.", "أوقف الافتراضات، واجمع القوائم والعبوات المتاحة، وتحقق من الخطة المقصودة عبر مسار الواصف أو الصيدلية المعتمد."), 100, "safe", bi("Correct: reconciliation resolves discrepancies before new instructions are given.", "صحيح: تحل المطابقة الاختلافات قبل إعطاء تعليمات جديدة."), bi("The nurse gathers the best available history, identifies discrepancies and uses an authorised source to confirm the plan.", "يجمع الممرض أفضل تاريخ متاح ويحدد الاختلافات ويستخدم مصدراً معتمداً لتأكيد الخطة."), "medication-reconciliation"),
          choice("home-medication-compare-b", bi("Choose the newest-looking bottle and tell the patient to discard the rest.", "اختر العبوة الأحدث شكلاً واطلب من المريض التخلص من البقية."), 0, "unsafe", bi("Unsafe: appearance cannot establish the intended regimen.", "غير آمن: لا يثبت شكل العبوة الخطة المقصودة."), bi("Unverified disposal or dosing advice can remove needed medicine or continue a duplicate.", "قد يؤدي التخلص أو توجيه الجرعات دون تحقق إلى إزالة دواء مطلوب أو استمرار تكرار دوائي."), "medication-reconciliation"),
          choice("home-medication-compare-c", bi("Copy both lists into the note, leave every container in use and postpone verification until the next scheduled home visit.", "انسخ القائمتين في الملاحظة، واترك جميع العبوات قيد الاستخدام، وأجّل التحقق حتى الزيارة المنزلية المجدولة التالية من دون خطة مؤقتة."), 20, "delay", bi("Documentation alone does not resolve a current medication risk.", "لا يحل التوثيق وحده خطراً دوائياً قائماً."), bi("The discrepancy needs timely verification, communication and a clear interim safety plan.", "يحتاج الاختلاف إلى تحقق وتواصل وخطة سلامة مؤقتة واضحة في الوقت المناسب."), "medication-reconciliation"),
        ],
      },
      {
        id: "home-medication-dizziness",
        time: "03:00",
        narrative: bi("While the nurse is arranging verification, the patient stands, becomes dizzy and reaches for an unstable chair.", "أثناء ترتيب الممرض للتحقق، يقف المريض ويشعر بالدوار ويمد يده نحو كرسي غير ثابت."),
        vitals: [
          vital("Heart rate", "معدل القلب", 92, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 18, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "102/64", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert, dizzy", "AVPU", "مقياس AVPU"),
        ],
        question: bi("What is the immediate priority?", "ما الأولوية الفورية؟"),
        choices: [
          choice("home-medication-dizziness-a", bi("Support the patient to a safe seated position, assess the change and escalate according to the home-care pathway while maintaining supervision.", "ادعم المريض للجلوس بأمان، وقيّم التغير، وصعّد وفق مسار الرعاية المنزلية مع استمرار الإشراف."), 100, "safe", bi("Correct: immediate fall prevention and assessment come before finishing the list.", "صحيح: تسبق الوقاية الفورية من السقوط وتقييم الحالة إكمال القائمة."), bi("The response contains the immediate environmental risk and evaluates whether the symptom reflects deterioration or medication-related harm.", "تحتوي الاستجابة الخطر البيئي الفوري وتقيّم ما إذا كان العرض يعكس تدهوراً أو ضرراً مرتبطاً بالدواء."), "mobility-safety"),
          choice("home-medication-dizziness-b", bi("Ask the patient to walk across the room so the dizziness can be observed.", "اطلب من المريض المشي عبر الغرفة حتى يمكن ملاحظة الدوار."), 0, "unsafe", bi("Unsafe: walking increases an active fall risk.", "غير آمن: يزيد المشي خطر سقوط قائم."), bi("First stabilise the situation and assess safely; do not provoke the hazard.", "ثبّت الموقف أولاً وقيّم بأمان؛ ولا تستحث الخطر."), "mobility-safety"),
          choice("home-medication-dizziness-c", bi("Continue the phone call and ask the patient to sit down independently.", "استمر في المكالمة واطلب من المريض الجلوس بمفرده."), 25, "gap", bi("Verbal direction alone may not prevent a fall already in progress.", "قد لا يمنع التوجيه اللفظي وحده سقوطاً بدأ بالفعل."), bi("Direct support and supervision are required before other tasks resume.", "يلزم الدعم المباشر والإشراف قبل استئناف المهام الأخرى."), "mobility-safety"),
        ],
      },
      {
        id: "home-medication-teach-back",
        time: "07:00",
        narrative: bi("The authorised team confirms a single updated medication list and a follow-up plan. The patient says, “I think I understand.”", "يؤكد الفريق المعتمد قائمة دوائية واحدة محدثة وخطة متابعة. يقول المريض: «أعتقد أنني فهمت»."),
        vitals: [
          vital("Heart rate", "معدل القلب", 82, "bpm", "نبضة/دقيقة"),
          vital("Respiratory rate", "معدل التنفس", 16, "/min", "/دقيقة"),
          vital("Blood pressure", "ضغط الدم", "112/68", "mmHg", "ملم زئبق"),
          vital("Consciousness", "الوعي", "Alert", "AVPU", "مقياس AVPU"),
        ],
        question: bi("How should the nurse close the visit?", "كيف ينبغي أن ينهي الممرض الزيارة؟"),
        choices: [
          choice("home-medication-teach-back-a", bi("Review the verified list in plain language, ask the patient to explain the plan back, correct gaps and leave the approved contact and follow-up instructions.", "راجع القائمة المتحققة بلغة واضحة، واطلب من المريض شرح الخطة بأسلوبه، وصحح الفجوات، واترك بيانات التواصل وتعليمات المتابعة المعتمدة."), 100, "safe", bi("Correct: teach-back checks understanding without testing or blaming the patient.", "صحيح: يتحقق الاسترجاع التعليمي من الفهم دون اختبار المريض أو لومه."), bi("A shared, verified plan and clear escalation route reduce discrepancies after the nurse leaves.", "تقلل الخطة المشتركة المتحققة ومسار التصعيد الواضح الاختلافات بعد مغادرة الممرض."), "teach-back"),
          choice("home-medication-teach-back-b", bi("Ask only, “Do you understand?” and accept yes as proof.", "اسأل فقط: «هل فهمت؟» واعتبر الإجابة بنعم دليلاً."), 30, "gap", bi("A yes-or-no question does not demonstrate how the plan will be followed.", "لا يوضح سؤال نعم أو لا كيف ستُتبع الخطة."), bi("Teach-back reveals misunderstandings that polite agreement may hide.", "يكشف الاسترجاع التعليمي سوء الفهم الذي قد تخفيه الموافقة المجاملة."), "teach-back"),
          choice("home-medication-teach-back-c", bi("Leave both old and updated lists active so the patient can choose later.", "اترك القائمتين القديمة والمحدثة فعالتين ليختار المريض لاحقاً."), 0, "unsafe", bi("Unsafe: conflicting active instructions recreate the original risk.", "غير آمن: تعيد التعليمات النشطة المتعارضة الخطر الأصلي."), bi("The verified plan must be unambiguous, with safe handling of superseded materials according to local policy.", "يجب أن تكون الخطة المتحققة غير ملتبسة، مع التعامل الآمن مع المواد المستبدلة وفق السياسة المحلية."), "teach-back"),
        ],
      },
    ],
  },
];

const unsafeChoicesWithCredit = authoredScenarios.flatMap((scenario) =>
  scenario.steps.flatMap((step) =>
    step.choices
      .filter((candidate) => candidate.classification === "unsafe" && candidate.score !== 0)
      .map((candidate) => `${scenario.id}/${step.id}/${candidate.id}`),
  ),
);

if (unsafeChoicesWithCredit.length > 0) {
  throw new Error(
    `Unsafe scenario choices must have a zero score: ${unsafeChoicesWithCredit.join(", ")}`,
  );
}

function buildContextVariants(scenario) {
  return [
    {
      id: `${scenario.id}-structured-handover`,
      label: bi("Structured handover", "تسليم منظم"),
      setup: bi(
        `You receive this fictional ${scenario.department.en.toLowerCase()} case during a structured daytime handover. The draft clinical cues and best-response logic remain unchanged.`,
        `تستلم هذه الحالة الخيالية في ${scenario.department.ar} أثناء تسليم نهاري منظم. تبقى المؤشرات السريرية الأولية ومنطق أفضل استجابة دون تغيير.`,
      ),
      changes: [
        { id: "shift", label: bi("Shift context", "سياق المناوبة"), value: bi("Day shift", "مناوبة نهارية") },
        { id: "information", label: bi("Information flow", "تدفق المعلومات"), value: bi("Bedside handover", "تسليم عند نقطة الرعاية") },
      ],
    },
    {
      id: `${scenario.id}-after-hours-escalation`,
      label: bi("After-hours escalation", "تصعيد خارج ساعات الذروة"),
      setup: bi(
        `You meet the same fictional ${scenario.department.en.toLowerCase()} learning case after hours, with information arriving through a brief escalation call. Scoring and the draft decision sequence remain unchanged.`,
        `تواجه حالة التعلم الخيالية نفسها في ${scenario.department.ar} خارج ساعات الذروة، وتصل المعلومات عبر اتصال تصعيد مختصر. تبقى الدرجات وتسلسل القرار الأولي دون تغيير.`,
      ),
      changes: [
        { id: "shift", label: bi("Shift context", "سياق المناوبة"), value: bi("After hours", "خارج ساعات الذروة") },
        { id: "information", label: bi("Information flow", "تدفق المعلومات"), value: bi("Escalation call", "اتصال تصعيد") },
      ],
    },
  ];
}

export function selectScenarioVariant(scenario, seed = "default") {
  const variants = Array.isArray(scenario?.contextVariants) ? scenario.contextVariants : [];
  if (!variants.length) return null;
  let hash = 2166136261;
  for (const character of `${scenario.id}:${String(seed)}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return variants[(hash >>> 0) % variants.length];
}

export const scenarios = authoredScenarios.map((scenario) => ({
  ...scenario,
  steps: scenario.steps.map((step) => ({
    ...step,
    referenceIds: [...new Set(step.referenceIds ?? scenario.referenceIds)],
  })),
  contextVariants: buildContextVariants(scenario),
  accessTier: "free",
  fictional: true,
  reviewStatus: "draft",
  contentDraftDate: "2026-09-04",
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
  evidenceReview: { status: "pending-claim-mapping", nextReviewDueAt: null },
  reviewLabel: bi(
    "Draft — pending clinical, legal and Arabic-language review.",
    "مسودة — بانتظار المراجعة السريرية والقانونية واللغوية العربية.",
  ),
  contentVersion: "1.1.0",
}));
