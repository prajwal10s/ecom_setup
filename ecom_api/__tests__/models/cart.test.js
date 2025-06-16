import Cart from "../../models/cart.js";
import { jest } from "@jest/globals";

describe("Cart Model", () => {
  let cart;

  beforeEach(() => {
    // Create a fresh cart for each test
    cart = new Cart("test-cart-id");
  });

  test("should initialize with correct id and empty items", () => {
    expect(cart.id).toBe("test-cart-id");
    expect(cart.items.size).toBe(0);
    expect(cart.calculateTotal()).toBe(0);
  });

  test("should add a new item to the cart", () => {
    cart.addItem("prod1", 1, 100);
    expect(cart.items.size).toBe(1);
    expect(cart.items.get("prod1")).toEqual({
      productId: "prod1",
      quantity: 1,
      price: 100,
    });
    expect(cart.calculateTotal()).toBe(100);
  });

  test("should update quantity if item already exists", () => {
    cart.addItem("prod1", 1, 100);
    cart.addItem("prod1", 2, 100); // Add more quantity
    expect(cart.items.size).toBe(1);
    expect(cart.items.get("prod1")).toEqual({
      productId: "prod1",
      quantity: 3,
      price: 100,
    });
    expect(cart.calculateTotal()).toBe(300);
  });

  test("should calculate total correctly with multiple items", () => {
    cart.addItem("prod1", 1, 100);
    cart.addItem("prod2", 2, 25.5);
    expect(cart.calculateTotal()).toBe(100 + 2 * 25.5); // 100 + 51 = 151
  });

  test("should return correct object representation with toObject()", () => {
    cart.addItem("prod1", 1, 100);
    cart.addItem("prod2", 2, 25.5);
    const cartObj = cart.toObject();
    expect(cartObj).toEqual({
      id: "test-cart-id",
      items: [
        { productId: "prod1", quantity: 1, price: 100 },
        { productId: "prod2", quantity: 2, price: 25.5 },
      ],
      total: 151,
    });
    // Ensure it's a deep copy (or at least not the internal Map directly)
    expect(Array.isArray(cartObj.items)).toBe(true);
  });
});
