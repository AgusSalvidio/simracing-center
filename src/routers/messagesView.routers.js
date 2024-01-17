import { Router } from "express";
import { messageManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

const router = Router();

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageManager.getMessagesSortedByTimestamp();
    res.status(200).render("chat", {
      title: "Chat en vivo",
      messages: messages,
    });
  } catch (error) {
    return res.status(400).render("chat", {
      title: "Chat en vivo",
      errorMessage: error.message,
    });
  }
});

export default router;
