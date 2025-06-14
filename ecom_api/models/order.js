const { v4: uuidv4 } = require("uuid");
class Order {
  constructor(cartDetails, finalAmount, discountAmount, appliedCoupon) {
    this.id = uuidv4();
    this.cartDetails = cartDetails; // details from the cart at checkout
    this.totalAmount = cartDetails.total; //  Total before discount
    this.finalAmount = finalAmount; // Total after discount
    this.discountAmount = discountAmount;
    this.appliedCoupon = appliedCoupon;
    this.timestamp = new Date().toISOString();
  }
}

export default Order;
