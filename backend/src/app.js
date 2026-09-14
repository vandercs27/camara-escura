const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const historicalPhotoRoutes = require('./routes/historicalPhotoRoutes');
const { loginUser } = require('./controllers/authController');

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// Garantir que a pasta 'uploads' exista
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Servir a pasta de arquivos estáticos enviadas por upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rota de Autenticação
app.post('/api/auth/login', loginUser);

// Rota de Fotografias
app.use('/api/photos', historicalPhotoRoutes);

const PORT = process.env.PORT || 5000;

const bootstrapAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('ADMIN_EMAIL/ADMIN_PASSWORD não configurados; bootstrap do admin ignorado.');
    return;
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD deve ter pelo menos 8 caracteres.');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (!existingUser.isAdmin) {
      existingUser.isAdmin = true;
      await existingUser.save();
    }
    console.log(`Administrador confirmado: ${email}`);
    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME?.trim() || 'Administrador',
    email,
    password,
    isAdmin: true,
  });
  console.log(`Administrador criado: ${email}`);
};

const startServer = async () => {
  await connectDB();
  await bootstrapAdmin();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`Falha ao iniciar o servidor: ${error.message}`);
  process.exit(1);
});