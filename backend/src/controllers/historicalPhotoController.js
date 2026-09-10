const historicalPhotoService = require('../services/historicalPhotoService');

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
    const photos = await historicalPhotoService.getPhotosByEra(era);
    return res.status(200).json(photos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar fotos por época' });
  }
};

const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await historicalPhotoService.getPhotoByIdFromApi(id);
    return res.status(200).json(photo);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar foto' });
  }
};

const createPhoto = async (req, res) => {
  try {
    const { title, photographer, year, medium, era, historicalContext, photographerBio, imageUrl } = req.body;

    // Se o arquivo foi enviado por upload de arquivo, usa o caminho estático gerado
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ error: 'A URL da imagem ou um arquivo de imagem é obrigatório.' });
    }

    const newPhoto = await historicalPhotoService.createPhotoInDb({
      title,
      photographer,
      year,
      medium,
      era,
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
      finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
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
  getPhotoById,
  createPhoto,
  updatePhoto, // <- VERIFIQUE ESTA LINHA
  deletePhoto,
};