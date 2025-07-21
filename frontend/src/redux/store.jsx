// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});