const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Declarar o 'app' primeiro
const app = express();

// 2. Middlewares globais
app.use(cors());
app.use(express.json());

// 3. Importar e registrar as rotas
const photoRoutes = require('./routes/photoRoutes');
app.use('/api/photos', photoRoutes);

// 4. Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Câmara Escura API' });
});

// 5. Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Câmara Escura] Servidor rodando na porta ${PORT}`);
});