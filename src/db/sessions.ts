import sequelizeDB from "./config";
import session from "express-session";
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const SessionStore = new SequelizeStore({
  db: sequelizeDB,
});

export default SessionStore;
