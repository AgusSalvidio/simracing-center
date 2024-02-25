import { Router } from "express";
import { messageManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { passportCall } from "../middleware/passportCall.js";

const router = Router();

router.get("/", passportCall("jwt"), async (req, res) => {
  try {
    const messages = await messageManager.getMessagesSortedByTimestamp();
    res.status(200).render("chat", {
      title: "Chat en vivo",
      user: req.user,
      messages: messages,
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("chat", {
      title: "Chat en vivo",
      user: req.user,
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

export default router;
