import { config } from "dotenv";
import { User } from "../types/types";
import express, { Express } from "express";
import cors from "cors";
import session from "express-session";
import routes from "../routes";
import store from "connect-mongo";

declare module "express-session" {
  export interface SessionData {
    user: User;
  }
}

config();

export function createApp(): Express {
  const app = express();
  // Enable the parsing middleware for incoming reqs
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(
    cors({
      origin: process.env.MAIN_WEBSITE_URL
        ? [process.env.MAIN_WEBSITE_URL]
        : ["http://localhost:3000"],
      credentials: true,
    })
  );

  app.use((req, res, next) => {
    if (
      req.headers.origin !== process.env.MAIN_WEBSITE_URL &&
      !req.path.includes("/api/user/logout")
    ) {
      res.status(403).send({
        error: "Access Forbidden.",
      });
    } else {
      next();
    }
  });

  // Enable Sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 * 60 * 24 * 7 },
      store: store.create({
        mongoUrl: process.env.MONGO_URL,
      }),
    })
  );

  app.use("/api", routes);

  return app;
}
