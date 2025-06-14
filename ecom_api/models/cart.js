class Cart {
  constructor(id) {
    this.id = id;
    this.items = new Map();
  }
  addItem(productId, quantity, price) {
    const existingItem = this.items.get(productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.set(productId, { productId, quantity, price });
    }
  }
  deleteItem(productId) {
    const existingItem = this.items.get(productId);
    if (existingItem) {
      this.items.delete(productId);
    }
  }
  calculateTotal() {
    let total = 0;
    for (const item of this.items.values) {
      total += total.quantity * total.price;
    }
    return total;
  }
  toObject() {
    return {
      id: this.id,
      items: Array.from(this.items.values()),
      total: this.calculateTotal(),
    };
  }
}

export default Cart;
