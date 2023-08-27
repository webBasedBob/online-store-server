import express, { Express, Router, Request, Response } from "express";
import { checkIfUserExists, createUser, getUser, pula } from "../../db/db";
import bcrypt from "bcrypt";

const createAccount = async (req: Request, res: Response) => {
  const authData = req.body;
  const userExists = await getUser(authData.email);
  let response;
  if (userExists) {
    response = {
      error: "Email already in use, please use another one or log in instead",
    };
    res.send(JSON.stringify(response));
  } else {
    try {
      const saltRounds = 10;
      const encryptedPsw = await bcrypt.hash(authData.password, saltRounds);
      authData.password = encryptedPsw;
      const newUser = await createUser(authData);
      response = {
        userCreated: true,
        email: newUser.email,
        username: newUser.user_name,
      };
      res.send(JSON.stringify(response));
    } catch (err) {
      response = { error: err };
      res.send(JSON.stringify(response));
    }
  }
};

export default createAccount;
