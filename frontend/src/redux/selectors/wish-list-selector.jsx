import { createSelector } from '@reduxjs/toolkit';

const selectWishlist = (state) => state.wishlist;

export const selectWishlistItems = createSelector(
  [selectWishlist],
  (wishlist) => wishlist.items
);

export const selectIsItemInWishlist = (itemId) => createSelector(
  [selectWishlistItems],
  (items) => items.some(item => item.id === itemId)
);

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);