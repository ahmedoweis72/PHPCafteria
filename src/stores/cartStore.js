import { reactive } from 'vue';

const cartState = reactive({
  items: JSON.parse(localStorage.getItem('cart')) || [],

  
  get count() {
    return this.items.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  get totalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  },

  addItem(product) {
    const existing = this.items.find(p => p.id === product.id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      this.items.push({ ...product, quantity: product.quantity || 1 });
    }
    this.save();
  },

  removeItem(productId) {
    this.items = this.items.filter(p => p.id !== productId);
    this.save();
  },

  increaseQuantity(productId) {
    const product = this.items.find(p => p.id === productId);
    if (product) {
      product.quantity += 1;
      this.save();
    }
  },

  decreaseQuantity(productId) {
    const product = this.items.find(p => p.id === productId);
    if (product && product.quantity > 1) {
      product.quantity -= 1;
      this.save();
    }
  },

  clearCart() {
    this.items = [];
    this.save();
  },

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  refreshFromLocalStorage() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }
});


window.addEventListener('storage', () => {
  cartState.refreshFromLocalStorage();
});

export default cartState;
