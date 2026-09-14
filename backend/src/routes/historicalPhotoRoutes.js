const express = require('express');
const router = express.Router();
const controller = require('../controllers/historicalPhotoController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 1. Rotas públicas
router.get('/era/:era', controller.getPhotosByEra);
router.get('/historical', controller.getLicensedHistoricalPhotos);
router.get('/photographer/:username', controller.getPhotographerPhotosController);
router.get('/licensed/:id', controller.getLicensedPhotoByIdController);
router.get('/', controller.getAllPhotos);

// 2. Rotas privadas do Administrador
router.post('/', protect, upload.single('imageFile'), controller.createPhoto);
router.put('/:id', protect, upload.single('imageFile'), controller.updatePhoto);
router.delete('/:id', protect, controller.deletePhoto);
router.delete("/:id", protect, controller.deletePhoto)

// 3. Rota dinâmica por ID (deve ficar por último entre os GETs)
router.get('/:id', controller.getPhotoById);

module.exports = router;