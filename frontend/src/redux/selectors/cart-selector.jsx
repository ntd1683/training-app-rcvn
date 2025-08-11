import { createSelector } from '@reduxjs/toolkit';

const selectCart = (state) => state.cart;

export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.items
);

export const selectCartTotalQuantity = createSelector(
  [selectCart],
  (cart) => cart.totalQuantity
);

export const selectCartTotalAmount = createSelector(
  [selectCart],
  (cart) => cart.totalAmount
);

export const selectCountItemInCart = createSelector(
  [selectCartItems],
  (items) => items.length
);

export const selectIsAddToCart = createSelector(
  [selectCart],
  (cart) => cart.isAddToCart
);

export const selectTopCartItems = createSelector(
  [selectCartItems],
  (cartItems) => {
    const sortedItems = [...cartItems].sort((a, b) => b.quantity - a.quantity);
    const topItems = sortedItems.slice(0, 2);
    const remainingCount = Math.max(0, cartItems.length - 2);
    
    return {
      topItems,
      remainingCount,
      totalItems: cartItems.length
    };
  }
);