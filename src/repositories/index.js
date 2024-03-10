import {
  cartManager,
  messageManager,
  userManager,
} from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import MessageRepository from "./messages.repository.js";
import UserRepository from "./users.repository.js";

const userService = new UserRepository(userManager, cartManager);
const messageService = new MessageRepository(messageManager);

export { userService, messageService };
