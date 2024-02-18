import { Router } from "express";
import passport from "passport";
import {
  ADMIN_EMAIL,
  ADMIN_PASS,
  ADMIN_ROLE,
} from "../middleware/authentication.middleware.js";
import { authToken } from "../../utils/jwt.js";

const router = Router();

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res.status(400).send({ status: "failed", payload: error.message });
    return res
      .status(200)
      .send({ status: "success", payload: "Logout Successful" });
  });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/auth/loginFail" }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: "failed", payload: "Contraseña incorrecta" });

    let role = "User";

    if (req.user.email == ADMIN_EMAIL || req.user.password == ADMIN_PASS) {
      role = ADMIN_ROLE;
    }

    req.session.user = {
      id: req.user._id,
      email: req.user.email,
      role: role,
    };

    return res
      .status(200)
      .send({ status: "success", payload: "Login Successful" });
  }
);

router.get("/loginFail", async (req, res) => {
  return res
    .status(400)
    .send({ status: "failed", payload: req.flash("error") });
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/auth/registerFail",
  }),
  async (req, res) => {
    return res
      .status(200)
      .send({ status: "success", payload: "Register Successful" });
  }
);

router.get("/registerFail", async (req, res) => {
  return res
    .status(400)
    .send({ status: "failed", payload: req.flash("error") });
});

router.get(
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
);

router.get("/current", authToken, async (req, res) => {
  res.send({ status: "success", payload: req.user });
});

export default router;
