import { Router } from "express";
import { messageManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import { auth } from "../middleware/authentication.middleware.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const messages = await messageManager.getMessagesSortedByTimestamp();
    res.status(200).render("chat", {
      title: "Chat en vivo",
      messages: messages,
      style: "index.css",
    });
  } catch (error) {
    return res.status(400).render("chat", {
      title: "Chat en vivo",
      errorMessage: error.message,
      style: "index.css",
    });
  }
});

export default router;
