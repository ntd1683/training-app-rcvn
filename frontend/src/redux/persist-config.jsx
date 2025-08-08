import storage from 'redux-persist/lib/storage';

export const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totalQuantity', 'totalAmount']
};

export const wishlistPersistConfig = {
  key: 'wishlist',
  storage,
};

export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist']
};