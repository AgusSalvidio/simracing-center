import { CartManagerDBBased } from "../CartManager/CartManagerDBBased.js";
import { MessageManagerDBBased } from "../MessageManager/MessageManagerDBBased.js";
import { ProductManagerDBBased } from "../ProductManager/ProductManagerDBBased.js";
import { TicketManagerDBBased } from "../TicketManager/TicketManagerDBBased.js";
import { UserManagerDBBased } from "../UserManager/UserManagerDBBased.js";

const cartManager = new CartManagerDBBased();
const productManager = new ProductManagerDBBased();
const messageManager = new MessageManagerDBBased();
const userManager = new UserManagerDBBased();
const ticketManager = new TicketManagerDBBased();

export {
  cartManager,
  productManager,
  messageManager,
  userManager,
  ticketManager,
};
