import mongoose, { Schema } from "mongoose";
import type { Question } from "../../types/types";

const questionSchema = new Schema<Question>({
  id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [
      {
        label: String,
        value: String,
        isCorrect: Boolean,
      },
    ],
    required: true,
  },
});

export default mongoose.model("questions", questionSchema);
