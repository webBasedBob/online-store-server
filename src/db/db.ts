import { Model, DataTypes, Sequelize, Op } from "sequelize";
import path from "path";
import dotenv from "dotenv";
import { create } from "domain";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const DATABASE_URL = process.env.DATABASE_URL;

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

const ss = async () => {
  try {
    await sequelizeDB.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
// ss();
export const pula = async () => {
  await sequelizeDB.sync();
  const jane = await User.create({
    inserted_at: new Date(),
    updated_at: new Date(),
    user_name: "user4",
    encrypted_password: "test",
    role: "test2",
    email: `test@test.com`,
  });
  console.log(jane.toJSON());
};
// export const pula = () => {
//   console.log("ssas", DATABASE_URL);
// };
export const checkIfUserExists = async (userData: {
  email: string;
  username: string;
}) => {
  await sequelizeDB.sync();
  const foundUser = await User.findOne({
    where: {
      [Op.or]: [{ email: userData.email }, { user_name: userData.username }],
    },
  });
  if (foundUser === null) {
    return false;
  } else {
    return true;
  }
};

export const createUser = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) => {
  await sequelizeDB.sync();
  const createdUser = await User.create({
    inserted_at: new Date(),
    updated_at: new Date(),
    user_name: username,
    encrypted_password: password,
    role: "user",
    email: email,
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
