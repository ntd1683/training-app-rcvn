import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  register, login, logout, verifyToken, verifyEmailWithToken, sendVerifyEmail,
  resetPassword, changeResetPassword, getProfileData, updateProfileData,
  verifyTokenOauth2
} from '../../services/api';

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth_customer/initializeAuth',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const persistedToken = state.auth_customer.token;
      const token = persistedToken || localStorage.getItem('customer_token');

      if (token) {
        const response = await verifyToken();
        if (response.success) {
          const userData = response.data;
          return {
            user: userData,
            token,
          };
        } else {
          throw new Error('Token verification failed');
        }
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      localStorage.removeItem('customer_token');
      return rejectWithValue(error.message);
    }
  });

export const loginUser = createAsyncThunk(
  'auth_customer/loginUser',
  async ({ email, password, remember }, { rejectWithValue }) => {
    try {
      const response = await login(email, password, remember, false);
      const data = response.data;

      if (response.success && data.token) {
        localStorage.setItem('customer_token', data.token);

        return {
          user: data,
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

export const oauth2TokenVerify = createAsyncThunk(
  'auth_customer/oauth2TokenVerify',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await verifyTokenOauth2(idToken);
      const data = response.data;
      if (response.success && data.token) {
        localStorage.setItem('customer_token', data.token);
        return response.data.token;
      } else {
        throw new Error(response.message || 'Lỗi xác thực token');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi xác thực token');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth_customer/registerUser',
  async ({ fullName, email, password, rePassword }, { rejectWithValue }) => {
    try {
      const response = await register(fullName, email, password, rePassword);
      const data = response.data;

      if (response.success) {
        return true;
      } else {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi đăng ký');
    }
  }
);

export const verifyEmailCustomer = createAsyncThunk(
  'auth_customer/verifyEmailCustomer',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await verifyEmailWithToken(token, false);
      const data = response.data;

      if (response.success) {
        return data;
      } else {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi xác thực email');
    }
  }
);

export const sendVerifyEmailCustomer = createAsyncThunk(
  'auth_customer/sendVerifyEmailCustomer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sendVerifyEmail();
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Lỗi gửi email xác thực');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi gửi email xác thực');
    }
  }
);

export const resetPasswordCustomer = createAsyncThunk(
  'auth_customer/resetPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await resetPassword(email);
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Lỗi gửi email khôi phục mật khẩu');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi gửi email khôi phục mật khẩu');
    }
  }
);

export const changeResetPasswordCustomer = createAsyncThunk(
  'auth_customer/changeResetPassword',
  async ({ email, password, rePassword, token }, { rejectWithValue }) => {
    try {
      const response = await changeResetPassword(email, password, rePassword, token);
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Lỗi khôi phục mật khẩu, vui lòng thử lại!');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khôi phục mật khẩu, vui lòng thử lại!');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth_customer/getProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth_customer.token || localStorage.getItem('customer_token');

      if (!token) {
        throw new Error('Không có token xác thực');
      }
      const response = await getProfileData();
      if (response.success) {
        const userData = response.data;
        return {
          user: userData,
        };
      } else {
        throw new Error('Lỗi xác thực người dùng');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi lấy thông tin người dùng!');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth_customer/updateProfile',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await updateProfileData(data);

      if (response.success) {
        const userData = response.data;
        return {
          user: userData,
        };
      } else {
        throw new Error(response.message || 'Lỗi cập nhật thông tin người dùng');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật thông tin người dùng');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth_customer/logoutUser',
  // eslint-disable-next-line no-unused-vars
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      localStorage.removeItem('customer_token');
    } catch (error) {
      localStorage.removeItem('customer_token');
      throw new Error('Đăng xuất thất bại. Vui lòng thử lại.');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  customer: null,
  token: null,

  authError: null,

  isLoginLoading: false,
  isRegisterLoading: false,
  isUpdateLoading: false,
  isLogoutLoading: false,
};

const authSlice = createSlice({
  name: 'auth_customer',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null;
    },

    setAuthData: (state, action) => {
      const { customer, token } = action.payload;
      state.customer = customer;
      state.token = token;
      state.isAuthenticated = true;
      if (token) {
        localStorage.setItem('customer_token', token);
      }
    },

    clearAuthData: (state) => {
      state.customer = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('customer_token');
    },

    syncTokenToLocalStorage: (state) => {
      if (state.token) {
        localStorage.setItem('customer_token', state.token);
      }
    },

    restoreAuthState: (state) => {
      if (state.customer && state.token) {
        state.isAuthenticated = true;
        localStorage.setItem('customer_token', state.token);
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
        state.customer = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.authError = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.customer = null;
        state.token = null;
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
        state.customer = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoginAdmin = action.payload.isAdmin;
        state.authError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.errorPassword = action.payload || 'Đăng nhập thất bại';
        state.authError = action.payload;
      })

      .addCase(oauth2TokenVerify.fulfilled, (state, action) => {
        state.token = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.isRegisterLoading = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isRegisterLoading = false;
        state.authError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.authError = action.payload || 'Đăng ký thất bại';
      })

      .addCase(verifyEmailCustomer.fulfilled, (state, action) => {
        if (state.customer) {
          state.customer.email_verified_at = action.payload.email_verified_at;
        }
      })

      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customer = action.payload.user;
      })
      // eslint-disable-next-line no-unused-vars
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(updateProfile.pending, (state) => {
        state.isUpdateLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        if (state.customer && action.payload) {
          console.log({ ...state.customer, ...action.payload.user });
          state.customer = { ...state.customer, ...action.payload.user };
        }
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdateLoading = false;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLogoutLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLogoutLoading = false;
        state.customer = null;
        state.token = null;
        state.isAuthenticated = false;
        state.authError = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLogoutLoading = false;
        state.customer = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  clearAuthError,
  setAuthData,
  clearAuthData,
  restoreAuthState,
  syncTokenToLocalStorage,
} = authSlice.actions;

export default authSlice.reducer;