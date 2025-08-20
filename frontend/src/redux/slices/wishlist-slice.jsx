import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push(newItem);
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },
    toggleProductInWishlist: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        state.items = state.items.filter(item => item.id !== newItem.id);
      } else {
        state.items.push(newItem);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleProductInWishlist
} = wishlistSlice.actions;
export default wishlistSlice.reducer;