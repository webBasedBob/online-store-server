import { Request, Response } from "express";
import { getUser } from "../db/auth";
import { DoneCallback } from "passport";
import { User } from "../../types/auth";
export const getAuthState = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    console.log("yes");
  } else {
    console.log("noi");
  }
  console.log(req.user);
  res.send(JSON.stringify({ pula: "pizda" }));
};

export const serialize = (user, done: DoneCallback) => {
  done(null, user.email);
};
export const deserialize = async (email: string, done: DoneCallback) => {
  try {
    const user = await getUser(email);
    const userToReturn = {
      username: user?.dataValues?.user_name,
      email: user?.dataValues?.email,
      role: user?.dataValues?.role,
    };
    done(null, userToReturn);
  } catch (err) {
    done(err);
  }
};