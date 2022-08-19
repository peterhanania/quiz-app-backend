export type Question = {
  id: string;
  question: string;
  options: Array<{
    label: string;
    value: string;
    isCorrect: boolean;
  }>;
};

export type User = {
  username: string;
  password: string;
  seenQuestions: Array<string>;
  previousScores: Array<{
    score: Number;
    date: Date;
  }>;
};
