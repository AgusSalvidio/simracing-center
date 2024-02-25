import { messageManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
class ChatViewController {
  constructor() {
    this.service = messageManager;
  }
  showChat = async (req, res) => {
    try {
      const messages = await this.service.getMessagesSortedByTimestamp();
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
  };
}

export default ChatViewController;
