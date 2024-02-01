import { CartManagerDBBased } from "../CartManager/CartManagerDBBased.js";
import { MessageManagerDBBased } from "../MessageManager/MessageManagerDBBased.js";
import { ProductManagerDBBased } from "../ProductManager/ProductManagerDBBased.js";
import { UserManagerDBBased } from "../UserManager/UserManagerDBBased.js";

const cartManager = new CartManagerDBBased();
const productManager = new ProductManagerDBBased();
const messageManager = new MessageManagerDBBased();
const userManager = new UserManagerDBBased();

export { cartManager, productManager, messageManager, userManager };
