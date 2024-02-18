import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { createHash, isValidPassword } from "../../utils/bcrypt.js";
import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { generateToken } from "../../utils/jwt.js";

const router = Router();

router.get("/logout", (req, res) => {
  return res
    .clearCookie("cookieToken")
    .status(200)
    .send({ status: "success", payload: "Logout Successful" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userManager.getUserByCredentials(email);

  if (!isValidPassword(password, user.password)) {
    return res
      .status(401)
      .send({ status: "failed", payload: "Contraseña incorrecta" });
  }

  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return res
    .status(200)
    .cookie("cookieToken", token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
    })
    .send({ status: "success", payload: "Login Successful" });
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const potentialUser = {
      firstName,
      lastName,
      email,
      password: createHash(password),
    };

    await userManager.addUser(potentialUser);

    return res
      .status(200)
      .send({ status: "success", payload: "Register Successful" });
  } catch (error) {
    throw error;
  }
});

/*router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/loginFail" }),
  async (req, res) => {
    req.session.user = {
      id: req.user._id,
      email: req.user.email,
      role: "User",
    };
    res.redirect("/products");
  }
);*/

router.get(
  "/current",
  passportCall("jwt"),
  authorization("ADMIN"),
  async (req, res) => {
    res.send({ status: "success", payload: req.user });
  }
);

export default router;
