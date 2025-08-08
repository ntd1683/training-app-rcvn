import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // sử dụng localStorage
import { combineReducers } from '@reduxjs/toolkit';

// Import các reducers
import authUserReducer from './slices/auth-user-slice';
import authCustomerReducer from './slices/auth-customer-slice';
import productsReducer from './slices/products-slice';
import cartReducer from './slices/cart-slice';
import wishlistReducer from './slices/wishlist-slice';
import { cartPersistConfig, wishlistPersistConfig, persistConfig } from './persist-config';

const rootReducer = combineReducers({
  auth_user: authUserReducer,
  auth_customer: authCustomerReducer,
  products: productsReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER'
        ],
      },
    }),
});

export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;