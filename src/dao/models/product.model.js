import { Schema, model } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: Boolean,
  category: {
    type: String,
    required: true,
  },
  thumbnails: Array,
});

export default model("products", productSchema);
