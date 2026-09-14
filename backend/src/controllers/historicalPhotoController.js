const historicalPhotoService = require('../services/historicalPhotoService');
const {
  getHistoricalPhotosFromWiki,
  getLicensedPhotoById,
  getPhotographerPhotos,
  getEraPhotographers,
} = require('../services/wikimediaService');
const {
  getModernPhotosFromMet,
  getMetPhotoById,
  getAicPhotoById,
} = require('../services/metMuseumService');

const getAllPhotos = async (req, res) => {
  try {
    const photos = await historicalPhotoService.getPhotosFromApi();
    return res.status(200).json(photos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar fotos' });
  }
};

const getPhotosByEra = async (req, res) => {
  try {
    const { era } = req.params;
    const photos = await getHistoricalPhotosFromWiki(getEraPhotographers(era).join(' OR '));
    return res.status(200).json(photos);
  } catch (error) {
    console.error('Erro ao buscar fotos por época:', error.message);
    return res.status(200).json([]);
  }
};

const getLicensedPhotoByIdController = async (req, res) => {
  try {
    const photo = await getLicensedPhotoById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Fotografia licenciada não encontrada.' });
    return res.status(200).json(photo);
  } catch (error) {
    console.error('Erro ao buscar detalhe licenciado:', error.message);
    return res.status(502).json({ error: 'Fonte de fotografias licenciadas indisponível.' });
  }
};

const getPhotographerPhotosController = async (req, res) => {
  try {
    const photos = await getPhotographerPhotos(req.params.username);
    return res.status(200).json({
      name: req.params.username,
      totalPhotos: photos.length,
      photos,
    });
  } catch (error) {
    console.error('Erro ao buscar acervo do fotógrafo:', error.message);
    return res.status(502).json({ error: 'Acervo do fotógrafo indisponível.' });
  }
};

const getLicensedHistoricalPhotos = async (req, res) => {
  try {
    const { query } = req.query;
    const photos = await getHistoricalPhotosFromWiki(query ? String(query) : undefined);
    return res.status(200).json(photos);
  } catch (error) {
    console.error('Erro ao buscar fotos licenciadas:', error.message);
    return res.status(200).json([]);
  }
};

const getModernLicensedPhotos = async (req, res) => {
  try {
    const { query = '20th century photography' } = req.query;
    const photos = await getModernPhotosFromMet(String(query));
    return res.status(200).json(photos);
  } catch (error) {
    console.error('Erro ao buscar fotos modernas licenciadas:', error.message);
    return res.status(200).json([]);
  }
};

const getModernLicensedPhotoById = async (req, res) => {
  try {
    const photo = req.params.id.startsWith('aic-')
      ? await getAicPhotoById(req.params.id)
      : await getMetPhotoById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Fotografia do The Met não encontrada.' });
    return res.status(200).json(photo);
  } catch (error) {
    console.error('Erro ao buscar detalhe do The Met:', error.message);
    return res.status(502).json({ error: 'Acervo do The Met indisponível.' });
  }
};
// src/controllers/historicalPhotoController.js



const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Usar getPhotoByIdFromApi (nome exato exportado no service)
    const photo = await historicalPhotoService.getPhotoByIdFromApi(id);

    if (!photo) {
      return res.status(404).json({ message: 'Fotografia não encontrada.' });
    }

    return res.status(200).json(photo);
  } catch (error) {
    console.error('Erro no getPhotoById:', error);
    return res.status(500).json({ error: 'Erro ao buscar detalhes da foto.' });
  }
};


const createPhoto = async (req, res) => {
  try {
    const { title, photographer, year, medium, era, historicalContext, photographerBio, imageUrl } = req.body;

    // Se o arquivo foi enviado por upload de arquivo, usa o caminho estático gerado
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ error: 'A URL da imagem ou um arquivo de imagem é obrigatório.' });
    }

    // Mapeamento dos textos do formulário para os slugs padronizados da URL
    const eraMap = {
      'século xix': 'seculo-19',
      'século 19': 'seculo-19',
      'seculo xix': 'seculo-19',
      '1900 - 1920': '1900-1920',
      '1930 - 1950': '1930-1950',
      '1960 - 1980': '1960-1980',
      'contemporânea': 'contemporanea',
      'contemporanea': 'contemporanea'
    };

    // Converte para minúsculas e remove espaços das extremidades
    const cleanEra = era ? era.toLowerCase().trim() : '';
    const formattedEra = eraMap[cleanEra] || era;

    const newPhoto = await historicalPhotoService.createPhotoInDb({
      title,
      photographer,
      year,
      medium,
      era: formattedEra, // 👈 Salva o valor sanitizado/normalizado no banco
      historicalContext,
      photographerBio,
      imageUrl: finalImageUrl,
    });

    return res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Erro ao cadastrar foto:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar fotografia no acervo.' });
  }
};




const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, photographer, year, medium, era, historicalContext, photographerBio, imageUrl } = req.body;

    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedPhoto = await historicalPhotoService.updatePhotoInDb(id, {
      title,
      photographer,
      year,
      medium,
      era,
      historicalContext,
      photographerBio,
      ...(finalImageUrl && { imageUrl: finalImageUrl }),
    });

    if (!updatedPhoto) {
      return res.status(404).json({ error: 'Fotografia não encontrada para atualização.' });
    }

    return res.status(200).json(updatedPhoto);
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    return res.status(500).json({ error: 'Erro ao atualizar fotografia.' });
  }
};

const deletePhoto = async (req, res) => {
   try{
     const { id } = req.params 
     const deletePhoto = await historicalPhotoService.deletePhotoFromDb(id)

     if(!deletePhoto){
      return res.status(404).json({error: "fotografia não encontrada para exclusão."})
     }

     return res.status(200).json({message: "fotografia excluida com sucesso."})
   }catch(error){
     console.error("erro ao deletar foto", error)
     return res.status(500).json({error:" erro interno ao remover fotografia."})
   }
}



module.exports = {
  getAllPhotos,
  getPhotosByEra,
  getLicensedHistoricalPhotos,
  getModernLicensedPhotos,
  getModernLicensedPhotoById,
  getLicensedPhotoByIdController,
  getPhotographerPhotosController,
  getPhotoById,
  createPhoto,
  updatePhoto, // <- VERIFIQUE ESTA LINHA
  deletePhoto,
};