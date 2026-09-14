const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./config/db');

const historicalPhotoRoutes = require('./routes/historicalPhotoRoutes');
const { loginUser } = require('./controllers/authController');

const app = express();
app.set('trust proxy', 1);

// Conectar ao MongoDB
connectDB();

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
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});