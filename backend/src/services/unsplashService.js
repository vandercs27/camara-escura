const axios = require('axios');
const { translateToPt } = require('../utils/translator');

const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

// Base de dados local para fotógrafos históricos renomados
const HISTORICAL_PHOTOGRAPHERS = [
  {
    keywords: ['sebastiao salgado', 'salgado', 'sebastião salgado'],
    name: 'Sebastião Salgado',
    username: 'sebastiao-salgado',
    location: 'Minas Gerais, Brasil',
    bio: 'Um dos mais renomados fotógrafos documentais do mundo. Conhecido por seus projetos de longo prazo em preto e branco cobrindo questões sociais, trabalhadoras e ambientais em obras como Trabalhadores, Éxodos e Gênesis.',
    totalPhotos: 'Milhares de registros acervados',
    searchQuery: 'black and white documentary nature portrait',
  },
  {
    keywords: ['henri cartier bresson', 'cartier bresson', 'bresson'],
    name: 'Henri Cartier-Bresson',
    username: 'cartier-bresson',
    location: 'Chanteloup-en-Brie, França',
    bio: 'Pai do fotojornalismo moderno e mestre da fotografia de rua. Famoso por conceituar o "Momento Decisivo", capturando a essência de um evento em uma fração de segundo.',
    totalPhotos: 'Acervo Clássico Magnum',
    searchQuery: 'street black and white vintage france',
  },
  {
    keywords: ['ansel adams', 'adams'],
    name: 'Ansel Adams',
    username: 'ansel-adams',
    location: 'São Francisco, EUA',
    bio: 'Fotógrafo e ambientalista americano conhecido por suas fotografias em preto e branco do Oeste americano, especialmente do Parque Nacional de Yosemite. Desenvolveu o Sistema de Zonas.',
    totalPhotos: 'Acervo de Paisagens',
    searchQuery: 'yosemite mountain black and white landscape',
  },
];

/**
 * 1. Busca fotos por palavra-chave ou termo geral
 */
const getPhotosFromApi = async (query = 'vintage photography', page = 1, perPage = 24) => {
  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: { query, page, per_page: perPage },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });

    const results = response.data.results || [];

    return await Promise.all(
      results.map(async (photo) => {
        const rawTitle = photo.description || photo.alt_description || 'Fotografia Histórica';
        const translatedTitle = await translateToPt(rawTitle);

        return {
          id: photo.id,
          title: translatedTitle,
          photographer: photo.user.name,
          username: photo.user.username,
          year: photo.created_at ? photo.created_at.substring(0, 4) : 'N/A',
          medium: photo.exif?.make ? `${photo.exif.make} ${photo.exif.model || ''}` : '35mm / Digital',
          imageUrl: photo.urls.regular,
        };
      })
    );
  } catch (error) {
    console.error('Erro na API Unsplash:', error.message);
    return getFallbackPhotos();
  }
};

/**
 * 2. Busca fotógrafo por nome (checa mestres históricos + Unsplash API)
 */
const searchPhotographerByName = async (nameQuery) => {
  const cleanQuery = nameQuery.toLowerCase().trim();

  // A. Verifica se é um mestre da fotografia cadastrado na base local
  const matchedMaster = HISTORICAL_PHOTOGRAPHERS.find((p) =>
    p.keywords.some((kw) => cleanQuery.includes(kw))
  );

  if (matchedMaster) {
    const photos = await getPhotosFromApi(matchedMaster.searchQuery, 1, 24);
    return {
      name: matchedMaster.name,
      username: matchedMaster.username,
      bio: matchedMaster.bio,
      location: matchedMaster.location,
      totalPhotos: matchedMaster.totalPhotos,
      profileImage: photos[0]?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      photos: photos.map((p) => ({ ...p, photographer: matchedMaster.name })),
    };
  }

  // B. Tenta buscar usuário correspondente na API do Unsplash
  try {
    const userSearchRes = await axios.get(`${UNSPLASH_BASE_URL}/search/users`, {
      params: { query: nameQuery, per_page: 1 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });

    const userMatch = userSearchRes.data.results?.[0];

    if (userMatch) {
      return await getPhotographerProfile(userMatch.username);
    }
  } catch (error) {
    console.error('Erro ao buscar fotógrafo no Unsplash:', error.message);
  }

  return null;
};

/**
 * 3. Busca perfil por username no Unsplash
 */
const getPhotographerProfile = async (username) => {
  try {
    const userRes = await axios.get(`${UNSPLASH_BASE_URL}/users/${username}`, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });

    const photosRes = await axios.get(`${UNSPLASH_BASE_URL}/users/${username}/photos`, {
      params: { per_page: 24 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });

    const user = userRes.data;
    const translatedBio = user.bio ? await translateToPt(user.bio) : 'Fotógrafo ativo na comunidade.';

    const photos = await Promise.all(
      photosRes.data.map(async (photo) => ({
        id: photo.id,
        title: await translateToPt(photo.description || photo.alt_description || 'Fotografia Marcante'),
        imageUrl: photo.urls.regular,
        year: photo.created_at ? photo.created_at.substring(0, 4) : 'N/A',
        photographer: user.name,
        username: user.username,
      }))
    );

    return {
      name: user.name,
      username: user.username,
      bio: translatedBio,
      profileImage: user.profile_image?.large,
      location: user.location || 'Localização não informada',
      totalPhotos: user.total_photos,
      photos,
    };
  } catch (error) {
    console.error('Erro ao buscar perfil do fotógrafo:', error.message);
    throw error;
  }
};

/**
 * 4. Busca por época
 */
const getPhotosByEra = async (eraQuery = '1800s photography', page = 1, perPage = 24) => {
  return await getPhotosFromApi(eraQuery, page, perPage);
};

/**
 * 5. Detalhes de foto por ID
 */
const getPhotoByIdFromApi = async (id) => {
  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/photos/${id}`, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });

    const photo = response.data;
    const rawDescription = photo.description || photo.alt_description || 'Fotografia';
    const translatedTitle = await translateToPt(rawDescription);

    return {
      id: photo.id,
      title: translatedTitle,
      photographer: photo.user.name,
      username: photo.user.username,
      photographerBio: photo.user.bio ? await translateToPt(photo.user.bio) : 'Fotógrafo participante do acervo.',
      year: photo.created_at ? photo.created_at.substring(0, 4) : 'N/A',
      medium: photo.exif?.make ? `Câmera: ${photo.exif.make} ${photo.exif.model || ''}` : 'Câmera Digital / Analógica',
      imageUrl: photo.urls.regular,
      historicalContext: translatedTitle,
      technicalNotes: `
        Câmera: ${photo.exif?.make || 'Não informada'} ${photo.exif?.model || ''} | 
        Abertura: f/${photo.exif?.aperture || 'N/A'} | 
        Velocidade: ${photo.exif?.exposure_time || 'N/A'}s | 
        ISO: ${photo.exif?.iso || 'N/A'}
      `,
      compositionAnalysis: `Localização: ${photo.location?.name || 'Não informada'}. Resolução: ${photo.width}x${photo.height}px.`,
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes da foto:', error.message);
    throw error;
  }
};

const getFallbackPhotos = () => [
  {
    id: 'niepce-1826',
    title: 'Point de vue du Gras (1826)',
    photographer: 'Joseph Nicéphore Niépce',
    username: 'niepce',
    year: '1826',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'daguerre-1838',
    title: 'Boulevard du Temple (1838)',
    photographer: 'Louis Daguerre',
    username: 'daguerre',
    year: '1838',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  },
];

module.exports = {
  getPhotosFromApi,
  getPhotoByIdFromApi,
  getPhotographerProfile,
  getPhotosByEra,
  searchPhotographerByName,
};