import {
  cartManager,
  userManager,
} from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";
import UserRepository from "./users.repository.js";

const userService = new UserRepository(userManager, cartManager);

export { userService };
