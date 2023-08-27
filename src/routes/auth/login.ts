import express, { Express, Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { getUser } from "../../db/db";

const login = async (req: Request, res: Response) => {
  const authData = req.body;
  const user = await getUser(authData.email);
  let response;
  if (!user) {
    response = {
      errorMessage: "user not found, check credentials or create account",
    };
    res.send(JSON.stringify(response));
  }

  const passwordMatch = await bcrypt.compare(
    authData.password,
    user?.dataValues.encrypted_password
  );
  if (passwordMatch) {
    response = { message: "Login successful" };
    res.send(JSON.stringify(response));
  } else {
    response = { message: "Incorrect password" };
    res.send(JSON.stringify(response));
  }
};

export default login;
