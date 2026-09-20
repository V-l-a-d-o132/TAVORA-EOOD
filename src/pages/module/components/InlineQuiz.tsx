import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { QuizQuestion } from "@/lib/academy-content";
import { C } from "@/pages/module/constants";

interface InlineQuizProps {
  moduleId: string;
  lessonId: string;
  questions: QuizQuestion[];
  lessonTitle: string;
  onComplete: (score: number, total: number) => void;
  onClose: () => void;
}
interface Result {
  score: number;
  total: number;
  feedback: {
    id: string;
    correct: boolean;
    correctIndex: number;
    explanation: string;
  }[];
}

export default function InlineQuiz(
  { moduleId, lessonId, questions, lessonTitle, onComplete, onClose }:
    InlineQuizProps,
) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const attempt = useRef(crypto.randomUUID());
  const submitted = useRef(false);
  async function submit() {
    if (busy || result) return;
    submitted.current = true;
    setBusy(true);
    setError("");
    try {
      const { data, error: failure } = await supabase.rpc(
        "academy_submit_quiz",
        {
          p_module: moduleId,
          p_lesson: lessonId,
          p_answers: answers,
          p_attempt: attempt.current,
        },
      );
      if (failure) throw failure;
      setResult(data as Result);
      onComplete(data.score, data.total);
    } catch {
      setError("Тестът не е записан. Проверете входа си и опитайте отново.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="p-6 space-y-5"
      style={{
        background: C.surface,
        color: C.text,
        border: "1px solid " + C.border,
      }}
    >
      <h3 className="text-xl font-bold">Тест: {lessonTitle}</h3>
      {questions.length === 0 && <p>Няма публикуван тест за този урок.</p>}
      {questions.map((q, index) => {
        const feedback = result?.feedback.find((f) => f.id === q.id);
        return (
          <fieldset
            key={q.id}
            disabled={busy || !!result || submitted.current}
            className="space-y-2"
          >
            <legend className="font-semibold">{index + 1}. {q.question}</legend>
            {q.options.map((option, i) => (
              <label key={i} className="flex gap-3 p-2 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === i}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                />
                {option}
              </label>
            ))}
            {feedback && (
              <p>
                {feedback.correct
                  ? "Верен отговор."
                  : "Верен отговор: " + q.options[feedback.correctIndex]}{" "}
                {feedback.explanation}
              </p>
            )}
          </fieldset>
        );
      })}
      {error && <p role="alert">{error}</p>}
      {result && <p role="status">Резултат: {result.score} от {result.total}
      </p>}
      {!result && questions.length > 0 && (
        <button
          onClick={submit}
          disabled={busy || Object.keys(answers).length !== questions.length}
          className="px-5 py-3 disabled:opacity-40"
          style={{ background: C.accent }}
        >
          {busy
            ? "Проверка…"
            : error
            ? "Повтори изпращането"
            : "Предай отговорите"}
        </button>
      )}
      <button onClick={onClose} className="px-5 py-3">Затвори</button>
    </section>
  );
}
