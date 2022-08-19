import { Router } from "express";
const router = Router();

import questionsRoute from "./questions";
import userRoute from "./user";

router.use("/questions", questionsRoute);
router.use("/user", userRoute);

export default router;
