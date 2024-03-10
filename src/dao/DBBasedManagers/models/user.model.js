import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "users";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

userSchema.pre("find", function () {
  this.populate("cart");
});

userSchema.plugin(mongoosePaginate);

export default model(collection, userSchema);
