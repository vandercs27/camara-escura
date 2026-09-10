const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Photo = require('./models/Photo');
const User = require('./models/User');
const historicalData = require('./data/historicalData.json');

connectDB();

const importData = async () => {
  try {
    await Photo.deleteMany();
    await User.deleteMany();

    // 1. Criar usuário Admin padrão
    const adminUser = await User.create({
      name: 'Administrador',
      email: 'admin@camaraescura.com',
      password: 'admin123password',
    });

    console.log(`Admin criado: ${adminUser.email}`);

    // 2. Formatar e importar fotos do JSON
    const photosToInsert = [];

    for (const eraKey in historicalData) {
      historicalData[eraKey].forEach((photo) => {
        photosToInsert.push({
          title: photo.title,
          photographer: photo.photographer,
          year: photo.year,
          medium: photo.medium,
          era: eraKey,
          imageUrl: photo.imageUrl,
          historicalContext: photo.historicalContext || '',
          photographerBio: photo.photographerBio || '',
        });
      });
    }

    await Photo.insertMany(photosToInsert);
    console.log(`${photosToInsert.length} fotografias importadas com sucesso!`);

    process.exit();
  } catch (error) {
    console.error(`Erro ao importar dados: ${error.message}`);
    process.exit(1);
  }
};

importData();