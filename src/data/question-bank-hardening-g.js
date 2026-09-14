// Bilingual distractor overrides for a focused difficulty-hardening pass.
// Each entry preserves the existing keyed answer and replaces distractors only:
// [English option, Arabic option, English rationale, Arabic rationale].
export const harderDistractorDataG = {
  "international-safety-sterile-field-020": {
    b: [
      "Remove and replace the wet package only, then continue with the remaining unattended field.",
      "أزل العبوة المبللة واستبدلها فقط، ثم تابع باستخدام بقية الحقل المتروك دون مراقبة.",
      "Replacing one visibly wet component does not restore the sterility of a field whose integrity is uncertain because it was also left unattended.",
      "لا يعيد استبدال الجزء المبلل ظاهرياً تعقيم حقل أصبحت سلامته غير مؤكدة لأنه تُرك أيضاً دون مراقبة.",
    ],
    c: [
      "Have a second nurse inspect the field and continue if it appears dry.",
      "اطلب من ممرض ثانٍ فحص الحقل، وتابع إذا بدا جافاً ظاهرياً.",
      "A visual check by another clinician cannot verify sterility after moisture exposure and a period without direct observation.",
      "لا يستطيع الفحص البصري من ممارس آخر إثبات التعقيم بعد التعرض للرطوبة وترك الحقل دون مراقبة مباشرة.",
    ],
    d: [
      "Cover the field while obtaining supplies, then resume after removing the damp item.",
      "غطِّ الحقل أثناء إحضار المستلزمات، ثم استأنف بعد إزالة الجزء الرطب.",
      "Covering the field and removing the damp item do not reverse contamination or resolve the loss of continuous observation.",
      "لا يؤدي تغطية الحقل وإزالة الجزء الرطب إلى عكس التلوث أو معالجة فقدان المراقبة المستمرة.",
    ],
  },
  "computerized-infection-tb-035": {
    a: [
      "Provide source control and move the client to the waiting-area corner, but complete routine triage before requesting a separate room.",
      "وفّر ضبط المصدر وانقل المريض إلى زاوية منطقة الانتظار، لكن أكمل الفرز الروتيني قبل طلب غرفة منفصلة.",
      "Source control is useful, but a corner of the same crowded area does not provide prompt separation or initiate the airborne-precaution pathway.",
      "يفيد ضبط المصدر، لكن زاوية المنطقة المزدحمة نفسها لا تحقق الفصل السريع ولا تبدأ مسار احتياطات الانتقال الهوائي.",
    ],
    c: [
      "Separate the client in an examination room and use standard precautions while asking infection prevention whether airborne precautions are required.",
      "افصل المريض في غرفة فحص واستخدم الاحتياطات القياسية أثناء سؤال فريق مكافحة العدوى عما إذا كانت الاحتياطات الهوائية مطلوبة.",
      "Prompt separation is appropriate, but suspected infectious tuberculosis warrants the facility airborne pathway now rather than precautions contingent on later confirmation.",
      "الفصل السريع مناسب، لكن الاشتباه بسل معدٍ يستلزم بدء مسار الاحتياطات الهوائية في المنشأة الآن بدلاً من ربطه بتأكيد لاحق.",
    ],
    d: [
      "Provide source control and escort the client through the department to a separate room before alerting staff to the airborne risk.",
      "وفّر ضبط المصدر واصطحب المريض عبر القسم إلى غرفة منفصلة قبل تنبيه الطاقم إلى خطر الانتقال الهوائي.",
      "Unnecessary movement before isolation planning can expose additional people and delays the infection-control pathway indicated by the presenting features.",
      "قد تعرّض الحركة غير الضرورية قبل التخطيط للعزل أشخاصاً إضافيين، وتؤخر مسار مكافحة العدوى الذي تشير إليه السمات الحالية.",
    ],
  },
  "computerized-infection-cdiff-036": {
    a: [
      "Complete routine terminal cleaning with standard disinfectant, then return dedicated equipment after wiping its handles.",
      "أكمل التنظيف النهائي الروتيني بالمطهر المعتاد، ثم أعد المعدات المخصصة بعد مسح مقابضها.",
      "Routine disinfection and a handle wipe do not complete the approved sporicidal process required for the environment and used equipment.",
      "لا يحقق التطهير الروتيني ومسح المقابض عملية القضاء على الأبواغ المعتمدة المطلوبة للبيئة والمعدات المستخدمة.",
    ],
    b: [
      "Complete sporicidal cleaning of high-touch room surfaces, then return shared equipment after disinfecting only its patient-contact surface.",
      "أكمل التنظيف القاتل للأبواغ لأسطح الغرفة كثيرة اللمس، ثم أعد المعدات المشتركة بعد تطهير سطحها الملامس للمريض فقط.",
      "Shared equipment must be fully cleaned and disinfected according to manufacturer instructions and infection-prevention policy; processing only one surface leaves other handled areas unaddressed.",
      "يجب تنظيف المعدات المشتركة وتطهيرها بالكامل وفق تعليمات الشركة المصنّعة وسياسة مكافحة العدوى؛ فتطهير سطح واحد فقط يترك الأسطح الأخرى التي تم لمسها دون معالجة.",
    ],
    d: [
      "Complete sporicidal room cleaning and quarantine reusable equipment, then release it after a visual cleanliness check.",
      "أكمل تنظيف الغرفة القاتل للأبواغ واعزل المعدات القابلة لإعادة الاستخدام، ثم أطلقها بعد فحص نظافتها بصرياً.",
      "A visual inspection cannot establish that reusable equipment has received the required infection-prevention reprocessing before use with another client.",
      "لا يثبت الفحص البصري أن المعدات القابلة لإعادة الاستخدام خضعت للمعالجة المطلوبة لمكافحة العدوى قبل استخدامها مع مريض آخر.",
    ],
  },
  "international-fundamentals-damp-sterile-pack-098": {
    a: [
      "Set the package aside until the exterior dries, then use it if the seal and indicator remain intact.",
      "ضع العبوة جانباً حتى يجف سطحها الخارجي، ثم استخدمها إذا بقي الختم والمؤشر سليمين.",
      "Drying after moisture exposure does not restore verified package integrity; an intact seal or indicator cannot exclude moisture-related contamination.",
      "لا يعيد الجفاف بعد التعرض للرطوبة سلامة العبوة الموثوقة؛ كما لا يستبعد سلامة الختم أو المؤشر التلوث المرتبط بالرطوبة.",
    ],
    b: [
      "Ask a second nurse to inspect the damp corner, then open the package from a visibly dry edge.",
      "اطلب من ممرض ثانٍ فحص الزاوية الرطبة، ثم افتح العبوة من حافة تبدو جافة.",
      "A second visual inspection and a different opening edge cannot verify sterility once moisture has compromised part of the sealed package.",
      "لا يستطيع الفحص البصري الثاني أو اختيار حافة فتح مختلفة إثبات التعقيم بعد أن أضرت الرطوبة بجزء من العبوة المحكمة.",
    ],
    d: [
      "Discard the damp outer wrapper and transfer the visually dry contents directly onto the sterile field.",
      "تخلّص من الغلاف الخارجي الرطب، وانقل المحتويات الجافة ظاهرياً مباشرة إلى الحقل المعقم.",
      "Visible dryness of the contents does not demonstrate sterility after the enclosing package has been compromised by moisture.",
      "لا يثبت الجفاف الظاهري للمحتويات تعقيمها بعد أن تضررت العبوة المحيطة بسبب الرطوبة.",
    ],
  },
  "saudi-nursing-maternal-preeclampsia-052": {
    b: [
      "Position the client laterally and obtain two repeat blood-pressure readings before notifying the maternity team.",
      "ضع المريضة على جانبها وخذ قراءتين إضافيتين لضغط الدم قبل إبلاغ فريق الولادة.",
      "Positioning and repeat measurements can occur, but severe hypertension with neurological and epigastric symptoms requires immediate escalation; notification should not wait for two further readings.",
      "يمكن إجراء الوضعية وإعادة القياس، لكن ارتفاع الضغط الشديد مع الأعراض العصبية والشرسوفية يتطلب تصعيداً فورياً؛ ولا ينبغي تأخير الإبلاغ إلى حين أخذ قراءتين إضافيتين.",
    ],
    c: [
      "Begin maternal and fetal observations, then activate the pathway after the baseline assessment is documented.",
      "ابدأ مراقبة الأم والجنين، ثم فعّل المسار بعد توثيق التقييم الأساسي بالكامل.",
      "Maternal-fetal observations are appropriate, but completing documentation first creates a sequence that delays the urgent severe-hypertension response.",
      "مراقبة الأم والجنين مناسبة، لكن إكمال التوثيق أولاً يضع تسلسلاً يؤخر الاستجابة العاجلة لارتفاع الضغط الشديد.",
    ],
    d: [
      "Collect a urine specimen and confirm proteinuria before classifying the presentation as severe hypertension.",
      "اجمع عينة بول وأكّد وجود البروتين قبل تصنيف الحالة على أنها ارتفاع ضغط شديد.",
      "Proteinuria is not required before recognising and urgently responding to severe hypertension with persistent neurological and epigastric warning symptoms.",
      "لا يلزم تأكيد البروتين في البول قبل التعرف على ارتفاع الضغط الشديد والاستجابة العاجلة له مع أعراض التحذير العصبية والشرسوفية المستمرة.",
    ],
  },
  "saudi-nursing-maternal-reduced-movement-085": {
    b: [
      "Record the change and discuss it at the next antenatal contact if movement returns later today.",
      "سجّلي التغير وناقشيه في الموعد الروتيني التالي للحمل إذا عادت الحركة لاحقاً اليوم.",
      "Return of some movement does not remove the need for immediate maternity contact after a substantial change from the baby's usual pattern.",
      "عودة بعض الحركة لا تلغي ضرورة التواصل الفوري مع خدمات الولادة بعد تغير كبير عن نمط حركة الجنين المعتاد.",
    ],
    c: [
      "Drink a cold beverage, rest on the left side, and contact services if movement stays reduced.",
      "اشربي مشروباً بارداً واستلقي على الجانب الأيسر، ثم تواصلي إذا بقيت الحركة منخفضة.",
      "Attempts to stimulate movement do not replace prompt maternity contact when the woman reports a substantial change from her baby's normal pattern.",
      "لا تحل محاولات تحفيز الحركة محل التواصل السريع مع خدمات الولادة عند الإبلاغ عن تغير كبير عن نمط الجنين المعتاد.",
    ],
    d: [
      "Request a routine appointment later today because no bleeding, pain, or fluid loss is reported.",
      "أرسلي طلب موعد روتيني لاحقاً اليوم لعدم الإبلاغ عن نزف أو ألم أو نزول سوائل.",
      "Reduced fetal movement itself warrants prompt maternity assessment advice; bleeding, pain, or fluid loss are not prerequisites for contact.",
      "يستلزم نقص حركة الجنين بحد ذاته نصيحة تقييم سريعة من خدمات الولادة؛ ولا يشترط وجود نزف أو ألم أو نزول سوائل للتواصل.",
    ],
  },
  "saudi-nursing-maternal-child-bronchiolitis-feeding-082": {
    a: [
      "Repeat oxygen saturation and respiratory observations, and base referral only on whether either becomes abnormal.",
      "أعد قياس تشبع الأكسجين والملاحظات التنفسية، وابنِ قرار الإحالة فقط على ما إذا أصبح أي منهما غير طبيعي.",
      "Respiratory reassessment is useful, but referral decisions must also account for the current poor intake and 12-hour absence of urine, which indicate hydration risk.",
      "إعادة التقييم التنفسي مفيدة، لكن قرار الإحالة يجب أن يراعي أيضاً ضعف التناول الحالي وغياب البول لمدة 12 ساعة، وهما يشيران إلى خطر الجفاف.",
    ],
    c: [
      "Complete a feeding observation and fluid-balance record, requesting review if the next nappy also remains dry.",
      "أكمل مراقبة الرضاعة وسجل توازن السوائل، واطلب المراجعة إذا بقي الحفاض التالي جافاً أيضاً.",
      "Feeding support and monitoring can be components of care, but the existing intake and urine findings already require prompt hydration and feeding-safety assessment.",
      "قد يكون دعم التغذية والمراقبة من عناصر الرعاية، لكن نتائج التناول والبول الحالية تستلزم بالفعل تقييماً سريعاً للترطيب وسلامة التغذية.",
    ],
    d: [
      "Arrange routine feeding follow-up while continuing respiratory observations because saturation is currently reassuring.",
      "رتّب متابعة روتينية للتغذية مع مواصلة المراقبة التنفسية لأن التشبع مطمئن حالياً.",
      "A reassuring saturation does not lower the urgency created by taking less than half the usual intake and producing no wet nappy for 12 hours.",
      "لا يقلل التشبع المطمئن من الاستعجال الناتج عن تناول أقل من نصف المعتاد وعدم تبليل حفاض لمدة 12 ساعة.",
    ],
  },
  "computerized-infection-sterile-field-037": {
    b: [
      "Inspect the seal and indicator, then use the package if both remain unchanged.",
      "افحص الختم والمؤشر، ثم استخدم العبوة إذا بقيا دون تغير ظاهري.",
      "An intact seal and indicator do not compensate for a puncture, which makes the package barrier and sterility uncertain.",
      "لا يعوض سلامة الختم والمؤشر وجود ثقب يجعل حاجز العبوة وتعقيم محتوياتها غير مؤكدين.",
    ],
    c: [
      "Isolate the punctured corner and transfer the item with sterile forceps onto a new field.",
      "اعزل الزاوية المثقوبة وانقل الأداة بملقط معقم إلى حقل جديد.",
      "Sterile forceps and a new field cannot establish sterility of an item taken from packaging whose barrier has been breached.",
      "لا يستطيع الملقط المعقم والحقل الجديد إثبات تعقيم أداة أُخذت من عبوة تعرض حاجزها للاختراق.",
    ],
    d: [
      "Open the wrapper away from the puncture and use the item if its surface appears dry and intact.",
      "افتح الغلاف بعيداً عن الثقب واستخدم الأداة إذا بدا السطح الداخلي جافاً وسليماً.",
      "Opening away from the puncture and visually inspecting the inner surface cannot verify sterility after the package barrier has been breached.",
      "لا يثبت فتح الغلاف بعيداً عن الثقب وفحص سطحه الداخلي بصرياً التعقيم بعد اختراق حاجز العبوة.",
    ],
  },
  "saudi-nursing-fundamentals-terminology-048": {
    b: [
      "A kidney opening was surgically created for urinary drainage.",
      "أُنشئت فتحة جراحية في الكلية لتصريف البول.",
      "This describes a nephrostomy, which creates a drainage opening into the kidney rather than removing the organ.",
      "يصف ذلك فغر الكلية، وهو إنشاء فتحة لتصريف البول من الكلية بدلاً من استئصال العضو.",
    ],
    c: [
      "A kidney was surgically fixed into a stable position.",
      "ثُبّتت الكلية جراحياً في وضع تشريحي أكثر استقراراً.",
      "This describes nephropexy, the surgical fixation of a kidney, and does not mean surgical removal.",
      "يصف ذلك تثبيت الكلية جراحياً، ولا يعني استئصال الكلية بعملية جراحية.",
    ],
    d: [
      "A surgical incision was made into the kidney tissue.",
      "أُجري شق جراحي داخل نسيج الكلية دون استئصالها.",
      "This describes nephrotomy, an incision into kidney tissue, rather than nephrectomy, which means removal of a kidney.",
      "يصف ذلك شق الكلية، أي إجراء شق في نسيجها، وليس استئصال الكلية الذي يعني إزالتها.",
    ],
  },
  "saudi-nursing-maternal-child-infant-fever-080": {
    b: [
      "Arrange routine review later; caregiver monitors feeding at home.",
      "رتّب مراجعة روتينية لاحقاً، ويراقب مقدم الرعاية الرضاعة في المنزل.",
      "Monitoring and a routine same-day appointment can delay the urgent paediatric assessment indicated by fever and altered alertness in a six-week-old infant.",
      "قد تؤخر المراقبة والموعد الروتيني في اليوم نفسه تقييم الأطفال العاجل الذي تستلزمه الحمى وتغير اليقظة لدى رضيع عمره ستة أسابيع.",
    ],
    c: [
      "Repeat temperature; seek urgent assessment only if fever persists.",
      "أعد قياس الحرارة، واطلب التقييم العاجل فقط إذا استمرت الحمى.",
      "The recorded fever and reduced alertness already require urgent assessment; a repeat measurement may add information but should not determine whether referral occurs.",
      "الحمى المسجلة وانخفاض اليقظة يستلزمان بالفعل تقييماً عاجلاً؛ وقد تضيف إعادة القياس معلومات، لكنها لا ينبغي أن تحدد ما إذا كانت الإحالة ستتم.",
    ],
    d: [
      "Monitor alertness and feeding, contacting paediatrics if these worsen.",
      "راقب اليقظة والرضاعة، ثم تواصل مع الأطفال إذا ساء أحدهما.",
      "The infant already has fever and increased sleepiness, so further deterioration is not required before arranging urgent paediatric assessment.",
      "لدى الرضيع بالفعل حمى ونعاس متزايد، لذلك لا يلزم حدوث تدهور إضافي قبل ترتيب تقييم عاجل من فريق الأطفال.",
    ],
  },
  "saudi-nursing-maternal-child-croup-distress-083": {
    b: [
      "Keep the parent nearby, but move the child to the examination couch for a complete respiratory assessment.",
      "أبقِ الوالد قريباً، لكن انقل الطفل إلى سرير الفحص لإجراء تقييم تنفسي كامل.",
      "A complete examination may provide data, but moving the child from the parent's lap can increase distress and worsen upper-airway obstruction before quiet assessment.",
      "قد يوفر الفحص الكامل بيانات، لكن نقل الطفل من حضن الوالد قد يزيد الضيق ويفاقم انسداد مجرى الهواء العلوي قبل التقييم الهادئ.",
    ],
    c: [
      "Keep the child with the parent, but obtain pulse oximetry and blood pressure before assessing work of breathing.",
      "أبقِ الطفل مع الوالد، لكن خذ قياس التأكسج وضغط الدم قبل تقييم جهد التنفس.",
      "Potentially distressing equipment should not precede quiet observation in a stable-appearing child whose stridor worsens with approach; these observations may be omitted if they increase distress.",
      "لا ينبغي أن تسبق الأجهزة التي قد تثير الطفل الملاحظة الهادئة لدى طفل يبدو مستقراً ويزداد صريره عند الاقتراب؛ ويمكن إغفال هذه القياسات إذا زادت الضيق.",
    ],
    d: [
      "Keep the child with the parent and complete auscultation and a throat examination before observing spontaneous breathing.",
      "أبقِ الطفل مع الوالد وأكمل التسمع وفحص الحلق قبل مراقبة التنفس التلقائي.",
      "Hands-on auscultation and throat examination can increase distress and are not required before a quiet, minimally invasive initial assessment of typical croup.",
      "قد يزيد التسمع وفحص الحلق المباشران الضيق، ولا يلزمان قبل التقييم الأولي الهادئ وقليل التدخل للخانوق النمطي.",
    ],
  },
};
