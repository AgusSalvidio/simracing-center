import { cartManager } from "../dao/DBBasedManagers/ManagerSystem/ManagerSystem.js";

class CartViewController {
  constructor() {
    this.service = cartManager;
  }

  showCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = await this.service.getCartById(cid);
      res.status(200).render("cart", {
        title: "Carrito",
        session: req.user,
        cartID: cid,
        products: products,
        style: "../../css/index.css",
      });
    } catch (error) {
      return res.status(400).render("cart", {
        title: "Carrito",
        session: req.user,
        errorMessage: error.message,
        style: "../../css/index.css",
      });
    }
  };
}

export default CartViewController;
