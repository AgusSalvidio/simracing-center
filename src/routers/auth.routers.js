import { Router } from "express";
import { userManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == ADMIN_EMAIL || password == ADMIN_PASS) {
      req.session.user = { id: "111", email: ADMIN_EMAIL, role: ADMIN_ROLE };
      return res
        .status(200)
        .send({ status: "success", payload: "Login Successful" });
    }

    const user = await userManager.getUserByCredentials(email, password);

    req.session.user = { id: user._id, email: user.email, role: "User" };

    return res
      .status(200)
      .send({ status: "success", payload: "Login Successful" });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const potentialUser = {
      firstName,
      lastName,
      email,
      password,
    };

    const registeredUser = await userManager.addUser(potentialUser);
    return res.status(200).send({ status: "success", payload: registeredUser });
  } catch (error) {
    return res.status(400).send({ status: "failed", payload: error.message });
  }
});

export default router;
