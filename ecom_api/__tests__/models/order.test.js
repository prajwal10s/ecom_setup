import Order from "../../models/order.js";
import { jest } from "@jest/globals";

// Mock uuid to get consistent IDs for testing

describe("Order Model", () => {
  test("should initialize with correct properties", () => {
    const mockCartDetails = {
      id: "cart123",
      items: [{ productId: "p1", quantity: 1, price: 100 }],
      total: 100,
    };
    const finalAmount = 90;
    const discountAmount = 10;
    const appliedCoupon = "DISCOUNT10";

    const order = new Order(
      mockCartDetails,
      finalAmount,
      discountAmount,
      appliedCoupon
    );

    expect(order.cartDetails).toEqual(mockCartDetails);
    expect(order.totalAmount).toBe(mockCartDetails.total);
    expect(order.finalAmount).toBe(finalAmount);
    expect(order.discountAmount).toBe(discountAmount);
    expect(order.appliedCoupon).toBe(appliedCoupon);
    expect(order.timestamp).toBeDefined();
    expect(typeof order.timestamp).toBe("string");
  });
});
