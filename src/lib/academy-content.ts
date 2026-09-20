// Legacy lesson-slide contracts were retired with Lesson Engine V2. The quiz
// shape remains for the separate PDF quiz compatibility path.
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}
