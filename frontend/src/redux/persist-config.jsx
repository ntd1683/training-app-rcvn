import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';

const authCustomerTransform = createTransform(
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

const authUserTransform = createTransform(
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
      localStorage.setItem('user_token', outboundState.token);
      localStorage.setItem('user_permissions', JSON.stringify(outboundState.permissions || []));
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
  { whitelist: ['auth_user'] }
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
  transforms: [authCustomerTransform],
  throttle: 1000,
};

export const authUserPersistConfig = {
  key: 'auth_user',
  storage,
  whitelist: ['user', 'token', 'permissions', 'isAuthenticated'],
  transforms: [authUserTransform],
  throttle: 1000,
};

export const wishlistPersistConfig = {
  key: 'wishlist',
  storage,
};

export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist', 'auth_customer', 'auth_user']
};