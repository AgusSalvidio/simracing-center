import { CartManagerDBBased } from "../CartManager/CartManagerDBBased.js";
import { MessageManagerDBBased } from "../MessageManager/MessageManagerDBBased.js";
import { ProductManagerDBBased } from "../ProductManager/ProductManagerDBBased.js";

const cartManager = new CartManagerDBBased();
const productManager = new ProductManagerDBBased();
const messageManager = new MessageManagerDBBased();

export { cartManager, productManager, messageManager };
