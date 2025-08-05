// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './slices/auth-user-slice';
import authCustomerReducer from './slices/auth-customer-slice';

export const store = configureStore({
  reducer: {
    auth_user: authUserReducer,
    auth_customer: authCustomerReducer,
    // user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});