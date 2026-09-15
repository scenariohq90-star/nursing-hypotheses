import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle,
  FirstAidKit,
  Pulse,
  Repeat,
  XCircle,
} from "@phosphor-icons/react";
import {
  answeredSepsisQuestionCount,
  boundedSepsisQuestionIndex,
  isSepsisQuizComplete,
  localizeSepsisText,
  scoreSepsisQuiz,
  SEPSIS_QUIZ_COPY,
  SEPSIS_QUIZ_QUESTIONS,
  SEPSIS_QUIZ_TOTAL,
  sepsisScoreBand,
  withSepsisAnswer,
} from "../data/sepsis-quiz.js";
import "./sepsis-quiz.css";
import { recordAnonymousEvent } from "../lib/anonymous-analytics.js";

function DirectionalArrow({ lang, back = false }) {
  const pointsLeft = (lang === "ar" && !back) || (lang !== "ar" && back);
  const Icon = pointsLeft ? ArrowLeft : ArrowRight;
  return <Icon size={18} weight="bold" aria-hidden="true" />;
}

function QuizProgress({ answers, currentIndex, label }) {
  return <ol className="spq-progress" aria-label={label}>
    {SEPSIS_QUIZ_QUESTIONS.map((question, index) => {
      const state = index === currentIndex ? "current" : answers[question.id] ? "answered" : "pending";
      return <li key={question.id}>
        <span className={`spq-progress__mark is-${state}`} aria-current={state === "current" ? "step" : undefined}>
          <span className="sr-only">{index + 1}</span>
        </span>
      </li>;
    })}
  </ol>;
}

function QuizIntro({ lang, onStart }) {
  const text = SEPSIS_QUIZ_COPY[lang];
  return <section className="spq-intro" aria-labelledby="sepsis-quiz-title">
    <div className="spq-intro__copy">
      <p className="spq-eyebrow">{text.eyebrow}</p>
      <h1 id="sepsis-quiz-title">{text.title}</h1>
      <p className="spq-lead">{text.subtitle}</p>
      <ul className="spq-features">
        {[text.tenQuestions, text.onePointEach, text.privateSession].map((item) => <li key={item}><CheckCircle size={19} weight="fill" aria-hidden="true" />{item}</li>)}
      </ul>
      <button type="button" className="spq-button spq-button--primary spq-start" onClick={onStart}>
        {text.start}<DirectionalArrow lang={lang} />
      </button>
    </div>
    <aside className="spq-intro__card" aria-label={text.tenQuestions}>
      <div className="spq-intro__score"><div><span>SEPSIS</span><strong>10</strong><small>{text.tenQuestions}</small></div><Pulse size={70} weight="duotone" aria-hidden="true" /></div>
      <QuizProgress answers={{}} currentIndex={-1} label={text.progressLabel} />
      <div className="spq-path">
        <span>qSOFA</span><span>TIME ZERO</span><span>ESCALATION</span>
      </div>
    </aside>
  </section>;
}

function QuizQuestion({ lang, answers, currentIndex, error, headingRef, onAnswer, onBack, onContinue }) {
  const text = SEPSIS_QUIZ_COPY[lang];
  const question = SEPSIS_QUIZ_QUESTIONS[currentIndex];
  const selected = answers[question.id];
  const answered = answeredSepsisQuestionCount(SEPSIS_QUIZ_QUESTIONS, answers);
  const isLast = currentIndex === SEPSIS_QUIZ_TOTAL - 1;
  return <section className="spq-question-shell" aria-labelledby="sepsis-question-heading">
    <header className="spq-question-meta">
      <div><strong>{text.questionOf(currentIndex + 1, SEPSIS_QUIZ_TOTAL)}</strong><span aria-live="polite">{text.answeredOf(answered, SEPSIS_QUIZ_TOTAL)}</span></div>
      <QuizProgress answers={answers} currentIndex={currentIndex} label={text.progressLabel} />
    </header>
    <div className="spq-question-card">
      <div className="spq-question-card__accent" aria-hidden="true" />
      <fieldset>
        <legend className="sr-only">{text.questionOf(currentIndex + 1, SEPSIS_QUIZ_TOTAL)}</legend>
        <div className="spq-question-title">
          <span aria-hidden="true">{currentIndex + 1}</span>
          <h1 id="sepsis-question-heading" ref={headingRef} tabIndex="-1">{localizeSepsisText(question.prompt, lang)}</h1>
        </div>
        <div className="spq-options" role="radiogroup" aria-describedby={error ? "sepsis-selection-error" : undefined}>
          {question.options.map((option, optionIndex) => {
            const inputId = `spq-${question.id}-${option.id}`;
            const checked = selected === option.id;
            return <label key={option.id} className={`spq-option ${checked ? "is-selected" : ""}`} htmlFor={inputId}>
              <input id={inputId} type="radio" name={question.id} value={option.id} checked={checked} onChange={() => onAnswer(option.id)} />
              <span className="spq-radio" aria-hidden="true" />
              <span><strong>{optionIndex + 1}.</strong>{localizeSepsisText(option.text, lang)}</span>
            </label>;
          })}
        </div>
        <div className="spq-error-slot">{error ? <p id="sepsis-selection-error" role="alert">{text.chooseAnswer}</p> : null}</div>
      </fieldset>
      <div className="spq-actions">
        <button type="button" className="spq-button spq-button--ghost" onClick={onBack} disabled={currentIndex === 0}><DirectionalArrow lang={lang} back />{text.previous}</button>
        <button type="button" className="spq-button spq-button--primary" onClick={onContinue}>{isLast ? text.showResult : text.next}<DirectionalArrow lang={lang} /></button>
      </div>
    </div>
    <p className="spq-session-note">{text.noSavedAnswers}</p>
  </section>;
}

function QuizResults({ lang, answers, headingRef, onRetry }) {
  const text = SEPSIS_QUIZ_COPY[lang];
  const score = scoreSepsisQuiz(SEPSIS_QUIZ_QUESTIONS, answers);
  const band = sepsisScoreBand(score, SEPSIS_QUIZ_TOTAL);
  return <section className="spq-results" aria-labelledby="sepsis-results-heading">
    <div className="spq-result-hero" aria-live="polite">
      <div className="spq-score-ring"><strong>{score}</strong><span dir="ltr">/ {SEPSIS_QUIZ_TOTAL}</span></div>
      <div><p>{text.resultsTitle}</p><h1 id="sepsis-results-heading" ref={headingRef} tabIndex="-1">{text.bands[band].title}</h1><p>{text.bands[band].description}</p>
        <div className="spq-score-bars" aria-hidden="true">{SEPSIS_QUIZ_QUESTIONS.map((question) => <span key={question.id} className={answers[question.id] === question.correctOptionId ? "is-correct" : "is-incorrect"} />)}</div>
      </div>
    </div>
    <div className="spq-review-heading"><div><BookOpen size={27} weight="duotone" aria-hidden="true" /><h2>{text.answerReview}</h2></div><a href="#/resources" className="spq-reference-link">{text.viewReferences}<DirectionalArrow lang={lang} /></a></div>
    <div className="spq-review-list">
      {SEPSIS_QUIZ_QUESTIONS.map((question, index) => {
        const selectedId = answers[question.id];
        const selectedOption = question.options.find((option) => option.id === selectedId);
        const correctOption = question.options.find((option) => option.id === question.correctOptionId);
        const correct = selectedId === question.correctOptionId;
        return <details className="spq-review-item" key={question.id} open={!correct}>
          <summary><span className={`spq-review-status ${correct ? "is-correct" : "is-incorrect"}`}>{correct ? <Check size={17} weight="bold" /> : <XCircle size={18} weight="fill" />}</span><span>{index + 1}. {localizeSepsisText(question.prompt, lang)}</span><strong className={correct ? "is-correct" : "is-incorrect"}>{correct ? text.correct : text.incorrect}</strong></summary>
          <div className="spq-review-body">
            <div className="spq-answer-grid"><div><span>{text.yourAnswer}</span><p>{selectedOption ? localizeSepsisText(selectedOption.text, lang) : text.unanswered}</p></div><div className="is-correct"><span>{text.correctAnswer}</span><p>{correctOption ? localizeSepsisText(correctOption.text, lang) : "—"}</p></div></div>
            <div><h3>{text.rationale}</h3><p>{localizeSepsisText(question.rationale, lang)}</p></div>
          </div>
        </details>;
      })}
    </div>
    <button type="button" className="spq-button spq-button--primary spq-retry" onClick={onRetry}><Repeat size={19} weight="bold" aria-hidden="true" />{text.retry}</button>
  </section>;
}

export default function SepsisQuiz({ lang }) {
  const [phase, setPhase] = useState("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectionError, setSelectionError] = useState(false);
  const questionHeadingRef = useRef(null);
  const resultsHeadingRef = useRef(null);

  useEffect(() => {
    if (phase === "questions") questionHeadingRef.current?.focus({ preventScroll: true });
    if (phase === "results") resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [phase, currentIndex]);

  function startQuiz() {
    recordAnonymousEvent("sepsis_start", "sepsis", lang);
    setAnswers({});
    setCurrentIndex(0);
    setSelectionError(false);
    setPhase("questions");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function chooseAnswer(optionId) {
    const question = SEPSIS_QUIZ_QUESTIONS[currentIndex];
    setAnswers((current) => withSepsisAnswer(current, question.id, optionId));
    setSelectionError(false);
  }

  function goBack() {
    setSelectionError(false);
    setCurrentIndex((index) => boundedSepsisQuestionIndex(index - 1, SEPSIS_QUIZ_TOTAL));
  }

  function continueQuiz() {
    const question = SEPSIS_QUIZ_QUESTIONS[currentIndex];
    if (!answers[question.id]) {
      setSelectionError(true);
      return;
    }
    if (currentIndex < SEPSIS_QUIZ_TOTAL - 1) {
      setCurrentIndex((index) => boundedSepsisQuestionIndex(index + 1, SEPSIS_QUIZ_TOTAL));
      setSelectionError(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (isSepsisQuizComplete(SEPSIS_QUIZ_QUESTIONS, answers)) {
      recordAnonymousEvent("sepsis_complete", "sepsis", lang, scoreSepsisQuiz(SEPSIS_QUIZ_QUESTIONS, answers) / SEPSIS_QUIZ_TOTAL * 100);
      setPhase("results");
    }
  }

  return <div className="sepsis-quiz" dir={lang === "ar" ? "rtl" : "ltr"}>
    <div className="spq-pulse" aria-hidden="true"><FirstAidKit size={30} weight="duotone" /><span /><span /><span /></div>
    {phase === "intro" ? <QuizIntro lang={lang} onStart={startQuiz} /> : null}
    {phase === "questions" ? <QuizQuestion lang={lang} answers={answers} currentIndex={currentIndex} error={selectionError} headingRef={questionHeadingRef} onAnswer={chooseAnswer} onBack={goBack} onContinue={continueQuiz} /> : null}
    {phase === "results" ? <QuizResults lang={lang} answers={answers} headingRef={resultsHeadingRef} onRetry={startQuiz} /> : null}
  </div>;
}
