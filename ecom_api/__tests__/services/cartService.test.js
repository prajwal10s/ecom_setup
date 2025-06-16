import CartService from "../../services/cartService.js";
import ProductService from "../../services/productService.js";
import Product from "../../models/product.js";
import Cart from "../../models/cart.js";
import { jest } from "@jest/globals";

describe("CartService", () => {
  let mockStore;
  let productService;
  let cartService;

  beforeEach(() => {
    mockStore = {
      products: new Map(),
      carts: new Map(),
    };
    mockStore.products.set("prod1", new Product("prod1", "Laptop", 1200));
    mockStore.products.set("prod2", new Product("prod2", "Mouse", 25.5));

    productService = new ProductService(mockStore);
    cartService = new CartService(mockStore, productService);
  });

  test("getOrCreateCart should create a new cart if no ID provided", () => {
    const cart = cartService.getOrCreateCart("mock-cart-id");
    expect(cart.id).toBe("mock-cart-id");
    expect(mockStore.carts.has("mock-cart-id")).toBe(true);
  });

  test("getOrCreateCart should return existing cart if ID provided and exists", () => {
    const existingCart = new Cart("existing-cart-id");
    mockStore.carts.set("existing-cart-id", existingCart);

    const cart = cartService.getOrCreateCart("existing-cart-id");
    expect(cart.id).toBe("existing-cart-id");
    expect(cart).toBe(existingCart); // Should be the same object reference
  });

  test("addItemToCart should add a new item and return updated cart object", () => {
    const cart = cartService.getOrCreateCart("mock-cart-id");
    const updatedCart = cartService.addItemToCart(cart.id, "prod1", 1);

    expect(updatedCart.items.length).toBe(1);
    expect(updatedCart.items[0]).toEqual({
      productId: "prod1",
      quantity: 1,
      price: 1200,
    });
    expect(updatedCart.total).toBe(1200);
    expect(mockStore.carts.get(cart.id).items.get("prod1").quantity).toBe(1);
  });

  test("addItemToCart should update quantity of existing item", () => {
    const cart = cartService.getOrCreateCart();
    cartService.addItemToCart(cart.id, "prod1", 1);
    const updatedCart = cartService.addItemToCart(cart.id, "prod1", 2);

    expect(updatedCart.items.length).toBe(1);
    expect(updatedCart.items[0]).toEqual({
      productId: "prod1",
      quantity: 3,
      price: 1200,
    });
    expect(updatedCart.total).toBe(3600);
    expect(mockStore.carts.get(cart.id).items.get("prod1").quantity).toBe(3);
  });

  test("addItemToCart should throw error if cart not found", () => {
    expect(() =>
      cartService.addItemToCart("non-existent-cart", "prod1", 1)
    ).toThrow("Cart with ID non-existent-cart not found.");
  });

  test("addItemToCart should throw error if product not found", () => {
    const cart = cartService.getOrCreateCart();
    expect(() =>
      cartService.addItemToCart(cart.id, "nonExistentProd", 1)
    ).toThrow("Product with ID nonExistentProd not found.");
  });

  test("addItemToCart should throw error if quantity is zero or less", () => {
    const cart = cartService.getOrCreateCart();
    expect(() => cartService.addItemToCart(cart.id, "prod1", 0)).toThrow(
      "Quantity must be positive."
    );
    expect(() => cartService.addItemToCart(cart.id, "prod1", -5)).toThrow(
      "Quantity must be positive."
    );
  });

  test("getCartDetails should return cart details if found", () => {
    const cart = cartService.getOrCreateCart();
    cartService.addItemToCart(cart.id, "prod1", 1);
    const details = cartService.getCartDetails(cart.id);
    expect(details.id).toBe(cart.id);
    expect(details.total).toBe(1200);
  });

  test("getCartDetails should throw error if cart not found", () => {
    expect(() => cartService.getCartDetails("non-existent-cart")).toThrow(
      "Cart with ID non-existent-cart not found."
    );
  });
});
