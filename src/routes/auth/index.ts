import express, { Express, Router, Request, Response } from "express";
import createAccount from "./createAccount";
import login from "./login";

const authRouter = Router();
authRouter.post("/create-account", createAccount);
authRouter.post("/login", login);
export default authRouter;
