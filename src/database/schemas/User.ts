import mongoose, { Schema } from "mongoose";
import type { User } from "../../types/types";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  seenQuestions: {
    type: [String],
    required: false,
    default: [],
  },
  previousScores: {
    type: [
      {
        score: Number,
        date: Date,
      },
    ],
    required: false,
    default: [],
  },
});

export default mongoose.model("users", userSchema);
