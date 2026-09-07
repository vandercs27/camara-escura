const express = require('express');
const router = express.Router();
const {
  getPhotosFromApi,
  getPhotoByIdFromApi,
  getPhotographerProfile,
  getPhotosByEra,
  searchPhotographerByName,
} = require('../services/unsplashService');

// Busca de fotógrafo por nome ou username
router.get('/search-photographer', async (req, res) => {
  try {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'Nome é obrigatório' });

    const profile = await searchPhotographerByName(query);
    if (!profile) {
      return res.status(404).json({ error: 'Fotógrafo não encontrado' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fotógrafo' });
  }
});

// Demais rotas
router.get('/historical', async (req, res) => {
  try {
    const query = req.query.query || 'vintage photography';
    const photos = await getPhotosFromApi(query);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fotografias' });
  }
});

router.get('/epoca/:era', async (req, res) => {
  try {
    const eraMap = {
      'seculo-19': '1800s daguerreotype photography',
      'anos-1900-1920': '1900s 1910s vintage photography',
      'anos-1930-1950': '1930s 1940s 1950s classic black and white photography',
      'anos-1960-1980': '1960s 1970s 1980s film photography',
      'contemporanea': 'modern fine art photography',
    };
    const query = eraMap[req.params.era] || 'vintage photography';
    const photos = await getPhotosByEra(query);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar acervo por época' });
  }
});

router.get('/photographer/:username', async (req, res) => {
  try {
    const profile = await getPhotographerProfile(req.params.username);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar dados do fotógrafo' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const photo = await getPhotoByIdFromApi(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Fotografia não encontrada' });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes da fotografia' });
  }
});

module.exports = router;