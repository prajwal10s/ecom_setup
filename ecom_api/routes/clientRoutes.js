import express from "express";
import { v4 } from "uuid";
const clientRoutes = (productService, cartService) => {
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

  return router;
};
export default clientRoutes;
