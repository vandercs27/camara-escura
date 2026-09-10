import axios from 'axios';

// Aponta para a porta 5000 onde seu servidor Node está rodando localmente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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