import { createSlice } from '@reduxjs/toolkit';

const validateCartItem = (item) => {
  return {
    id: item.id || '',
    name: item.name || 'Unknown Product',
    price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
    image: item.image_url || item.image || '',
    description: item.description || '',
    quantity: Math.max(1, parseInt(item.quantity) || 1),
    totalPrice: typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : (item.totalPrice || 0),
  };
};

const recalculateCartTotals = (state) => {
  state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    lastUpdated: Date.now(),
    isAddToCart: false,
    _persist: {
      version: -1,
      rehydrated: true
    }
  },
  reducers: {
    addToCart: (state, action) => {
      state.isAddToCart = true;
      const newItem = action.payload;
      const price = typeof newItem.price === 'string' ? parseFloat(newItem.price) : newItem.price;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (!existingItem) {
        const validatedItem = validateCartItem({
          ...newItem,
          price,
          quantity: 1,
          totalPrice: price,
        });
        state.items.push(validatedItem);
      } else {
        existingItem.quantity += 1;
        existingItem.totalPrice += price;
      }

      recalculateCartTotals(state);
      state.lastUpdated = Date.now();
      state.isAddToCart = false;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
          existingItem.totalPrice -= existingItem.price;
        }
        
        recalculateCartTotals(state);
        state.lastUpdated = Date.now();
      }
    },

    // Xóa hoàn toàn một item khỏi cart
    deleteFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      recalculateCartTotals(state);
      state.lastUpdated = Date.now();
    },

    // Update số lượng cụ thể
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        const newQuantity = Math.max(1, parseInt(quantity) || 1);
        existingItem.quantity = newQuantity;
        existingItem.totalPrice = existingItem.price * newQuantity;
        recalculateCartTotals(state);
        state.lastUpdated = Date.now();
      }
    },

    // Xóa toàn bộ cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.lastUpdated = Date.now();
    },

    // Restore cart từ localStorage (Redux Persist sẽ tự động gọi)
    restoreCart: (state, action) => {
      // eslint-disable-next-line no-unused-vars
      const { items = [], totalQuantity = 0, totalAmount = 0 } = action.payload || {};
      
      // Validate tất cả items
      state.items = items.map(validateCartItem);
      
      // Recalculate để đảm bảo data consistency
      recalculateCartTotals(state);
      state.lastUpdated = Date.now();
    },

    // Thêm action để handle khi rehydrate xong
    cartRehydrated: (state) => {
      // Validate lại data sau khi restore
      state.items = state.items.map(validateCartItem);
      recalculateCartTotals(state);
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteFromCart,
  updateCartItemQuantity,
  clearCart,
  restoreCart,
  cartRehydrated
} = cartSlice.actions;

export default cartSlice.reducer;