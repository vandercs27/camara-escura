const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Photo = require('./models/Photo');
const User = require('./models/User');
const historicalData = require('./data/historicalData.json');

connectDB();

const importData = async () => {
  try {
    // 1. Criar ou atualizar o administrador sem apagar dados existentes.
    const adminUser = await User.findOne({ email: 'admin@camaraescura.com' });
    if (adminUser) {
      adminUser.name = 'Administrador';
      adminUser.isAdmin = true;
      await adminUser.save();
      console.log(`Admin já existente: ${adminUser.email}`);
    } else {
      const createdAdmin = await User.create({
        name: 'Administrador',
        email: 'admin@camaraescura.com',
        password: 'admin123password',
      });
      console.log(`Admin criado: ${createdAdmin.email}`);
    }

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

    let insertedPhotos = 0;
    for (const photoData of photosToInsert) {
      const result = await Photo.updateOne(
        { title: photoData.title, photographer: photoData.photographer },
        { $setOnInsert: photoData },
        { upsert: true }
      );
      insertedPhotos += result.upsertedCount || 0;
    }
    console.log(`${insertedPhotos} fotografias novas importadas; dados existentes preservados.`);

    process.exit();
  } catch (error) {
    console.error(`Erro ao importar dados: ${error.message}`);
    process.exit(1);
  }
};

importData();