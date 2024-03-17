import {
  cartService,
  ticketService,
  productService,
} from "../repositories/index.js";

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

  updateCartWith = async (aProductCollection, aCartID) => {
    if (aProductCollection.length) {
      for (const item of aProductCollection) {
        const pid = item.product._id;
        const updatedStock = item.product.stock - item.quantity;
        await productService.updateProductStock(pid, updatedStock);
        await this.service.deleteProductOn(aCartID, pid);
      }
    }
  };

  completePurchase = async (req, res) => {
    try {
      const { cid } = req.params;
      let cart = await this.service.getCartById(cid);

      let inStockProducts = [];

      cart.products.forEach((item) => {
        if (item.product.stock >= item.quantity) inStockProducts.push(item);
      });

      await this.updateCartWith(inStockProducts, cid);

      cart = await this.service.getCartById(cid);

      if (inStockProducts.length) {
        const ticket = await ticketService.addTicketWith(
          inStockProducts,
          req.user.email
        );
        let responseContents = {
          status: "success",
          payload: `Se realizó la compra correctamente`,
          ticket: ticket,
          hasUnpurchasedProducts: false,
        };
        if (cart.products.length) {
          responseContents.hasUnpurchasedProducts = true;
        }
        return res.status(200).send(responseContents);
      } else {
        return res.status(400).send({
          status: "failed",
          payload: `Productos fuera de stock`,
          hasUnpurchasedProducts: true,
        });
      }
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };
}

export default CartViewController;
