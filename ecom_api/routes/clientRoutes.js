import express from "express";
import { v4 } from "uuid";
const clientRoutes = (productService, cartService, orderService) => {
  const router = express.Router();

  //router endpoint to get all the products
  /**
   * @apiMethod {get}
   * @apiName getAllProducts
   * @apiSuccess {Object[]} Array of product object
   */
  router.get("/products", (req, res) => {
    const products = productService.getAllProducts();
    res.json(products);
  });

  //router endpoint to  create or get car
  /**
   * @apiMethod {GET}
   * @apiName getOrCreateCart
   * @apiSuccess {Object} Cart Object
   */
  router.get("/cart", (req, res) => {
    try {
      const cartId = req.query.cartId;
      const cart = cartService.getOrCreateCart(cartId);
      res.send(cart.toObject());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  //router endpoint to add an item to a cart
  /**
   * @apiMethod {POST}
   * @apiName addItemsToCart
   * @apiSuccess {Object} The cart object.
   */
  router.post("/cart/add", (req, res) => {
    const { cartId, productId, quantity } = req.body;
    if (!cartId || !productId || !quantity) {
      return res
        .status(400)
        .json({ error: "cartId, productId, and quantity are required." });
    }
    if (typeof quantity !== number || quantity <= 0) {
      return res.status(400).json({ error: "Quantity invalid" });
    }
    try {
      const updatedCart = cartService.addItemToCart(
        cartId,
        productId,
        quantity
      );
      res.json(updatedCart);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

  //router endpoint to get the cart details
  router.get("/cart/:cartId", (req, res) => {
    try {
      const carId = req.params.cartId;
      const cart = cartService.getCartDetails(cartId);
      res.json(cart);
    } catch (error) {
      console.error(`Error getting cart details: ${error.message}`);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.post("/checkout", (req, res) => {
    const { cartId, couponCode } = req.body;

    if (!cartId) {
      return res
        .status(400)
        .json({ error: "cartId is required for checkout." });
    }

    try {
      const order = orderService.checkout(cartId, couponCode);
      res.status(201).json({
        message: "Order placed successfully!",
        order: order,
      });
    } catch (error) {
      console.error(`Error during checkout: ${error.message}`);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });
  return router;
};
export default clientRoutes;
