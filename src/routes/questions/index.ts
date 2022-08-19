import { Router } from "express";
import { QuestionSchema, UserSchema } from "../../database/schemas";
import defaultQuestions from "../../other/defaultQuestions.json";
const router = Router();

// https://the-trivia-api.com/api/questions?limit=20&region=CA&difficulty=easy

router.get("/random", async (req, res) => {
  let questions = await QuestionSchema.find({});
  if (!questions || !questions.length) {
    // create default question if none exist
    const startTime = Date.now();

    for (let i = 0; i < defaultQuestions.length; i++) {
      const question = defaultQuestions[i];
      const newQuestion = new QuestionSchema(question);
      await newQuestion.save();
    }

    console.log(
      "Time taken to create default questions: " +
        (Date.now() - startTime) +
        "ms"
    );
    questions = await QuestionSchema.find({});
    return res.json({
      error: false,
      question: questions[Math.floor(Math.random() * questions.length)],
    });
  }

  const user = req.session?.user;
  const userExists = await UserSchema.findOne({ username: user?.username });
  const question = userExists
    ? questions
        .filter((q) => !userExists.seenQuestions.includes(q.id))
        .sort(() => Math.random() - 0.5)
        .pop()
    : questions[Math.floor(Math.random() * questions.length)];

  res.json({
    error: null,
    question: question,
  });
});

router.post("/validate", async (req, res) => {
  const { questionId: id, answer: answer, score } = req.body;
  const questionExists = await QuestionSchema.findOne({ id });
  if (!questionExists) {
    return res.json({
      error: "A question with that id does not exist",
      valid: false,
    });
  }

  const user = req.session?.user;
  const userExists = await UserSchema.findOne({ username: user?.username });
  const correctAnswer = questionExists.options.find(
    (option) => option.isCorrect === true && option.value === answer
  );

  if (userExists) {
    if (userExists.seenQuestions.length >= defaultQuestions.length - 1) {
      userExists.seenQuestions = [id];
    } else {
      if (!userExists.seenQuestions.includes(id)) {
        userExists.seenQuestions.push(id);
      }
    }
    await userExists.save();
  }

  if (!correctAnswer) {
    if (user) {
      if (userExists && score > 0) {
        userExists.previousScores.push({
          score: score,
          date: new Date(),
        });
        await userExists.save();
      }
    }
    return res.json({
      error: null,
      valid: false,
    });
  }

  return res.json({
    error: null,
    valid: true,
  });
});

export default router;
