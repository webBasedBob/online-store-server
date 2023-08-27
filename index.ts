import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Router } from "express";
import authRouter from "./src/routes/auth";
import "dotenv/config";

const app: Express = express();
const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded());
const port = process.env.PORT;
app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
