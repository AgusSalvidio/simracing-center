import { connect } from "mongoose";

const DB_URI =
  "mongodb+srv://admin:admin@simracingcenter.vwo5g63.mongodb.net/ecommerce?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await connect(DB_URI);
    console.log("DB connection successful");
  } catch (error) {
    console.log(error);
  }
};

export { connectDB, DB_URI };
