import axios from 'axios';

const prefixApi = "/api";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getAnalytics = async () => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.get(`${prefixApi}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Authentication functions

export const login = async (email, password, remember, isAdmin) => {
  let url = `${prefixApi}/login`;
  if (isAdmin) {
    url = `${prefixApi}/admin/login`;
  }
  const response = await api.post(url, { email, password, remember });
  return response.data;
};

export const verifyTokenOauth2 = async (idToken) => {
  const response = await api.post(`${prefixApi}/auth/google/verify`, {
    id_token: idToken,
  });

  return response.data;
};

export const register = async (fullName, email, password, rePassword) => {
  const response = await api.post(
    `${prefixApi}/register`,
    { name: fullName, email, password, re_password: rePassword }
  );
  return response.data;
};

export const sendVerifyEmail = async (isAdmin = false) => {
  const url = isAdmin ? `${prefixApi}/admin/email/resend` : `${prefixApi}/email/resend`;
  const token = isAdmin ? localStorage.getItem('user_token') : localStorage.getItem('customer_token');
  const response = await api.post(url, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const verifyEmailWithToken = async (token, isAdmin = false) => {
  const url = isAdmin ? `${prefixApi}/admin/email/verify-token` : `${prefixApi}/email/verify-token`;
  const response = await api.post(url, { token });
  return response.data;
};

export const resetPassword = async (email) => {
  const response = await api.post(`${prefixApi}/password/email`, { email });
  return response.data;
};

export const changeResetPassword = async (email, password, rePassword, token) => {
  const response = await api.post(`${prefixApi}/password/reset`, {
    email,
    password,
    password_confirmation: rePassword,
    token,
  });
  return response.data;
};

// Get Profile
export const getProfileData = async (data, isAdmin = false) => {
  const url = isAdmin ? `${prefixApi}/admin/profile` : `${prefixApi}/profile`;
  if (!data) {
    throw new Error("No data provided for profile retrieval");
  }

  try {
    const token = isAdmin ? localStorage.getItem('user_token') : localStorage.getItem('customer_token');
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfileData = async (data, isAdmin = false) => {
  const url = isAdmin ? `${prefixApi}/admin/profile` : `${prefixApi}/profile`;
  try {
    const token = isAdmin ? localStorage.getItem('user_token') : localStorage.getItem('customer_token');
    const params = {
      name: data.name,
      // email: data.email,
      password: data.password || undefined,
      new_password: data.newPassword || undefined,
      new_password_confirmation: data.confirmPassword || undefined,
    };

    const response = await api.put(url, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (isAdmin = false) => {
  const token = isAdmin ? localStorage.getItem('user_token') : localStorage.getItem('customer_token');
  const url = isAdmin ? `${prefixApi}/admin/logout` : `${prefixApi}/logout`;
  const response = await api.post(url, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
};

export const verifyToken = async (isAdmin = false) => {
  try {
    const token = isAdmin ? localStorage.getItem('user_token') : localStorage.getItem('customer_token');
    const url = isAdmin ? `${prefixApi}/admin/verify-token` : `${prefixApi}/verify-token`;
    const response = await api.post(url, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async () => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.get(`${prefixApi}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// User management functions
export const fetchUsers = async (page = 1, perPage = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('user_token');

    const params = {
      page,
      per_page: perPage,
      search_name: filters.filterName || undefined,
      search_email: filters.filterEmail || undefined,
      filter_group: filters.filterGroup || undefined,
      filter_status: filters.filterStatus || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await api.get(`${prefixApi}/users`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserById = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.get(`${prefixApi}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const createUser = async (userData) => {
  try {
    userData.is_active = userData.isActive;
    userData.is_delete = userData.isDelete;
    userData.group_role = userData.groupRole;
    const token = localStorage.getItem('user_token');
    const response = await api.post(`${prefixApi}/users`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (id, userData) => {
  try {
    userData.is_active = userData.isActive;
    userData.is_delete = userData.isDelete;
    userData.group_role = userData.groupRole;
    const token = localStorage.getItem('user_token');
    const response = await api.put(`${prefixApi}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    await api.delete(`${prefixApi}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const toggleUserStatus = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    await api.patch(`${prefixApi}/users/${id}/toggle-status`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Role management functions
export const fetchRoles = async (page = 1, perPage = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('user_token');

    const params = {
      page,
      per_page: perPage,
      name: filters.filterName || undefined,
      permissions: filters.filterPermissions || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await api.get(`${prefixApi}/roles`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRoleByName = async (name) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.get(`${prefixApi}/roles/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllRoles = async () => {
  try {
    const token = localStorage.getItem('user_token');

    const response = await api.get(`${prefixApi}/roles/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRole = async (roleData) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.post(`${prefixApi}/roles`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (roleName, roleData) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.put(`${prefixApi}/roles/${roleName}`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteRole = async (roleName) => {
  try {
    const token = localStorage.getItem('user_token');
    await api.delete(`${prefixApi}/roles/${roleName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

// Permission management functions
export const fetchPermissions = async (page = 1, perPage = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('user_token');

    const params = {
      page,
      per_page: perPage,
      name: filters.filterName || undefined,
      selected: filters.selected || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await api.get(`${prefixApi}/permissions`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllPermissions = async () => {
  try {
    const token = localStorage.getItem('user_token');

    const response = await api.get(`${prefixApi}/permissions/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPermission = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.get(`${prefixApi}/permissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const createPermission = async (permissionData) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.post(`${prefixApi}/permissions`, permissionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePermission = async (id, permissionData) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.put(`${prefixApi}/permissions/${id}`, permissionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    await api.delete(`${prefixApi}/permissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

// Product management functions
export const fetchProducts = async (page = 1, perPage = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('user_token');

    const params = {
      page,
      per_page: perPage,
      name: filters.filterName || undefined,
      status: filters.filterStatus || undefined,
      price_to: filters.filterPriceTo || undefined,
      price_from: filters.filterPriceFrom || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await api.get(`${prefixApi}/products`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.get(`${prefixApi}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('currency', productData.currency);
    formData.append('status', productData.status);
    formData.append('is_delete', productData.isDelete || 0);

    if (productData.image) {
      formData.append('image', productData.image);
    }

    const token = localStorage.getItem('user_token');
    const response = await api.post(`${prefixApi}/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('currency', productData.currency);
    formData.append('status', productData.status);
    formData.append('is_delete', productData.isDelete || 0);
    formData.append('image_url', productData.image_url || '');

    if (productData.image) {
      formData.append('image', productData.image);
    }

    const token = localStorage.getItem('user_token');
    const response = await api.post(`${prefixApi}/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    await api.delete(`${prefixApi}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

// Banner management functions
export const fetchBanners = async (page = 1, perPage = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('customer_token');

    const params = {
      page,
      per_page: perPage,
      type: filters.type || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await api.get(`${prefixApi}/banners`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Order management functions
export const fetchOrders = async (page = 1, perPage = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('customer_token');

    const params = {
      page,
      per_page: perPage,
      name: filters.filterName || undefined,
      date: filters.filterDate || undefined,
      status: filters.filterStatus || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await api.get(`${prefixApi}/orders`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchOrderById = async (id) => {
  try {
    const token = localStorage.getItem('customer_token');
    const response = await api.get(`${prefixApi}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('customer_token');
    const response = await api.post(`${prefixApi}/orders/paypal/create`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('customer_token');
    const response = await api.post(`${prefixApi}/orders/paypal/approve`, { 'order_id': orderId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('customer_token');
    const response = await api.post(`${prefixApi}/orders/paypal/cancel`, { 'order_id': orderId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const errorOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('customer_token');
    const response = await api.post(`${prefixApi}/orders/paypal/error`, { 'order_id': orderId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rePayOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('customer_token');
    const response = await api.post(`${prefixApi}/orders/paypal/repay`, { 'order_id': orderId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fetch Customer : 
export const fetchCustomers = async (page = 1, perPage = 10, filters = {}) => {
  try {
    const token = localStorage.getItem('user_token');

    const params = {
      page,
      per_page: perPage,
      search_name: filters.filterName || undefined,
      search_email: filters.filterEmail || undefined,
      filter_status: filters.filterStatus || undefined,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await api.get(`${prefixApi}/customers`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCustomerById = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    const response = await api.get(`${prefixApi}/customers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const createCustomer = async (customerData) => {
  try {
    customerData.is_active = customerData.isActive;
    customerData.is_delete = customerData.isDelete;
    customerData.group_role = customerData.groupRole;
    const token = localStorage.getItem('user_token');
    const response = await api.post(`${prefixApi}/customers`, customerData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateCustomer = async (id, customerData) => {
  try {
    customerData.is_active = customerData.isActive;
    customerData.is_delete = customerData.isDelete;
    customerData.group_role = customerData.groupRole;
    const token = localStorage.getItem('user_token');
    const response = await api.put(`${prefixApi}/customers/${id}`, customerData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteCustomer = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    await api.delete(`${prefixApi}/customers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const resetDeleteCustomer = async (id) => {
  try {
    const token = localStorage.getItem('user_token');
    await api.patch(`${prefixApi}/customers/${id}/reset-delete`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    throw error;
  }
};