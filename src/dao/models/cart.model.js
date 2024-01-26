import { Schema, model } from "mongoose";

const collection = "carts";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
  },
});

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

export default model(collection, cartSchema);
