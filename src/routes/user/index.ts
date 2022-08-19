import { Router } from "express";
import { config } from "dotenv";
import { UserSchema } from "../../database/schemas";
const bcrypt = require("bcryptjs");
const router = Router();
config();

router.get("/status", async (req, res) => {
  if (req.session?.user) {
    const userExists = await UserSchema.findOne({
      username: req.session?.user?.username,
    });

    if (userExists) {
      res.json({
        error: null,
        user: {
          username: req.session.user.username,
          previousScores: userExists.previousScores,
        },
      });
    } else {
      res.json({ error: "Could not find this user", user: null });
    }
  } else {
    res.json({ error: "Unauthorized", user: null });
  }
});

router.post("/create", async (req, res) => {
  try {
    const data = req.body;

    if (!data.username || !data.password)
      return res.status(200).send({
        error: "You must provide an username and password.",
      });

    if (data.username.length >= 10)
      return res.status(200).send({
        error:
          "You must provide a username with a length less than 10 characters",
      });

    if (data.password.length < 6)
      return res.status(200).send({
        error: "You must not provide a very short password.",
      });

    if (data.password.length > 32)
      return res.status(200).send({
        error: "Your provided password is too long.",
      });

    if (req.session.user)
      return res.status(200).send({
        error: "You are already logged in.",
      });

    const user = await UserSchema.findOne({ username: data.username });
    if (user)
      return res.status(200).send({
        error: "The username provided is already in use.",
      });

    //if all the data is valid, create the user
    const newUser = new UserSchema({
      username: data.username,
      password: await bcrypt.hash(data.password, 12),
    });

    await newUser.save();

    req.session.user = newUser;

    res.status(200).send({
      error: false,
    });
  } catch (err) {
    res.status(400).send({
      error: "Bad Request.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (req.session.user)
      return res.status(200).send({
        error: "You are already logged in.",
      });

    const data = req.body;

    if (!data.username || !data.password)
      return res.status(200).send({
        error: "You must provide a username and password.",
      });

    if (data.username.length >= 10)
      return res.status(200).send({
        error:
          "You must provide a username with a length less than 10 characters",
      });

    if (data.password.length < 6)
      return res.status(200).send({
        error: "You must not provide a very short password.",
      });

    if (data.password.length > 32)
      return res.status(200).send({
        error: "Your rovided password is too long.",
      });

    const user = await UserSchema.findOne({ username: data.username });
    if (!user)
      return res.status(200).send({
        error: "Invalid username or password provided.",
      });

    const doMatch = await bcrypt.compare(data.password, user.password);
    if (!doMatch)
      return res.status(200).send({
        error: "Invalid username or password provided.",
      });

    req.session.user = user;

    res.status(200).send({
      error: false,
    });
  } catch (err) {
    res.status(400).send({
      error: "Bad Request.",
    });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect(process.env.MAIN_WEBSITE_URL || "http://localhost:3000");
  });
});

export default router;
