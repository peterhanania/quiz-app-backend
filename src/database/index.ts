import mongoose from "mongoose";
import { config } from "dotenv";
config();

export const connect = async () => {
  await mongoose
    .connect(`${process.env.MONGO_URL}`)
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(err));
};
