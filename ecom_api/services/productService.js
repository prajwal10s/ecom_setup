import Product from "../models/product";

class ProductService {
  constructor(store) {
    this.store = store;
  }
  /**
   *
   * @returns {Array<Product>} List of Products from the store
   */

  getAllProducts() {
    return Array.from(this.store.products.values());
  }

  /**
   *
   * @param {string} productId
   * @returns {Object|undefined} The product object or undefined if product not found.
   */

  getProductById(productId) {
    return this.store.products.get(productId);
  }
}

export default ProductService;
