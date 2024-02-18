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

/*
 //Here we should look for the registeredUser in DB to obtain the data.

 const user = userManager.findUserIdentifiedAs(req.user)

 const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

*/

export { generateToken, authToken };
