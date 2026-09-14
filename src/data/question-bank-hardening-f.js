// Bilingual distractor overrides for a focused difficulty-hardening pass.
// Each entry preserves the existing keyed answer and replaces distractors only:
// [English option, Arabic option, English rationale, Arabic rationale].
export const harderDistractorDataF = {
  "saudi-nursing-management-near-miss-015": {
    b: [
      "Confirm safety and document the interruption in the medication record, but omit a separate safety report.",
      "أكد السلامة ووثّق إيقاف العملية في سجل الدواء، لكن لا ترفع بلاغ سلامة منفصلاً.",
      "Clinical documentation can preserve the immediate facts, but it does not replace the approved near-miss report needed for system learning and prevention.",
      "قد يحفظ التوثيق السريري الوقائع الفورية، لكنه لا يستبدل بلاغ الخطأ الوشيك المعتمد اللازم للتعلم على مستوى النظام ومنع التكرار.",
    ],
    c: [
      "Notify the shift leader verbally and review the identity check, without entering the event in the approved reporting system.",
      "أبلغ قائد المناوبة شفهياً وراجع التحقق من الهوية، دون إدخال الحدث في نظام الإبلاغ المعتمد.",
      "Verbal escalation and local review are useful, but omitting the formal report limits traceability, trend analysis, and broader corrective action.",
      "يفيد التصعيد الشفهي والمراجعة المحلية، لكن إغفال البلاغ الرسمي يحد من التتبع وتحليل الأنماط واتخاذ إجراءات تصحيحية أوسع.",
    ],
    d: [
      "Submit an incident report naming the administering nurse as the primary cause, then reinforce individual checking.",
      "ارفع بلاغ حادث يحدد الممرض القائم بالإعطاء سبباً رئيسياً، ثم عزز التحقق الفردي.",
      "Reporting is appropriate, but assigning the event primarily to one person can obscure workflow and system contributors that require review.",
      "الإبلاغ مناسب، لكن إرجاع الحدث أساساً إلى شخص واحد قد يحجب عوامل سير العمل والنظام التي تحتاج إلى مراجعة.",
    ],
  },
  "international-health-promotion-folic-acid-059": {
    b: [
      "Begin folic acid after pregnancy is confirmed and continue through early pregnancy because supplementation is most relevant then.",
      "ابدأ حمض الفوليك بعد تأكيد الحمل واستمر خلال بدايته لأن المكمل يكون أكثر أهمية حينها.",
      "Starting after pregnancy confirmation can miss the preconception and very early developmental period when adequate folate status is particularly important.",
      "قد يفوّت البدء بعد تأكيد الحمل فترة ما قبل الحمل والتطور المبكر جداً التي تكون فيها كفاية الفولات مهمة بوجه خاص.",
    ],
    c: [
      "Use dietary folate before conception and reserve folic acid supplements for an identified deficiency.",
      "اعتمد على الفولات الغذائي قبل الحمل، واقصر مكملات حمض الفوليك على وجود نقص مثبت.",
      "Dietary folate is valuable, but an identified deficiency is not required for the routine supplementation recommended to anyone who could become pregnant.",
      "الفولات الغذائي مفيد، لكن وجود نقص مثبت ليس شرطاً للمكمل الروتيني الموصى به لكل من يمكنها الحمل.",
    ],
    d: [
      "Start folic acid before pregnancy, then stop it when the first positive pregnancy test is obtained.",
      "ابدأ حمض الفوليك قبل الحمل، ثم أوقفه عند ظهور أول اختبار حمل إيجابي.",
      "Preconception use is appropriate, but stopping at pregnancy confirmation omits continued supplementation during the early pregnancy period specified in the teaching.",
      "الاستخدام قبل الحمل مناسب، لكن إيقافه عند تأكيد الحمل يهمل استمرار المكمل خلال مرحلة الحمل المبكرة المحددة في التثقيف.",
    ],
  },
  "saudi-nursing-maternal-postpartum-hypertension-086": {
    a: [
      "Place her in a quiet room, repeat blood pressure after rest, and escalate only if severe readings persist.",
      "ضعها في غرفة هادئة، وأعد قياس الضغط بعد الراحة، وصعّد الحالة فقط إذا استمرت القراءات الشديدة.",
      "Reducing stimulation and confirming measurements can accompany care, but severe hypertension with neurological symptoms already requires urgent escalation and seizure-safety action.",
      "يمكن أن يتزامن تقليل التحفيز وتأكيد القياسات مع الرعاية، لكن ارتفاع الضغط الشديد المصحوب بأعراض عصبية يستلزم بالفعل تصعيداً عاجلاً وتدابير سلامة من التشنجات.",
    ],
    b: [
      "Contact the clinician urgently, then gather a complete history while leaving protocol activation and seizure precautions for the clinician to initiate.",
      "تواصل مع الممارس السريري عاجلاً، ثم اجمع تاريخاً كاملاً مع ترك تفعيل البروتوكول واحتياطات التشنجات ليبدأها الممارس.",
      "Urgent communication is appropriate, but it does not replace the nurse's concurrent safety measures, monitoring, and coordinated protocol activation for this high-risk presentation.",
      "التواصل العاجل مناسب، لكنه لا يستبدل تدابير السلامة والمراقبة والتفعيل المنسق للبروتوكول التي يبدأها الممرض بالتزامن لهذه الحالة عالية الخطورة.",
    ],
    d: [
      "Begin seizure-safety measures and repeat observations, but route escalation through the routine postnatal review service.",
      "ابدأ تدابير سلامة التشنجات وأعد العلامات الحيوية، لكن وجّه التصعيد عبر خدمة مراجعة ما بعد الولادة الروتينية.",
      "Safety measures and reassessment are useful, but the severe reading and neurological symptoms require an urgent hypertension response rather than a routine review route.",
      "تدابير السلامة وإعادة التقييم مفيدان، لكن القراءة الشديدة والأعراض العصبية تتطلب استجابة عاجلة لارتفاع الضغط لا مسار مراجعة روتينياً.",
    ],
  },
  "saudi-nursing-adult-medication-transition-051": {
    a: [
      "Explain that the inpatient stop entry may be temporary and teach from the new home list while seeking clarification.",
      "اشرح أن إيقاف الدواء أثناء التنويم قد يكون مؤقتاً، وابدأ التثقيف من قائمة المنزل الجديدة أثناء طلب الاستيضاح.",
      "Seeking clarification is appropriate, but teaching from a discrepant list before reconciliation can reinforce an unsafe or inaccurate discharge regimen.",
      "طلب الاستيضاح مناسب، لكن التثقيف من قائمة متعارضة قبل المطابقة قد يعزز نظام أدوية خروج غير آمن أو غير دقيق.",
    ],
    b: [
      "Compare both lists with the preadmission medicines, remove the stopped medicine from the home list, and document the reconciliation.",
      "قارن القائمتين بأدوية ما قبل التنويم، واحذف الدواء الموقوف من قائمة المنزل، ثم وثّق المطابقة.",
      "Comparison supports reconciliation, but the nurse should not resolve an unexplained stop-versus-continue discrepancy independently without authorised prescriber or pharmacist clarification.",
      "تدعم المقارنة مطابقة الأدوية، لكن لا ينبغي للممرض حسم تعارض غير مفسر بين الإيقاف والاستمرار بصورة مستقلة دون استيضاح مخول من الواصف أو الصيدلي.",
    ],
    d: [
      "Ask which medicine the client took before admission and retain that choice on the discharge list pending follow-up.",
      "اسأل المريض عن الدواء الذي كان يتناوله قبل التنويم، وأبقِ اختياره في قائمة الخروج حتى المتابعة.",
      "The client's history is important evidence, but it cannot by itself authorise the final list when current records contain an unresolved discrepancy.",
      "يمثل تاريخ المريض دليلاً مهماً، لكنه لا يخول وحده اعتماد القائمة النهائية عندما تتضمن السجلات الحالية تعارضاً غير محسوم.",
    ],
  },
  "saudi-nursing-adult-stroke-swallow-074": {
    a: [
      "Keep the client upright and offer a teaspoon of water as an informal tolerance check before arranging the approved screen.",
      "أبقِ المريض جالساً وقدّم ملعقة صغيرة من الماء كاختبار تحمل غير رسمي قبل ترتيب الفحص المعتمد.",
      "Positioning and observation may reduce or reveal risk, but an informal water trial exposes the client before the approved swallow screen is completed.",
      "قد تقلل الوضعية والمراقبة الخطر أو تكشفانه، لكن تجربة الماء غير الرسمية تعرض المريض للخطر قبل إكمال فحص البلع المعتمد.",
    ],
    b: [
      "Arrange the approved swallow screen, but permit small sips of the requested water because the client remains alert.",
      "رتّب فحص البلع المعتمد، لكن اسمح برشفات صغيرة من الماء المطلوب لأن المريض ما زال يقظاً.",
      "Arranging the screen is appropriate, but alertness alone does not establish swallowing safety or justify oral intake before screening.",
      "ترتيب الفحص مناسب، لكن اليقظة وحدها لا تثبت سلامة البلع ولا تبرر التناول الفموي قبل إكمال الفحص.",
    ],
    d: [
      "Assess alertness, facial movement, and voluntary cough, then permit water if these findings are normal.",
      "قيّم اليقظة وحركة الوجه والسعال الإرادي، ثم اسمح بالماء إذا كانت هذه النتائج طبيعية.",
      "These observations contribute useful neurological information, but normal findings do not substitute for the approved swallow screen after acute stroke.",
      "تضيف هذه الملاحظات معلومات عصبية مفيدة، لكن النتائج الطبيعية لا تستبدل فحص البلع المعتمد بعد السكتة الحادة.",
    ],
  },
  "saudi-nursing-adult-type1-npo-insulin-075": {
    a: [
      "Follow the hold-all instruction during fasting, continue glucose monitoring, and request clarification at the scheduled pre-procedure review.",
      "اتبع توجيه إيقاف جميع الإنسولين أثناء الصيام، واستمر في مراقبة السكر، واطلب الاستيضاح عند المراجعة المجدولة قبل الإجراء.",
      "Monitoring is appropriate, but following the ambiguous instruction while deferring clarification can leave a person with type 1 diabetes without required basal coverage.",
      "مراقبة السكر مناسبة، لكن اتباع التوجيه الملتبس مع تأخير الاستيضاح قد يترك المصاب بالسكري من النوع الأول دون تغطية قاعدية لازمة.",
    ],
    c: [
      "Interpret the instruction as applying only to meal-related insulin and continue the documented basal plan without clarification.",
      "فسّر التوجيه بأنه يخص إنسولين الوجبات فقط، واستمر في الخطة القاعدية الموثقة دون استيضاح.",
      "The interpretation may resemble an appropriate fasting plan, but the nurse should not independently redefine an ambiguous instruction; prompt authorised clarification is required.",
      "قد يشبه هذا التفسير خطة صيام مناسبة، لكن لا ينبغي للممرض إعادة تعريف توجيه ملتبس بصورة مستقلة؛ ويلزم الاستيضاح المخول فوراً.",
    ],
    d: [
      "Apply the instruction to basal insulin but retain correction insulin with glucose checks, without clarifying the conflicting wording.",
      "طبّق التوجيه على الإنسولين القاعدي، لكن أبقِ الإنسولين التصحيحي مع فحوص السكر دون استيضاح الصياغة المتعارضة.",
      "Correction-only coverage does not replace the basal insulin requirement in type 1 diabetes, and selectively interpreting the instruction does not resolve its ambiguity.",
      "لا تستبدل التغطية التصحيحية وحدها الحاجة إلى الإنسولين القاعدي في السكري من النوع الأول، كما أن تفسير التوجيه انتقائياً لا يحل التباسه.",
    ],
  },
  "saudi-nursing-maternal-jaundice-053": {
    a: [
      "Confirm jaundice in natural light, document its distribution, and arrange bilirubin testing at the routine newborn review.",
      "أكد اليرقان في ضوء طبيعي ووثّق انتشاره، ورتب فحص البيليروبين في مراجعة المولود الروتينية.",
      "Visual confirmation and documentation are useful, but jaundice within the first 24 hours requires urgent bilirubin measurement and prompt medical assessment.",
      "التأكيد البصري والتوثيق مفيدان، لكن اليرقان خلال أول 24 ساعة يستلزم قياس البيليروبين عاجلاً وتقييماً طبياً سريعاً.",
    ],
    b: [
      "Measure transcutaneous bilirubin first and arrange serum measurement only if the device reading crosses the treatment threshold.",
      "قس البيليروبين عبر الجلد أولاً، ورتب قياس المصل فقط إذا تجاوزت قراءة الجهاز عتبة العلاج.",
      "For jaundice appearing in the first 24 hours, a conditional device-first pathway can delay the urgent serum measurement and medical review needed to investigate a pathological cause.",
      "عند ظهور اليرقان في أول 24 ساعة، قد يؤخر المسار المشروط الذي يبدأ بالجهاز قياس المصل العاجل والمراجعة الطبية اللازمة لاستقصاء سبب مرضي.",
    ],
    d: [
      "Assess feeding, hydration, and stool pattern, then repeat the skin examination after the next feed before escalating.",
      "قيّم الرضاعة والترطيب ونمط البراز، ثم أعد فحص الجلد بعد الرضعة التالية قبل التصعيد.",
      "Feeding and hydration assessment provides context, but it should not delay urgent bilirubin measurement and review for jaundice this early.",
      "يوفر تقييم الرضاعة والترطيب سياقاً مهماً، لكنه لا ينبغي أن يؤخر قياس البيليروبين والمراجعة العاجلين عند ظهور اليرقان بهذا العمر المبكر.",
    ],
  },
  "international-management-near-miss-057": {
    a: [
      "Document the intercepted medication in the clinical record and discuss it at handoff, without opening a safety report.",
      "وثّق الدواء الذي جرى اعتراضه في السجل السريري وناقشه عند التسليم، دون فتح بلاغ سلامة.",
      "Clinical notes and handoff may communicate immediate facts, but the approved reporting system is needed for near-miss tracking and organisational learning.",
      "قد تنقل الملاحظات السريرية والتسليم الوقائع الفورية، لكن نظام الإبلاغ المعتمد لازم لتتبع الأخطاء الوشيكة والتعلم المؤسسي.",
    ],
    b: [
      "Notify the manager verbally and correct the immediate workflow issue, leaving formal reporting for events that reach clients.",
      "أبلغ المدير شفهياً وصحح مشكلة سير العمل الفورية، واقصر البلاغ الرسمي على الأحداث التي تصل إلى المرضى.",
      "Verbal notification and local correction are helpful, but excluding intercepted events from formal reporting loses important opportunities to identify and reduce latent risk.",
      "الإبلاغ الشفهي والتصحيح المحلي مفيدان، لكن استبعاد الأحداث المعترضة من البلاغ الرسمي يفقد فرصاً مهمة لاكتشاف المخاطر الكامنة وتقليلها.",
    ],
    d: [
      "Submit the near-miss report after identifying which individual check failed, using it to assign corrective responsibility.",
      "ارفع بلاغ الخطأ الوشيك بعد تحديد التحقق الفردي الذي أخفق، واستخدمه لتعيين المسؤولية التصحيحية.",
      "The event should be reported objectively, but framing the report around individual responsibility can bias review away from contributing system conditions.",
      "ينبغي الإبلاغ عن الحدث بموضوعية، لكن بناء البلاغ حول المسؤولية الفردية قد يحرف المراجعة بعيداً عن ظروف النظام المساهمة.",
    ],
  },
  "saudi-nursing-maternal-pediatric-013": {
    a: [
      "Keep the child with the caregiver, obtain full vital signs, and activate pediatric escalation if oxygenation remains abnormal.",
      "أبقِ الطفل مع مقدم الرعاية، وخذ العلامات الحيوية كاملة، وفعّل تصعيد الأطفال إذا بقيت الأكسجة غير طبيعية.",
      "Keeping the child calm and gathering observations are useful, but the existing cyanosis, retractions, and reduced interaction already require immediate breathing support and escalation.",
      "إبقاء الطفل هادئاً وجمع العلامات مفيدان، لكن الزرقة والسحب الصدري وقلة التفاعل الحالية تستلزم بالفعل دعماً فورياً للتنفس وتصعيداً عاجلاً.",
    ],
    c: [
      "Provide positioning and calming, then complete a focused respiratory assessment before requesting pediatric emergency support.",
      "طبّق الوضعية والتهدئة، ثم أكمل تقييماً تنفسياً مركزاً قبل طلب دعم طوارئ الأطفال.",
      "Positioning, calming, and focused assessment can occur during the response, but completing them first delays skilled support for severe respiratory compromise.",
      "يمكن تنفيذ الوضعية والتهدئة والتقييم المركز أثناء الاستجابة، لكن إكمالها أولاً يؤخر الدعم المتخصص للتدهور التنفسي الشديد.",
    ],
    d: [
      "Begin available oxygen support and complete repeat observations before deciding whether pediatric emergency escalation is required.",
      "ابدأ دعم الأكسجين المتاح وأكمل إعادة العلامات الحيوية قبل تحديد الحاجة إلى تفعيل طوارئ الأطفال.",
      "Initial oxygen support may help, but repeat observations should not be a prerequisite for emergency activation when severe breathing and perfusion cues are already present.",
      "قد يساعد دعم الأكسجين الأولي، لكن إعادة العلامات الحيوية لا ينبغي أن تكون شرطاً لتفعيل الطوارئ عند وجود مؤشرات شديدة للتنفس والإرواء بالفعل.",
    ],
  },
  "saudi-nursing-management-delegate-stable-care-099": {
    a: [
      "Ask the support worker to assist a stable client with hygiene and decide whether new skin redness needs nursing review.",
      "اطلب من المساعد دعم مريض مستقر في النظافة وتحديد ما إذا كان احمرار الجلد الجديد يحتاج مراجعة تمريضية.",
      "Routine hygiene can be delegated, but deciding the significance of a new finding and the need for review requires registered-nurse assessment and judgement.",
      "يمكن تفويض النظافة الروتينية، لكن تحديد أهمية علامة جديدة والحاجة إلى المراجعة يتطلب تقييم الممرض المسجل وحكمه المهني.",
    ],
    c: [
      "Delegate routine hygiene for a stable client, including evaluating tolerance and updating the care plan when assistance needs change.",
      "فوّض النظافة الروتينية لمريض مستقر، بما يشمل تقييم تحمله وتحديث خطة الرعاية عند تغير احتياجات المساعدة.",
      "The care activity is suitable, but evaluation and care-plan revision are nursing-accountability functions that should remain with the registered nurse.",
      "نشاط الرعاية مناسب، لكن التقييم وتعديل خطة الرعاية من مسؤوليات الممرض المسجل وينبغي أن يبقيا لديه.",
    ],
    d: [
      "Ask the support worker to provide routine hygiene to a newly admitted client before the registered nurse completes the initial assessment.",
      "اطلب من المساعد تقديم النظافة الروتينية لمريض منوم حديثاً قبل أن يكمل الممرض المسجل التقييم الأولي.",
      "The task may later be appropriate, but delegation before the initial nursing assessment does not establish the client's stability, needs, or required precautions.",
      "قد تصبح المهمة مناسبة لاحقاً، لكن التفويض قبل التقييم التمريضي الأولي لا يحدد استقرار المريض أو احتياجاته أو الاحتياطات المطلوبة.",
    ],
  },
  "international-management-handoff-018": {
    a: [
      "Share the current condition and recent changes, leaving pending actions in the electronic task list for review.",
      "انقل الحالة الحالية والتغيرات الأخيرة، واترك الإجراءات المعلقة في قائمة المهام الإلكترونية للمراجعة.",
      "Current status and changes are essential, but pending actions require explicit handoff so responsibility, timing, and follow-up are understood.",
      "الحالة الراهنة والتغيرات أساسية، لكن الإجراءات المعلقة تحتاج إلى تسليم صريح حتى تتضح المسؤولية والتوقيت والمتابعة.",
    ],
    c: [
      "Report latest observations, completed care and diagnosis, leaving anticipated risks in written notes outside the verbal handoff.",
      "أبلغ شفهياً عن أحدث الملاحظات والرعاية المكتملة والتشخيص، واترك المخاطر المتوقعة في الملاحظات المكتوبة فقط.",
      "Completed care and observations provide context, but leaving known risks outside the explicit handoff can prevent the receiving nurse from prioritising them.",
      "توفر الرعاية المكتملة والملاحظات سياقاً مهماً، لكن إبقاء المخاطر المعروفة خارج التسليم الصريح قد يمنع الممرض المستلم من ترتيبها حسب الأولوية.",
    ],
    d: [
      "Share pending actions and routine care details, without identifying which changes or safety concerns need early follow-up.",
      "انقل الإجراءات المعلقة وتفاصيل الرعاية الروتينية، دون تحديد التغيرات أو مخاوف السلامة التي تحتاج متابعة مبكرة.",
      "Pending work is relevant, but an effective handoff must also prioritise recent changes and explicit safety concerns for timely attention.",
      "العمل المعلق مهم، لكن التسليم الفعال يجب أن يرتب أيضاً التغيرات الأخيرة ومخاوف السلامة الصريحة للانتباه إليها في الوقت المناسب.",
    ],
  },
};
