import jwt from "jsonwebtoken";
import { config } from "../src/config/config.js";

const JWT_SECRET_KEY = config.JWT_SECRET_KEY;

const generateToken = (aUserToken) =>
  jwt.sign(aUserToken, JWT_SECRET_KEY, { expiresIn: "1d" });

export { generateToken, JWT_SECRET_KEY };
