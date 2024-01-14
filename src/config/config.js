import { connect } from "mongoose";

const DB_URI = "";

const connectDB = async () => {
  try {
    await connect(DB_URI);
    console.log("DB connection successful");
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };
