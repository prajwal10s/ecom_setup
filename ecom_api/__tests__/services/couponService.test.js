import CouponService from "../../services/couponService.js";
import { jest } from "@jest/globals";

describe("CouponService", () => {
  let mockStore;
  let couponService;

  beforeEach(() => {
    // Reset mockStore to a clean state for each test
    mockStore = {
      coupon: {
        activeCode: null,
        isAvailable: false,
      },
      metrics: {
        totalOrdersProcessed: 0,
        allGeneratedCouponCodes: [],
      },
      NTH_ORDER_THRESHOLD: 3, // Default for tests
    };
    couponService = new CouponService(mockStore);

    // Spy on the internal generation method to check if it's called
    jest
      .spyOn(couponService, "generateNewCouponCode")
      .mockImplementation(() => {
        const generatedCode = `MOCKED-DISCOUNT-${mockStore.metrics.totalOrdersProcessed}`;
        mockStore.coupon.activeCode = generatedCode;
        mockStore.coupon.isAvailable = true;
        mockStore.metrics.allGeneratedCouponCodes.push(generatedCode);
        return generatedCode;
      });
  });

  afterEach(() => {
    // Restore the mock after each test
    jest.restoreAllMocks();
  });

  // --- generateCouponCodeIfApplicable (Admin API 1 Logic) ---

  test("generateCouponCodeIfApplicable should generate code if Nth order condition met and no coupon available", () => {
    mockStore.metrics.totalOrdersProcessed = 3; // Make it an Nth order
    mockStore.coupon.isAvailable = false; // No coupon available

    const generatedCode = couponService.generateCouponCodeIfApplicable();

    expect(generatedCode).toBe("MOCKED-DISCOUNT-3");
    expect(mockStore.coupon.activeCode).toBe("MOCKED-DISCOUNT-3");
    expect(mockStore.coupon.isAvailable).toBe(true);
    expect(mockStore.metrics.allGeneratedCouponCodes).toEqual([
      "MOCKED-DISCOUNT-3",
    ]);
    expect(couponService["generateNewCouponCode"]).toHaveBeenCalledTimes(1); // Check spy
  });

  test("generateCouponCodeIfApplicable should NOT generate code if totalOrdersProcessed is 0", () => {
    mockStore.metrics.totalOrdersProcessed = 0;
    mockStore.coupon.isAvailable = false;

    const generatedCode = couponService.generateCouponCodeIfApplicable();
    expect(generatedCode).toBeNull();
    expect(mockStore.coupon.activeCode).toBeNull();
    expect(mockStore.coupon.isAvailable).toBe(false);
    expect(couponService["generateNewCouponCode"]).not.toHaveBeenCalled();
  });

  test("generateCouponCodeIfApplicable should NOT generate code if not an Nth order", () => {
    mockStore.metrics.totalOrdersProcessed = 4; // Not a multiple of 3
    mockStore.coupon.isAvailable = false;

    const generatedCode = couponService.generateCouponCodeIfApplicable();
    expect(generatedCode).toBeNull();
    expect(mockStore.coupon.activeCode).toBeNull();
    expect(mockStore.coupon.isAvailable).toBe(false);
    expect(couponService["generateNewCouponCode"]).not.toHaveBeenCalled();
  });

  // --- validateAndUseCoupon ---

  test("validateAndUseCoupon should return true and consume coupon if valid and available", () => {
    mockStore.coupon.activeCode = "VALIDCODE";
    mockStore.coupon.isAvailable = true;

    const isValid = couponService.validateAndUseCoupon("VALIDCODE");

    expect(isValid).toBe(true);
    expect(mockStore.coupon.activeCode).toBeNull(); // Should be cleared
    expect(mockStore.coupon.isAvailable).toBe(false); // Should be marked as used
  });

  test("validateAndUseCoupon should return false if code does not match activeCode", () => {
    mockStore.coupon.activeCode = "VALIDCODE";
    mockStore.coupon.isAvailable = true;

    const isValid = couponService.validateAndUseCoupon("WRONGCODE");

    expect(isValid).toBe(false);
    expect(mockStore.coupon.activeCode).toBe("VALIDCODE"); // Should remain active
    expect(mockStore.coupon.isAvailable).toBe(true);
  });

  test("validateAndUseCoupon should return false if coupon is not available", () => {
    mockStore.coupon.activeCode = "VALIDCODE";
    mockStore.coupon.isAvailable = false; // Not available

    const isValid = couponService.validateAndUseCoupon("VALIDCODE");

    expect(isValid).toBe(false);
    expect(mockStore.coupon.activeCode).toBe("VALIDCODE"); // Should remain active
    expect(mockStore.coupon.isAvailable).toBe(false);
  });

  test("validateAndUseCoupon should return false if codeToValidate is null or empty", () => {
    mockStore.coupon.activeCode = "VALIDCODE";
    mockStore.coupon.isAvailable = true;

    expect(couponService.validateAndUseCoupon(null)).toBe(false);
    expect(couponService.validateAndUseCoupon("")).toBe(false);
    // State should remain unchanged
    expect(mockStore.coupon.activeCode).toBe("VALIDCODE");
    expect(mockStore.coupon.isAvailable).toBe(true);
  });

  // --- getCurrentCouponStatus ---
  test("getCurrentCouponStatus should return the correct coupon status", () => {
    mockStore.coupon.activeCode = "CURRENT_ACTIVE";
    mockStore.coupon.isAvailable = true;
    const status = couponService.getCurrentCouponStatus();
    expect(status).toEqual({ activeCode: "CURRENT_ACTIVE", isAvailable: true });
  });

  test("getCurrentCouponStatus should return null activeCode if not available", () => {
    mockStore.coupon.activeCode = null;
    mockStore.coupon.isAvailable = false;
    const status = couponService.getCurrentCouponStatus();
    expect(status).toEqual({ activeCode: null, isAvailable: false });
  });
});
