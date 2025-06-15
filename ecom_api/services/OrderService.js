class OrderService {
  constructor(store, productService, couponService) {
    this.store = store;
    this.productService = productService;
    this.couponService = this.couponService;
  }

  /**
   * Processes the checkout for a given cart.
   * Applies discount if a valid coupon is provided.
   * Increments order count and triggers new coupon generation if applicable.
   * @param {string} cartId
   * @param {string} couponCode
   * @returns {Object}
   * @throws {Error}
   */
  checkout(cartId, couponCode) {
    const cart = this.store.carts.get(cartId);
    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found.`);
    }
    if (cart.items.size === 0) {
      throw new Error("Cannot checkout an empty cart.");
    }
    let originalCartTotal = cart.calculateTotal();
    let discountAmount = 0.0;
    let appliedCoupon = null;

    // Validate and apply discount if couponCode is provided
    if (couponCode) {
      if (this.couponService.validateAndConsumeCoupon(couponCode)) {
        discountAmount = originalCartTotal * 0.1; // 10% discount
        appliedCoupon = couponCode;
        this.store.metrics.totalDiscountAmount += discountAmount; // Update total discount
        console.log(
          `[OrderService] Discount ${discountAmount.toFixed(
            2
          )} applied with coupon ${couponCode}.`
        );
      } else {
        console.warn(
          `[OrderService] Invalid or already used coupon code: ${couponCode}. No discount applied.`
        );
        // You might choose to throw an error here, but for now, we just proceed without discount.
      }
    }

    const finalAmount = originalCartTotal - discountAmount;

    // Create the order
    const order = new Order(
      cart.toObject(),
      finalAmount,
      discountAmount,
      appliedCoupon
    );
    this.store.orders.set(order.id, order);

    // Update global metrics
    this.store.metrics.totalItemsPurchased += Array.from(
      cart.items.values()
    ).reduce((sum, item) => sum + item.quantity, 0);
    this.store.metrics.totalPurchaseAmount += finalAmount;
    this.store.metrics.totalOrdersProcessed++; // Increment total order count

    // Clear the cart after successful checkout
    this.cartService.clearCart(cartId);

    console.log(
      `[OrderService] Order ${
        order.id
      } placed successfully. Final amount: ${finalAmount.toFixed(2)}`
    );

    // --- Trigger New Coupon Generation for Nth Order (Internal Logic) ---
    // This is the primary trigger for new coupons as per "Every nth order gets a coupon"
    if (
      this.store.metrics.totalOrdersProcessed %
        this.store.NTH_ORDER_THRESHOLD ===
      0
    ) {
      // Attempt to generate a new coupon. The couponService will check if one is already available.
      const newCode = this.couponService.generateDiscountCodeIfApplicable();
      if (newCode) {
        console.log(
          `[OrderService] Nth order condition met! New coupon generated: ${newCode}`
        );
        // In a real app, you'd communicate this to the user (e.g., email, notification)
        // For this API, it's logged and available via admin metrics.
      }
    }

    return order;
  }
}

export default OrderService;
