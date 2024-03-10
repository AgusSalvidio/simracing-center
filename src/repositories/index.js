import {
  cartManager,
  messageManager,
  productManager,
  userManager,
} from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

import MessageRepository from "./messages.repository.js";
import ProductRepository from "./products.repository.js";
import UserRepository from "./users.repository.js";
import CartRepository from "./carts.repository.js";

const userService = new UserRepository(userManager, cartManager);
const messageService = new MessageRepository(messageManager);
const productService = new ProductRepository(productManager);
const cartService = new CartRepository(cartManager);

export { userService, messageService, productService, cartService };
