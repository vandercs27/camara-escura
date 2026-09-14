import axios from 'axios';

export const API_URL =
  import.meta.env.VITE_API_URL || 'https://camara-escura-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';

  try {
    const image = new URL(imageUrl, `${API_URL}/`);
    const apiOrigin = new URL(API_URL).origin;

    if (
      image.origin === 'http://localhost:5000' ||
      image.origin === 'http://127.0.0.1:5000' ||
      image.origin === apiOrigin
    ) {
      return `${apiOrigin}${image.pathname}${image.search}`;
    }

    return image.toString();
  } catch {
    return imageUrl;
  }
};


export const getHistoricalPhotos = async (query) => {
  const response = await api.get('/photos', { params: { query } });
  return response.data;
};

export const getPhotosByEra = async (era) => {
  const response = await api.get(`/photos/era/${era}`);
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
}

export default api;