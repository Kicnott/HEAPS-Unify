import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Unify", "your_pg_user", "your_pg_password", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();