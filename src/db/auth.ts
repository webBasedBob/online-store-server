import { Model, DataTypes, Sequelize, Op } from "sequelize";
import path from "path";
import dotenv from "dotenv";
import { create } from "domain";
import { promises } from "dns";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const DATABASE_URL: string = process.env.DATABASE_URL as string;

const sequelizeDB = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = sequelizeDB.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: DataTypes.STRING,
    encrypted_password: DataTypes.STRING,
    role: DataTypes.STRING,
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    email: DataTypes.STRING,
  },
  {
    modelName: "users",
    createdAt: "inserted_at",
    updatedAt: "updated_at",
  }
);

export const checkIfUserExists = async (email: string): Promise<boolean> => {
  await sequelizeDB.sync();

  const foundUser = await User.findOne({
    where: {
      email: email,
    },
  });

  return foundUser !== null;
};

export const createUser = async (
  {
    email,
    username,
    password,
  }: {
    email: string;
    username?: string;
    password?: string;
  },
  authType: string
) => {
  await sequelizeDB.sync();
  const createdUser = await User.create({
    inserted_at: new Date(),
    updated_at: new Date(),
    user_name: username,
    encrypted_password: authType === "local" ? password : null,
    role: "user",
    email: email,
    auth_type: authType,
  });
  return createdUser;
};

export const getUser = async (email: string) => {
  await sequelizeDB.sync();
  const foundUser = await User.findOne({
    where: {
      email: email,
    },
  });
  return foundUser;
};
