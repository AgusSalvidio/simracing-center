import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import ChatViewController from "../controllers/chatView.controller.js";
import { authorization } from "../middleware/authorization.middleware.js";

const router = Router();
const chatViewController = new ChatViewController();

router.get(
  "/",
  passportCall("jwt"),
  authorization(["USER"]),
  chatViewController.showChat
);

export default router;
