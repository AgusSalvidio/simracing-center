import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class MongoConnection {
  static #instance;
  constructor() {
    connect(process.env.DB_URI);
  }
  static getInstance() {
    if (this.#instance) {
      console.log("DB connection already exists");
      return this.#instance;
    }
    this.#instance = new MongoConnection();
    console.log("DB connection successful");
    return this.#instance;
  }
}

export default MongoConnection;
