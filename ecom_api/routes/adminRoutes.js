import express from "express";

const adminRoutes = (couponService, store) => {
  const router = express.Router();

  /**
   * @api {get} /admin/metrics Get Store Metrics
   * @apiName GetStoreMetrics
   */
  router.get("/admin/generate-coupon-code", (req, res) => {
    const metrics = store.metrics;
    const couponState = store.coupon;
    const N_THRESHOLD = store.NTH_ORDER_THRESHOLD;

    if (metrics.totalOrdersProcessed === 0) {
      return res.status(400).json({
        message:
          "No orders have been processed yet to trigger coupon generation.",
      });
    }
    if (metrics.totalOrdersProcessed % N_THRESHOLD !== 0) {
      return res.status(400).json({
        message: `Condition not met: Current order count (${metrics.totalOrdersProcessed}) is not a multiple of N (${N_THRESHOLD}).`,
      });
    }

    // If all conditions pass, generate the code
    const newCode = couponService.generateCouponCodeIfApplicable();
    // This will return the code or null

    if (newCode) {
      res.status(201).json({
        message: "Discount code generated successfully.",
        couponCode: newCode,
      });
    } else {
      // This case should ideally not be hit if our checks are correct but just in case to add more checks
      res.status(500).json({
        message:
          "Failed to generate discount code due to an unexpected internal state.",
      });
    }
  });

  router.get("/admin/metrics", (req, res) => {
    const metrics = {
      ...store.metrics, // Copy all existing metrics
      currentActiveCouponCode: store.coupon.activeCode,
      isCouponAvailable: store.coupon.isAvailable,
      NTH_ORDER_THRESHOLD: store.NTH_ORDER_THRESHOLD,
    };
    res.json(metrics);
  });

  return router;
};

export default adminRoutes;
