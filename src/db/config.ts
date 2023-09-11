import { Sequelize } from "sequelize";
import path from "path";
import dotenv from "dotenv";

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
export default sequelizeDB;
