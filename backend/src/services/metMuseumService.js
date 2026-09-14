const axios = require('axios');
const { getHistoricalPhotosFromWiki } = require('./wikimediaService');

const MET_API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';
const AIC_API_URL = 'https://api.artic.edu/api/v1';
const CACHE_TTL = 10 * 60 * 1000;
let cache = { expiresAt: 0, key: '', photos: [] };

const cleanText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

const getObject = async (objectID) => {
  const response = await axios.get(`${MET_API_URL}/objects/${objectID}`, {
    timeout: 15000,
    headers: { 'User-Agent': 'CamaraEscura/1.0 (historical photography educational project)' },
  });
  return response.data;
};

const mapObject = (object) => {
  const medium = cleanText(object?.medium || '');
  const classification = cleanText(object?.classification || '');
  if (
    !object?.primaryImage ||
    !object.isPublicDomain ||
    (!/photograph|photographic/i.test(medium) && !/photograph/i.test(classification))
  ) return null;

  return {
    id: `met-${object.objectID}`,
    title: cleanText(object.title || 'Fotografia do acervo do The Met'),
    photographer: cleanText(object.artistDisplayName || 'Autor não identificado'),
    year: cleanText(object.objectDate || 'Data não informada'),
    medium: medium || 'Técnica não informada',
    imageUrl: object.primaryImage,
    description: cleanText(object.creditLine || ''),
    source: 'The Metropolitan Museum of Art',
    sourceUrl: object.objectURL,
    license: 'Public domain',
    licenseUrl: 'https://www.metmuseum.org/policies/terms-of-use',
    credit: cleanText(object.creditLine || object.artistDisplayName || ''),
    era: 'contemporanea',
  };
};

const getModernPhotosFromMet = async (query = 'photography', limit = 24) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 40);
  const cacheKey = `${query}:${safeLimit}`;
  if (cache.expiresAt > Date.now() && cache.key === cacheKey) return cache.photos;

  const searchResponse = await axios.get(`${MET_API_URL}/search`, {
    params: {
      q: query,
      hasImages: true,
      isPublicDomain: true,
    },
    timeout: 15000,
    headers: { 'User-Agent': 'CamaraEscura/1.0 (historical photography educational project)' },
  });

  const objectIds = (searchResponse.data.objectIDs || []).slice(0, Math.min(safeLimit * 10, 100));
  const objects = [];
  for (let index = 0; index < objectIds.length && objects.length < safeLimit; index += 5) {
    const batch = objectIds.slice(index, index + 5);
    const results = await Promise.all(batch.map((id) => getObject(id)));
    objects.push(...results);
  }

  const photos = objects.map(mapObject).filter(Boolean).slice(0, safeLimit);
  cache = { expiresAt: Date.now() + CACHE_TTL, key: cacheKey, photos };
  return photos;
};

const getMetPhotoById = async (id) => {
  const objectID = String(id).replace(/^met-/, '');
  if (!/^\d+$/.test(objectID)) return null;
  return mapObject(await getObject(objectID));
};

const getModernPhotosFromAic = async (query = 'photography', limit = 24) => {
  const response = await axios.get(`${AIC_API_URL}/artworks/search`, {
    params: {
      q: query,
      limit: Math.min(Math.max(Number(limit) || 24, 1) * 3, 100),
      fields: 'id,title,date_display,artist_display,image_id,is_public_domain,medium_display,artist_title',
    },
    timeout: 15000,
  });
  return (response.data.data || [])
    .filter((item) => item.is_public_domain && item.image_id)
    .slice(0, limit)
    .map((item) => ({
      id: `aic-${item.id}`,
      title: cleanText(item.title || 'Fotografia do Art Institute of Chicago'),
      photographer: cleanText(item.artist_title || item.artist_display || 'Autor não identificado'),
      year: cleanText(item.date_display || 'Data não informada'),
      medium: cleanText(item.medium_display || 'Técnica não informada'),
      imageUrl: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
      description: '',
      source: 'Art Institute of Chicago',
      sourceUrl: `https://www.artic.edu/artworks/${item.id}`,
      license: 'Public domain',
      licenseUrl: 'https://www.artic.edu/open-access/open-access-images',
      credit: 'Art Institute of Chicago',
      era: 'contemporanea',
    }));
};

const getModernPhotos = async (query = 'photography', limit = 24) => {
  try {
    const metPhotos = await getModernPhotosFromMet(query, limit);
    if (metPhotos.length) return metPhotos;
  } catch (error) {
    console.warn(`The Met indisponível; usando Art Institute: ${error.message}`);
  }

  const contemporaryQuery = query === 'photography'
    ? 'Sebastião Salgado OR Cindy Sherman OR Nan Goldin OR Vik Muniz OR JR photographer OR Vivian Maier OR Gordon Parks'
    : query;
  const licensedPhotos = await getHistoricalPhotosFromWiki(contemporaryQuery, limit);
  if (licensedPhotos.length) return licensedPhotos.map((photo) => ({
    ...photo,
    era: 'contemporanea',
  }));

  return getModernPhotosFromAic(query, limit);
};

const getAicPhotoById = async (id) => {
  const objectID = String(id).replace(/^aic-/, '');
  if (!/^\d+$/.test(objectID)) return null;
  const response = await axios.get(`${AIC_API_URL}/artworks/${objectID}`, {
    params: { fields: 'id,title,date_display,artist_display,image_id,is_public_domain,medium_display,artist_title' },
    timeout: 15000,
  });
  const item = response.data.data;
  if (!item) return null;
  return (await getModernPhotosFromAic(item.title || 'photography', 100))
    .find((photo) => photo.id === `aic-${item.id}`) || null;
};

module.exports = {
  getModernPhotosFromMet: getModernPhotos,
  getMetPhotoById,
  getAicPhotoById,
};
