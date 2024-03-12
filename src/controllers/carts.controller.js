import { cartService } from "../repositories/index.js";
import { ticketService } from "../repositories/index.js";

class CartController {
  constructor() {
    this.service = cartService;
  }

  addCart = async (req, res) => {
    try {
      const { _id: id } = await this.service.addCart();
      return res.status(201).send({
        status: "success",
        payload: "Se agregó correctamente el carrito",
        cartID: id.toString(),
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };

  addProductToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await this.service.addProduct(pid, cid);
      return res.status(201).send({
        status: "success",
        payload: "Se agregó correctamente el producto al carrito",
      });
    } catch (error) {
      return res
        .status(400)
        .send({ status: "failed", description: error.message });
    }
  };

  getCartByID = async (req, res) => {
    try {
      const { cid } = req.params;
      const foundCart = await this.service.getCartById(cid);
      return res.status(200).send(foundCart.products);
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await this.service.deleteProductOn(cid, pid);
      return res.status(200).send({
        status: "success",
        payload: `Se eliminó correctamente el producto con ID ${pid} del carrito con ID ${cid}`,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };

  deleteAllProducts = async (req, res) => {
    try {
      const { cid } = req.params;
      await this.service.deleteAllProductsOn(cid);
      return res.status(200).send({
        status: "success",
        payload: `Se eliminaron todos los productos correctamente del carrito con ID ${cid}`,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };

  updateCartWith = async (req, res) => {
    try {
      const { cid } = req.params;
      const potentialProducts = req.body;
      await this.service.updateCartWith(cid, potentialProducts);
      return res.status(200).send({
        status: "success",
        payload: `Se actualizó correctamente el carrito con ID ${cid}`,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };

  updateProductsQuantity = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await this.service.updateProductQuantityIn(cid, pid, quantity);
      return res.status(200).send({
        status: "success",
        payload: `Se actualizó correctamente la cantidad de productos con ID ${pid} carrito con ID ${cid}`,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };

  completePurchase = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await this.getCartByID(cid);
      console.table(cart);
      //const ticket = await this.ticketService.addTicket(cid,);
      return res.status(200).send({
        status: "success",
        payload: `Se realizó la compra correctamente`,
      });
    } catch (error) {
      return res.status(400).send({ status: "failed", payload: error.message });
    }
  };
}

export default CartController;
