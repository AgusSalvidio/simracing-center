import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

export default model("messages", messageSchema);
