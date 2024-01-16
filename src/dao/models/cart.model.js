import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: Array,
    required: true,
  },
});

export default model("carts", cartSchema);
