import { connect } from "mongoose";

class MongoConnection {
  static #instance;
  constructor(DB_URI) {
    connect(DB_URI);
  }
  static getInstance(DB_URI) {
    if (this.#instance) {
      console.log("DB connection already exists");
      return this.#instance;
    }
    this.#instance = new MongoConnection(DB_URI);
    console.log("DB connection successful");
    return this.#instance;
  }
}

export default MongoConnection;
