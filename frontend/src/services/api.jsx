import axios from 'axios';

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

export const verifyToken = async () => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.post('/api/verify-token', null ,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
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

// Role management functions
export const fetchRoles = async (page = 1, perPage = 10, filters = {}) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');

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

    const response = await api.get('/api/roles', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const fetchRoleByName = async (name) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/roles/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching role by name:', error);
    throw error;
  }
};

export const fetchAllRoles = async () => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');

    const response = await api.get('/api/roles/all', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching all roles:', error);
    throw error;
  }
};

export const createRole = async (roleData) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.post('/api/roles', roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (roleName, roleData) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.put(`/api/roles/${roleName}`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
}

export const deleteRole = async (roleName) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    await api.delete(`/api/roles/${roleName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// Permission management functions
export const fetchPermissions = async (page = 1, perPage = 10, filters = {}) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');

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

    const response = await api.get('/api/permissions', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const fetchAllPermissions = async () => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');

    const response = await api.get('/api/permissions/all', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const fetchPermission = async (id) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/permissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching permission:', error);
    throw error;
  }
}

export const createPermission = async (permissionData) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.post('/api/permissions', permissionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

export const updatePermission = async (id, permissionData) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    const response = await api.put(`/api/permissions/${id}`, permissionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    await getCsrfToken();
    const token = localStorage.getItem('token');
    await api.delete(`/api/permissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};