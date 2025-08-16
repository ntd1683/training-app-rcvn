import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';

const authTransform = createTransform(
  (inboundState) => {
    return {
      ...inboundState,
      isLoading: false,
      isLoginLoading: false,
      isRegisterLoading: false,
      isUpdateLoading: false,
      isLogoutLoading: false,
      authError: null,
    };
  },
  (outboundState) => {
    if (outboundState.token) {
      localStorage.setItem('customer_token', outboundState.token);
    }

    return {
      ...outboundState,
      isLoading: false,
      isLoginLoading: false,
      isRegisterLoading: false,
      isUpdateLoading: false,
      isLogoutLoading: false,
      authError: null,
    };
  },
  { whitelist: ['auth_customer'] }
);

export const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totalQuantity', 'totalAmount']
};

export const authCustomerPersistConfig = {
  key: 'auth_customer',
  storage,
  whitelist: ['customer', 'token', 'isAuthenticated'],
  transforms: [authTransform],
  throttle: 1000,
};

export const wishlistPersistConfig = {
  key: 'wishlist',
  storage,
};

export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist', 'auth_customer']
};