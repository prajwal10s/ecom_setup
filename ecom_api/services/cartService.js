import { v4 } from "uuid";
import Cart from "../models/cart.js";
class CartService {
  constructor(store, productService) {
    this.store = store;
    this.productService = productService;
  }

  //get Cart from cartId or create new
  /**
   *
   * @param {string} cartId
   * @returns {Cart} cart object will be returned
   */
  getOrCreateCart(cartId) {
    let cart;
    if (cartId && this.store.carts.has(cartId)) {
      cart = this.store.carts.get(cartId);
    } else if (cartId) {
      cart = new Cart(cartId);
      this.store.carts.set(cart.id, cart);
      console.log(`[CartService] New cart created with ID: ${cart.id}`);
    } else {
      cart = new Cart(v4());
      this.store.carts.set(cart.id, cart);
      console.log(`[CartService] New cart created with ID: ${cart.id}`);
    }
    return cart;
  }

  //add item to cart
  /**
   *
   * @param {string} cartId
   * @param {string} productId
   * @param {number} quantity
   * @returns {Object} The updated cart object will be returned
   * @throws {Error} if product not found or quantity is negative
   */
  addItemToCart(cartId, productId, quantity) {
    const cart = this.store.carts.get(cartId);
    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found.`);
    }
    const product = this.productService.getProductById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    if (quantity <= 0) {
      throw new Error("Quantity must be positive.");
    }

    cart.addItem(productId, quantity, product.price);
    console.log(
      `[CartService] Added ${quantity} of ${product.name} to cart ${cartId}`
    );
    return cart.toObject();
  }

  /**
   *
   * @param {string} cartId
   * @returns {Cart} cart object will be returned
   * @throws {Error} throws error if cart is not found
   */
  getCartDetails(cartId) {
    const cart = this.store.carts.get(cartId);
    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found.`);
      return {
        message: `Error getting details. Cart with ID ${cartId} not found`,
      };
    }
    return cart.toObject();
  }
}

export default CartService;
