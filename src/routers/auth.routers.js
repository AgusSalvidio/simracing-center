import { Router } from "express";
import passport from "passport";
import {
  ADMIN_EMAIL,
  ADMIN_PASS,
  ADMIN_ROLE,
} from "../middleware/authentication.middleware.js";
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

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (email == ADMIN_EMAIL || password == ADMIN_PASS) {
//       req.session.user = { id: "111", email: ADMIN_EMAIL, role: ADMIN_ROLE };
//       return res
//         .status(200)
//         .send({ status: "success", payload: "Login Successful" });
//     }

//     const user = await userManager.getUserByCredentials(email);

//     if (isValidPassword(password, user.password)) {
//       req.session.user = { id: user._id, email: user.email, role: "User" };

//       return res
//         .status(200)
//         .send({ status: "success", payload: "Login Successful" });
//     } else {
//       return res
//         .status(401)
//         .send({ status: "failed", payload: "Contraseña incorrecta" });
//     }
//   } catch (error) {
//     return res.status(400).send({ status: "failed", payload: error.message });
//   }
// });

// router.post("/register", async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;

//     const potentialUser = {
//       firstName,
//       lastName,
//       email,
//       password: createHash(password),
//     };
//     const registeredUser = await userManager.addUser(potentialUser);
//     return res.status(200).send({ status: "success", payload: registeredUser });
//   } catch (error) {
//     return res.status(400).send({ status: "failed", payload: error.message });
//   }
// });

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

export default router;
