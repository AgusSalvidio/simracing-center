import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import passport from "passport";
import AuthController from "../controllers/auth.controller.js";

const router = Router();
const authController = new AuthController();

router.get("/logout", authController.logout);

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "authFail" }),
  authController.githubcallback
);

router.get("/current", passportCall("jwt"), authController.current);

export default router;
