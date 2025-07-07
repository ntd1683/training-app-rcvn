import axios from 'axios';

console.log('API URL:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Authentication functions

export const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie');
};

export const login = async (email, password, remember) => {
  await getCsrfToken();
  return api.post('/api/login', { email, password, remember });
};

export const logout = async () => {
  await getCsrfToken();
  
  const token = localStorage.getItem('token');
  return api.post('/api/logout', {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUser = async (token) => {
  return api.get('/api/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// User management functions
export const fetchUsers = async (page = 1, perPage = 10, filters = {}) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');

    const params = {
      page,
      per_page: perPage,
      search_name: filters.filterText || undefined,
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

    const response = await api.get('/api/users', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

export const createUser = async (userData) => {
  try {
    await getCsrfToken();
    userData.is_active = userData.isActive;
    userData.is_delete = userData.isDelete;
    userData.group_role = userData.groupRole;
    const token = localStorage.getItem('token');
    const response = await api.post('/api/users', userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export const updateUser = async (id, userData) => {
  try {
    await getCsrfToken();
    userData.is_active = userData.isActive;
    userData.is_delete = userData.isDelete;
    userData.group_role = userData.groupRole;
    const token = localStorage.getItem('token');
    const response = await api.put(`/api/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export const deleteUser = async (id) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    await api.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const toggleUserStatus = async (id) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    await api.patch(`/api/users/${id}/toggle-status`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error('Error toggling status:', error);
    throw error;
  }
};