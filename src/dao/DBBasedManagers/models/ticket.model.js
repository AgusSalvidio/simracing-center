import { Schema, model } from "mongoose";

const collection = "tickets";

const ticketSchema = new Schema({
  purchaseDateTime: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

export default model(collection, ticketSchema);
