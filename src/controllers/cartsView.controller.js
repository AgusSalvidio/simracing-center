import { cartService, ticketService } from "../repositories/index.js";

class CartViewController {
  constructor() {
    this.service = cartService;
  }

  showCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await this.service.getCartById(cid);
      res.status(200).render("cart", {
        title: "Carrito",
        user: req.user,
        cartID: cid,
        products: cart.products,
        totalAmount: cart.totalAmount(),
        totalQuantity: cart.totalQuantity(),
        style: "../../css/index.css",
      });
    } catch (error) {
      return res.status(400).render("cart", {
        title: "Carrito",
        user: req.user,
        errorMessage: error.message,
        style: "../../css/index.css",
      });
    }
  };

  completePurchase = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await this.service.getCartById(cid);
      const ticket = await ticketService.addTicketWith(cart, req.user.email);
      return res.status(200).send({
        status: "success",
        payload: `Se realizó la compra correctamente`,
        ticket: ticket,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };
}

export default CartViewController;
