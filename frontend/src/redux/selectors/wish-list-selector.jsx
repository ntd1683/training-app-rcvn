import { createSelector } from '@reduxjs/toolkit';

const selectWishlist = (state) => state.wishlist;

export const selectWishlistItems = createSelector(
  [selectWishlist],
  (wishlist) => wishlist.items
);