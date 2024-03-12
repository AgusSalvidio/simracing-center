import {
  cartManager,
  messageManager,
  productManager,
  userManager,
  ticketManager,
} from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

import MessageRepository from "./messages.repository.js";
import ProductRepository from "./products.repository.js";
import UserRepository from "./users.repository.js";
import CartRepository from "./carts.repository.js";
import TicketRepository from "./tickets.repository.js";

const userService = new UserRepository(userManager, cartManager);
const messageService = new MessageRepository(messageManager);
const productService = new ProductRepository(productManager);
const cartService = new CartRepository(cartManager);
const ticketService = new TicketRepository(ticketManager);

export {
  userService,
  messageService,
  productService,
  cartService,
  ticketService,
};
