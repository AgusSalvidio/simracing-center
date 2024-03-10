import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

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

productSchema.plugin(mongoosePaginate);

export default model(collection, productSchema);
