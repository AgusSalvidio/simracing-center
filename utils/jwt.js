import jwt from "jsonwebtoken";

const PRIVATE_KEY = "ultraSecretTokenPassword";

const generateToken = (aUserToken) =>
  jwt.sign(aUserToken, PRIVATE_KEY, { expiresIn: "1d" });

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res
      .status(401)
      .send({ status: "failed", payload: "No authenticated" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, PRIVATE_KEY, (error, decodedUser) => {
    if (error)
      return res.status(401).send({ status: "failed", payload: "Authorized!" });

    req.user = decodedUser;
    next();
  });
};

export { generateToken, authToken, PRIVATE_KEY };
