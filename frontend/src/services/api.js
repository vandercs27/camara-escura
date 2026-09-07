import axios from 'axios';

// URL do back-end no Render com fallback direto e remoção de barras sobressalentes
const RAW_URL = import.meta.env.VITE_API_URL || 'https://camara-escura-backend.onrender.com/api';
const API_URL = RAW_URL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL,
});

export const getHistoricalPhotos = async (query) => {
  const response = await api.get('/photos/historical', { params: { query } });
  return response.data;
};

export const getPhotosByEra = async (era) => {
  const response = await api.get(`/photos/epoca/${era}`);
  return response.data;
};

export const getPhotoById = async (id) => {
  const response = await api.get(`/photos/${id}`);
  return response.data;
};

export const getPhotographer = async (username) => {
  const response = await api.get(`/photos/photographer/${username}`);
  return response.data;
};

export const searchPhotographer = async (name) => {
  const response = await api.get('/photos/search-photographer', { params: { name } });
  return response.data;
};

export default api;