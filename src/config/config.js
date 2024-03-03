import dotenv from "dotenv";
import MongoConnection from "../../utils/MongoConnection.js";

dotenv.config();

const config = {
  PORT: process.env.PORT || 8080,
  DB_URI: process.env.DB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASS: process.env.ADMIN_PASS,
  ADMIN_ROLE: process.env.ADMIN_ROLE,
};

const connectDB = async () => {
  try {
    await MongoConnection.getInstance(config.DB_URI);
  } catch (error) {
    console.log(error);
  }
};

export { connectDB, config };
