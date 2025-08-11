import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_PROVINCES_URL || 'https://tinhthanhpho.com';
const API_KEY = import.meta.env.VITE_KEY_SECRET_PROVICES_API || '';
const prefixApi = "/api/v1";
const api = axios.create({
  baseURL: API_BASE_URL + prefixApi,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export const getProvinces = async () => {
  try {
    const response = await api.get('/new-provinces');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getWardsByProvince = async (provinceCode) => {
  try {
    const response = await api.get(`/new-provinces/${provinceCode}/wards`);
    return response.data;
  } catch (error) {
    throw error;
  }
}