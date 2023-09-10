import express, { Express, Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { getUser } from "../../db/auth";
import { getJWT } from "../../utils/utils";
import cookie from "cookie";
import passport, { DoneCallback } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { deserialize, serialize } from "../../utils/authUtils";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Define the field used for email input
      passwordField: "password", // Define the field used for password input
    },
    async (email: string, password: string, done: any) => {
      try {
        const user = await getUser(email);
        if (!user) {
          return done(null, false, {
            errorMessage: "user not found, check credentials or create account",
          });
        }
        const passwordMatch = await bcrypt.compare(
          password,
          user?.dataValues.encrypted_password
        );
        if (passwordMatch) {
          const userToReturn = {
            username: user?.dataValues?.user_name,
            email: user?.dataValues?.email,
            role: user?.dataValues?.role,
          };
          done(null, userToReturn);
        } else {
          done(null, false, { message: "Incorrect email or password" });
        }
      } catch (err) {
        done(null);
      }
    }
  )
);

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

export default passport;
