export {};

declare global {
  namespace Express {
    interface Request {
      body: {
        questionId: string;
        answer: string;
      }
    }
  }
}

