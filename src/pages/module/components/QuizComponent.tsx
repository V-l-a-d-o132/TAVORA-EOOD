import { useEffect, useState } from "react";
import type { QuizQuestion } from "@/lib/academy-content";
import { loadQuizQuestions } from "@/pages/module/utils";
import InlineQuiz from "./InlineQuiz";

interface Props {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}
export default function QuizComponent(props: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setQuestions([]);
    setError("");
    loadQuizQuestions(props.moduleId, props.lessonId).then((q) => {
      if (active) setQuestions(q);
    }).catch(() => {
      if (active) setError("Тестът не е достъпен.");
    });
    return () => {
      active = false;
    };
  }, [props.moduleId, props.lessonId]);
  if (error) return <p role="alert">{error}</p>;
  return (
    <InlineQuiz
      key={props.moduleId + props.lessonId}
      {...props}
      questions={questions}
    />
  );
}
