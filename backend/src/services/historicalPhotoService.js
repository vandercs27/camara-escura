const Photo = require('../models/Photo');

const getPhotosFromApi = async () => {
  return await Photo.find({});
};

const getPhotosByEra = async (eraParam = '') => {
  if (!eraParam) return await Photo.find({});

  const cleanEra = eraParam.toLowerCase().trim();

  if (cleanEra === 'todas' || cleanEra === 'all' || cleanEra === '') {
    return await Photo.find({});
  }

  return await Photo.find({ era: cleanEra });
};

const getPhotoByIdFromApi = async (id) => {
  let photoFound = null;

  // Busca por _id do MongoDB (24 caracteres hexadecimais)
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    photoFound = await Photo.findById(id);
  }

  // Busca secundária por id simples (legado)
  if (!photoFound) {
    photoFound = await Photo.findOne({ id: id });
  }

  if (photoFound) {
    const photoObj = photoFound.toObject();
    return {
      ...photoObj,
      historicalContext: photoObj.historicalContext || 'Contexto histórico em fase de catalogação.',
      photographerBio: photoObj.photographerBio || 'Informações biográficas não informadas.',
      technicalNotes: `Técnica: ${photoObj.medium || 'N/A'} | Ano: ${photoObj.year || 'N/A'}`,
      compositionAnalysis: 'Obra preservada no acervo digital.',
    };
  }

  return null;
};

const createPhotoInDb = async (photoData) => {
  const photo = new Photo(photoData);
  return await photo.save();
};

const deletePhotoFromDb = async (id) => {
  return await Photo.findByIdAndDelete(id);
};

const updatePhotoInDb = async (id, photoData) => {
  return await Photo.findByIdAndUpdate(id, photoData, { new: true });
};

module.exports = {
  getPhotosFromApi,
  getPhotosByEra,
  getPhotoByIdFromApi,
  createPhotoInDb,
  updatePhotoInDb, // Exportado
  deletePhotoFromDb,
};

