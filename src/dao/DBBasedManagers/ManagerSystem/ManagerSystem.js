import { CartManagerDBBased } from "../CartManager/CartManagerDBBased.js";
import { ProductManagerDBBased } from "../ProductManager/ProductManagerDBBased.js";

const cartManager = new CartManagerDBBased();
const productManager = new ProductManagerDBBased();

export { cartManager, productManager };
