const express = require('express');
const router = express.Router();
const {
  getPhotosFromApi,
  getPhotoByIdFromApi,
  getPhotosByEra,
  searchPhotographerByName,
} = require('../services/historicalPhotoService');

// Rota Principal (Todas as fotos)
router.get('/historical', async (req, res) => {
  try {
    const photos = await getPhotosFromApi();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fotografias históricas' });
  }
});

// Busca por Fotógrafo
router.get('/search-photographer', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Nome do fotógrafo não informado' });

    const result = await searchPhotographerByName(name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fotógrafo' });
  }
});

// Busca por Época (Passa a era diretamente para o serviço)
router.get('/epoca/:era', async (req, res) => {
  try {
    const { era } = req.params; // Extrai "seculo-19", "anos-1900-1920", etc.
    const photos = await getPhotosByEra(era);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fotos por época' });
  }
});

// Detalhe por ID
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