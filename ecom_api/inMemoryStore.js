import { uuidv4 } from "uuid";

//This store will be our in-memory store
const store = {
  //key=productId, value = product model
  products: new Map(),

  orders: new Map(),
  // orderId -> { id, cartDetails, totalAmount, discountAmount, appliedCoupon, timestamp }

  carts: new Map(),

  coupon: {
    activeCode: null,
    isActive: false,
  },

  // Metrics for admin reports
  metrics: {
    totalItemsPurchased: 0,
    totalPurchaseAmount: 0, // Sum of final amounts after discount
    totalDiscountAmount: 0, // Sum of all discounts given
    totalOrdersProcessed: 0, // Total count of successful checkouts
    allGeneratedCouponCodes: [], // History of all generated codes
  },

  // Business rule: Every Nth order generates a coupon
  NTH_ORDER_THRESHOLD: 3,
};

store.products.set("product1", {
  id: "product1",
  name: "Laptop",
  price: 1200.0,
});
store.products.set("product2", { id: "product2", name: "Mouse", price: 25.5 });
store.products.set("product3", {
  id: "product3",
  name: "Keyboard",
  price: 75.0,
});
store.products.set("product4", {
  id: "product4",
  name: "Monitor",
  price: 300.0,
});
store.products.set("product5", { id: "product5", name: "Webcam", price: 50.0 });

console.log("Our In Memory Store has been initialised");

module.exports = store;
