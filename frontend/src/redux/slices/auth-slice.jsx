import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, verifyToken } from '~/services/api';

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await verifyToken();
        if (response.success) {
          const userData = response.data;
          localStorage.setItem('permissions', JSON.stringify(userData.permissions || []));
          localStorage.setItem('user', JSON.stringify(userData));
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
        const cachedPermissions = localStorage.getItem('permissions');
        const cachedUser = localStorage.getItem('user');
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
      localStorage.removeItem('token');
      localStorage.removeItem('permissions');
      localStorage.removeItem('user');
      return rejectWithValue(error.message);
    }
  });

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, remember }, { rejectWithValue }) => {
    try {
      const response = await login(email, password, remember);
      const data = response.data;

      if (response.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('permissions', JSON.stringify(data.permissions || []));
        localStorage.setItem('user', JSON.stringify(data));

        return {
          user: data,
          permissions: data.permissions || [],
          token: data.token,
        };
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('permissions');
      localStorage.removeItem('user');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('permissions');
      localStorage.removeItem('user');
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
  isLogoutLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
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
    },

    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = [];
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('permissions');
      localStorage.removeItem('user');
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