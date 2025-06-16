class CouponService {
  constructor(store) {
    this.store = store;
  }

  /**
   * method to generate a coupon code
   * this method can be reused in case the condition change for us generating coupon code
   *
   * @returns {string}
   */
  generateNewCouponCode() {
    const newCode = `DISCOUNT-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    this.store.coupon.activeCode = newCode;
    this.store.coupon.isAvailable = true;
    this.store.metrics.allGeneratedCouponCodes.push(newCode); // Track all generated codes
    console.log(`[CouponService] Generated new active coupon: ${newCode}`);
    return newCode;
  }

  /**
   * below method will check for the applicable conditions and then only call the generate code method
   *
   * @returns {string|null}
   */
  generateCouponCodeIfApplicable() {
    const metrics = this.store.metrics;
    const couponState = this.store.coupon;
    const N_THRESHOLD = this.store.NTH_ORDER_THRESHOLD;

    // Condition to be checked:
    // 1. Is totalOrdersProcessed a multiple of N? (Only if > 0)
    // 2. Even if the previous one wasn't used we replace it with the new coupon code

    if (
      metrics.totalOrdersProcessed > 0 &&
      metrics.totalOrdersProcessed % N_THRESHOLD === 0
    ) {
      return this.generateNewCouponCode(); // Generate if conditions are met and set the isAvailable to true from the rbaove internal function
    }
    console.log(
      `[CouponService] Admin generation request: Condition not met (Orders: ${metrics.totalOrdersProcessed}, N: ${N_THRESHOLD})`
    );
    return null; // Condition not met, no code generated and returned null
  }

  /**
   * validation and set the coupon as unavailable after use
   *
   * @param {string} inputCoupon
   * @returns {boolean}
   */
  validateAndUseCoupon(inputCoupon) {
    const currentCouponState = this.store.coupon;

    if (
      inputCoupon &&
      inputCoupon === currentCouponState.activeCode &&
      currentCouponState.isAvailable
    ) {
      currentCouponState.isAvailable = false;
      currentCouponState.activeCode = null;
      console.log(
        `[CouponService] Coupon ${inputCoupon} successfully used and invalidated.`
      );
      this.store.metrics.totalDiscountAmount;
      return true;
    }
    console.log(
      `[CouponService] Coupon ${inputCoupon} validation failed. Active: ${currentCouponState.activeCode}, Available: ${currentCouponState.isAvailable}`
    );
    return false;
  }

  /**
   *
   * @returns {Object} returns the coupon state object
   */
  getCurrentCouponStatus() {
    return {
      activeCode: this.store.coupon.activeCode,
      isAvailable: this.store.coupon.isAvailable,
    };
  }
}

export default CouponService;
