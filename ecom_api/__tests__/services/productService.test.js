import ProductService from "../../services/productService.js";
import Product from "../../models/product.js";
import { jest } from "@jest/globals";

// To create mock products for the store
describe("ProductService", () => {
  let mockStore;
  let productService;

  beforeEach(() => {
    // Reset mockStore before each test
    mockStore = {
      products: new Map(),
    };
    mockStore.products.set("prod1", new Product("prod1", "Laptop", 1200));
    mockStore.products.set("prod2", new Product("prod2", "Mouse", 25.5));

    productService = new ProductService(mockStore);
  });

  test("getAllProducts should return all products", () => {
    const products = productService.getAllProducts();
    expect(products).toEqual([
      new Product("prod1", "Laptop", 1200),
      new Product("prod2", "Mouse", 25.5),
    ]);
    expect(products.length).toBe(2);
  });

  test("getProductById should return the correct product if found", () => {
    const product = productService.getProductById("prod1");
    expect(product).toEqual(new Product("prod1", "Laptop", 1200));
  });

  test("getProductById should return undefined if product not found", () => {
    const product = productService.getProductById("nonExistentProd");
    expect(product).toBeUndefined();
  });
});
