import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import Account_Model from "../dbModels/Account.model.js";
 
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    port: dbConfig.PORT,
});

try {
  await sequelize.authenticate();
  console.log("DB connected");
} catch (error) {
  console.error("DB connection error:", error);
  process.exit(1); // stop the app if DB is essential
}
 
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Account = Account_Model(sequelize, Sequelize);
 
export default db;