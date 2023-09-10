import express, { Express, Router, Request, Response } from "express";
import createAccount from "./localCreateAccount";
import localPassport from "./localLogin";
import googlePassport from "./googleLogin";
import { getAuthState } from "../../utils/authUtils";
const authRouter = Router();

authRouter.get("/get-state", getAuthState);
authRouter.post("/create-account", createAccount);
authRouter.get("/google", googlePassport.authenticate("google"));
authRouter.get("/login/callback", (req: Request, res: Response) => {
  res.send(JSON.stringify({ message: "pula" }));
});
authRouter.get(
  "/google/callback",
  googlePassport.authenticate("google", {
    session: true,
    successRedirect: "http://localhost:3000", // Redirect to your frontend app
    failureRedirect: "/login", // Redirect on failed authentication
  })
);
authRouter.post(
  "/login",
  localPassport.authenticate("local", {
    session: true,
    successRedirect: "/auth/login/callback", // Redirect to your frontend app
    failureRedirect: "/login", // Redirect on failed authentication
  })
);

export default authRouter;
