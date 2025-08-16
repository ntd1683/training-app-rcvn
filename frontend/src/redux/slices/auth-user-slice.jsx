import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login, logout, verifyToken
} from '~/services/api';

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth_user/initializeAuth',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const persistedToken = state.auth_user.token;
      const token = persistedToken || localStorage.getItem('customer_token');

      if (token) {
        const response = await verifyToken({ isAdmin: true });
        if (response.success) {
          const userData = response.data;
          return {
            user: userData,
            permissions: userData.permissions || [],
            token,
          };
        } else {
          throw new Error('Token verification failed');
        }
      } else {
        // Try to get cached data
        const state = getState();
        const cachedUser = state.auth_user.user || localStorage.getItem('user');
        const cachedPermissions = localStorage.getItem('user_permissions');

        if (cachedPermissions && cachedUser) {
          const parsedUser = JSON.parse(cachedUser);
          const parsedPermissions = JSON.parse(cachedPermissions);
          return {
            user: parsedUser,
            permissions: parsedPermissions,
            token: null,
          };
        }
        throw new Error('No auth data found');
      }
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_permissions');
      return rejectWithValue(error.message);
    }
  });

export const loginUser = createAsyncThunk(
  'auth_user/loginUser',
  async ({ email, password, remember }, { rejectWithValue }) => {
    try {
      const response = await login(email, password, remember, true);
      const data = response.data;

      if (response.success && data.token) {
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_permissions', JSON.stringify(data.permissions || []));

        return {
          user: data,
          permissions: data.permissions || [],
          token: data.token,
        };
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi đăng nhập');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth_user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logout({ isAdmin: true });
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_permissions');
    } catch (error) {
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_permissions');
      throw new Error('Đăng xuất thất bại. Vui lòng thử lại.');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  permissions: [],

  authError: null,

  isLoginLoading: false,
  isRegisterLoading: false,
  isUpdateLoading: false,
  isLogoutLoading: false,
};

const authSlice = createSlice({
  name: 'auth_user',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null;
    },

    setAuthData: (state, action) => {
      const { user, token, permissions } = action.payload;
      state.user = user;
      state.token = token;
      state.permissions = permissions;
      state.isAuthenticated = true;
      if (token) {
        localStorage.setItem('user_token', token);
        localStorage.setItem('user_permissions', JSON.stringify(permissions || []));
      }
    },

    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = [];
      state.isAuthenticated = false;
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_permissions');
    },
    syncTokenToLocalStorage: (state) => {
      if (state.token) {
        localStorage.setItem('user_token', state.token);
      }

      if (state.permissions) {
        localStorage.setItem('user_permissions', JSON.stringify(state.permissions || []));
      }
    },
    restoreAuthState: (state) => {
      if (state.user && state.token && state.permissions) {
        state.isAuthenticated = true;
        localStorage.setItem('user_token', state.token);
        localStorage.setItem('user_permissions', JSON.stringify(state.permissions || []));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
        state.authError = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.isAuthenticated = false;
        state.authError = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoginLoading = true;
        state.errorEmail = '';
        state.errorPassword = '';
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
        state.authError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.errorPassword = action.payload || 'Đăng nhập thất bại';
        state.authError = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLogoutLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLogoutLoading = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.isAuthenticated = false;
        state.authError = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLogoutLoading = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.isAuthenticated = false;
      });
  },
});

export const {
  clearAuthError,
  setAuthData,
  clearAuthData,
} = authSlice.actions;

export default authSlice.reducer;