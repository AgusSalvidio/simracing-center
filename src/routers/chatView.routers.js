import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import ChatViewController from "../controllers/chatView.controller.js";

const router = Router();
const chatViewController = new ChatViewController();

router.get("/", passportCall("jwt"), chatViewController.showChat);

export default router;
