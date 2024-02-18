import jwt from "jsonwebtoken";

const PRIVATE_KEY = "ultraSecretTokenPassword";

const generateToken = (aUserToken) =>
  jwt.sign(aUserToken, PRIVATE_KEY, { expiresIn: "1d" });

export { generateToken, PRIVATE_KEY };
