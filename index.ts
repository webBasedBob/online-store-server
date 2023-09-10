import express, { Express } from "express";
import cors from "cors";
import { Router } from "express";
import authRouter from "./src/routes/auth";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";

const app: Express = express();
dotenv.config();

const allowedOrigins = ["http://localhost:3000"];
const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow: boolean) => void
  ) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true, // Enable credentials (cookies)
};

const SESSION_SECRET_KEY: any = process.env.EXPRESS_SESSION_SECRET_KEY;
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions)); // CORS middleware before Passport
app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const port = process.env.PORT;
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
