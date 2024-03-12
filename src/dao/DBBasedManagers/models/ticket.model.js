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
  products: {
    type: [
      {
        id: Schema.Types.ObjectId,
        name: String,
        quantity: Number,
      },
    ],
  },
});

export default model(collection, ticketSchema);
