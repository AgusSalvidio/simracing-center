import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 8080,
  DB_URI: process.env.DB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

const DB_URI = config.DB_URI;

const connectDB = async () => {
  try {
    await connect(DB_URI);
    console.log("DB connection successful");
  } catch (error) {
    console.log(error);
  }
};

export { connectDB, config };
