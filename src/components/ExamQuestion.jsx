import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  Check,
  CheckCircle,
  ShieldWarning,
  Target,
  Warning,
} from "@phosphor-icons/react";

function localize(value, language) {
  return value && typeof value === "object"
    ? value[language] || value.en || value.ar || ""
    : String(value ?? "");
}

function formatNumber(value, language) {
  return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US").format(value);
}

/** Responsive, direction-aware renderer for one independently authored item. */
export function ExamQuestion({
  question,
  questionNumber,
  language,
  translate,
  selectedOptionId,
  locked,
  notice,
  sources = [],
  isLastQuestion,
  onSelect,
  onPrimaryAction,
}) {
  if (!question) return null;
  const direction = language === "ar" ? "rtl" : "ltr";
  const alternateLanguage = language === "ar" ? "en" : "ar";
  const selectedOption = question.options.find((option) => option.id === selectedOptionId);
  const correctOption = question.options.find((option) => option.id === question.correctOptionId);
  const isCorrect = selectedOptionId === question.correctOptionId;

  return (
    <article className="exam-question-card" dir={direction}>
      <div className="exam-question-meta">
        <span>{localize(question.category, language)}</span>
        <span>{localize(question.difficulty, language)}</span>
        <span>{localize(question.topic, language)}</span>
      </div>
      <div className="question-heading">
        <span className="question-icon"><Target size={28} weight="duotone" /></span>
        <div>
          <p className="eyebrow">{translate("question")} {formatNumber(questionNumber, language)}</p>
          <h1>{localize(question.stem, language)}</h1>
          <p className="translated-question" lang={alternateLanguage} dir={alternateLanguage === "ar" ? "rtl" : "ltr"}>
            {localize(question.stem, alternateLanguage)}
          </p>
        </div>
      </div>

      <fieldset className="choice-list">
        <legend className="sr-only">{translate("selectOneAnswer")}</legend>
        {question.options.map((option, index) => {
          const checked = selectedOptionId === option.id;
          return (
            <label key={option.id} className={`choice-option ${checked ? "selected" : ""} ${locked ? "locked" : ""}`}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={checked}
                disabled={locked}
                onChange={() => onSelect(option.id)}
              />
              <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
              <span className="choice-text">{localize(option.text, language)}</span>
              <span className="radio-visual" aria-hidden="true">{checked ? <Check size={15} weight="bold" /> : null}</span>
            </label>
          );
        })}
      </fieldset>

      {notice ? <p className="form-notice" role="alert"><Warning size={18} weight="fill" />{notice}</p> : null}

      {locked && selectedOption ? (
        <section className={`question-feedback ${isCorrect ? "correct" : "incorrect"}`} aria-live="polite">
          <div className="feedback-heading">
            {isCorrect ? <CheckCircle size={26} weight="fill" /> : <ShieldWarning size={26} weight="fill" />}
            <div><span>{translate("answerLocked")}</span><h2>{translate(isCorrect ? "correctAnswer" : "incorrectAnswer")}</h2></div>
          </div>
          <p>{localize(question.optionRationales[selectedOptionId], language)}</p>
          {!isCorrect && correctOption ? (
            <p className="correct-answer-line"><strong>{translate("correctAnswer")}:</strong> {localize(correctOption.text, language)}</p>
          ) : null}
          <div className="question-source-list">
            <strong><BookOpen size={18} weight="duotone" />{translate("questionSources")}</strong>
            {sources.map((reference) => (
              <a key={reference.id} href={reference.url} target="_blank" rel="noopener noreferrer nofollow">
                {localize(reference.title, language)}<ArrowSquareOut size={15} />
                <span className="sr-only">{translate("opensNewTab")}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="decision-actions">
        <button type="button" className="button button-primary" onClick={onPrimaryAction}>
          {locked ? translate(isLastQuestion ? "finishQuiz" : "nextQuestion") : translate("lockAnswer")}
          {language === "ar" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </article>
  );
}
