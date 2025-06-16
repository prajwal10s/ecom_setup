import OrderService from "../../services/OrderService.js";
import Cart from "../../models/cart.js";
import Order from "../../models/order.js";
import { jest } from "@jest/globals";

describe("OrderService", () => {
  let mockStore;
  let mockCartService;
  let mockCouponService;
  let orderService;
  let testCartId;
  let testCart;

  beforeEach(() => {
    // Reset the entire store for isolation
    mockStore = {
      products: new Map(), // Not directly used in checkout logic, but part of store
      carts: new Map(),
      orders: new Map(),
      coupon: {
        activeCode: null,
        isAvailable: false,
      },
      metrics: {
        totalItemsPurchased: 0,
        totalPurchaseAmount: 0,
        totalDiscountAmount: 0,
        totalOrdersProcessed: 0,
        allGeneratedCouponCodes: [],
      },
      NTH_ORDER_THRESHOLD: 3,
    };

    // Setup a test cart with items
    testCartId = "test-cart-id-for-order";
    testCart = new Cart(testCartId);
    testCart.addItem("prod1", 2, 100); // Total 200
    testCart.addItem("prod2", 1, 50); // Total 50
    mockStore.carts.set(testCartId, testCart);

    // Mock dependencies (CartService and CouponService)
    mockCartService = {
      clearCart: jest.fn(),
      getCartDetails: jest.fn().mockReturnValue(testCart.toObject()),
    };
    mockCouponService = {
      validateAndUseCoupon: jest.fn(),
      generateCouponCodeIfApplicable: jest.fn(),
    };

    orderService = new OrderService(
      mockStore,
      mockCartService,
      mockCouponService
    );

    // Reset metrics before each test, specifically totalOrdersProcessed
    mockStore.metrics.totalOrdersProcessed = 0;
  });

  test("checkout should throw an error if cart not found", () => {
    expect(() => orderService.checkout("non-existent-cart-id")).toThrow(
      "Cart with ID non-existent-cart-id not found."
    );
  });

  test("checkout should throw an error if cart is empty", () => {
    const emptyCartId = "empty-cart-id";
    const emptyCart = new Cart(emptyCartId);
    mockStore.carts.set(emptyCartId, emptyCart);

    expect(() => orderService.checkout(emptyCartId)).toThrow(
      "Cannot checkout an empty cart."
    );
  });

  test("checkout should process order without coupon and update metrics", () => {
    const initialTotalItems = mockStore.metrics.totalItemsPurchased;
    const initialTotalPurchase = mockStore.metrics.totalPurchaseAmount;
    const initialTotalOrders = mockStore.metrics.totalOrdersProcessed;

    const order = orderService.checkout(testCartId);

    expect(order).toBeInstanceOf(Order);
    expect(order.finalAmount).toBe(250);
    expect(order.discountAmount).toBe(0);
    expect(order.appliedCoupon).toBeNull();

    expect(mockStore.orders.has(order.id)).toBe(true);

    expect(mockStore.metrics.totalItemsPurchased).toBe(initialTotalItems + 3); // 2+1
    expect(mockStore.metrics.totalPurchaseAmount).toBe(
      initialTotalPurchase + 250
    );
    expect(mockStore.metrics.totalDiscountAmount).toBe(0);
    expect(mockStore.metrics.totalOrdersProcessed).toBe(initialTotalOrders + 1);
    expect(
      mockCouponService.generateCouponCodeIfApplicable
    ).not.toHaveBeenCalled(); // Not an Nth order yet
  });

  test("checkout should apply discount if valid coupon is provided", () => {
    mockCouponService.validateAndUseCoupon.mockReturnValue(true); // Simulate valid coupon

    const initialTotalDiscount = mockStore.metrics.totalDiscountAmount;

    const order = orderService.checkout(testCartId, "VALID_COUPON");

    expect(mockCouponService.validateAndUseCoupon).toHaveBeenCalledWith(
      "VALID_COUPON"
    );
    expect(order.finalAmount).toBe(250 * 0.9); // 10% discount
    expect(order.discountAmount).toBe(250 * 0.1);
    expect(order.appliedCoupon).toBe("VALID_COUPON");
    expect(mockStore.metrics.totalDiscountAmount).toBe(
      initialTotalDiscount + 250 * 0.1
    );
  });

  test("checkout should not apply discount if invalid coupon is provided", () => {
    mockCouponService.validateAndUseCoupon.mockReturnValue(false); // Simulate invalid coupon

    const initialTotalDiscount = mockStore.metrics.totalDiscountAmount;

    const order = orderService.checkout(testCartId, "INVALID_COUPON");

    expect(mockCouponService.validateAndUseCoupon).toHaveBeenCalledWith(
      "INVALID_COUPON"
    );
    expect(order.finalAmount).toBe(250); // No discount
    expect(order.discountAmount).toBe(0);
    expect(order.appliedCoupon).toBeNull();
    expect(mockStore.metrics.totalDiscountAmount).toBe(initialTotalDiscount);
  });

  test("checkout should trigger coupon generation on Nth order", () => {
    mockStore.metrics.totalOrdersProcessed = 2; // Simulate 2 orders already processed
    mockStore.NTH_ORDER_THRESHOLD = 3; // Nth order is 3

    orderService.checkout(testCartId); // This is the 3rd order

    expect(mockStore.metrics.totalOrdersProcessed).toBe(3);
    expect(
      mockCouponService.generateCouponCodeIfApplicable
    ).toHaveBeenCalledTimes(1);
  });

  test("checkout should not trigger coupon generation if not Nth order", () => {
    mockStore.metrics.totalOrdersProcessed = 1; // Simulate 1 order processed
    mockStore.NTH_ORDER_THRESHOLD = 3;

    orderService.checkout(testCartId); // This is the 2nd order

    expect(mockStore.metrics.totalOrdersProcessed).toBe(2);
    expect(
      mockCouponService.generateCouponCodeIfApplicable
    ).not.toHaveBeenCalled();
  });

  test("checkout should trigger coupon generation on subsequent Nth orders", () => {
    mockStore.metrics.totalOrdersProcessed = 2;
    mockStore.NTH_ORDER_THRESHOLD = 3;

    // 3rd order
    orderService.checkout(testCartId);
    expect(
      mockCouponService.generateCouponCodeIfApplicable
    ).toHaveBeenCalledTimes(1);

    // 4th order
    mockStore.carts.set("cart-4", new Cart("cart-4")); // Need a new cart for next order
    mockStore.carts.get("cart-4").addItem("prod1", 1, 100);
    orderService.checkout("cart-4");
    expect(
      mockCouponService.generateCouponCodeIfApplicable
    ).toHaveBeenCalledTimes(1); // Still 1

    // 5th order
    mockStore.carts.set("cart-5", new Cart("cart-5"));
    mockStore.carts.get("cart-5").addItem("prod1", 1, 100);
    orderService.checkout("cart-5");
    expect(
      mockCouponService.generateCouponCodeIfApplicable
    ).toHaveBeenCalledTimes(1); // Still 1

    // 6th order (Another Nth order)
    mockStore.carts.set("cart-6", new Cart("cart-6"));
    mockStore.carts.get("cart-6").addItem("prod1", 1, 100);
    orderService.checkout("cart-6");
    expect(
      mockCouponService.generateCouponCodeIfApplicable
    ).toHaveBeenCalledTimes(2); // Now 2
  });
});
