require('dotenv').config();  // Carrega as variáveis do arquivo .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Importa o 'path' para manipulação de caminhos
const userRoutes = require('./routes/userRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const authRoutes = require('./routes/authRouter');
const pool = require('./db'); // Importa o pool do arquivo db.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Para permitir que o Express entenda requisições com corpo JSON
app.use(bodyParser.json()); // Middleware para parsear JSON

const PORT = process.env.PORT || 5000;

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/auth', authRoutes);

// Serve os arquivos estáticos do React
if (process.env.NODE_ENV === 'production') {
  // Serve a pasta 'build' para produção, ajustando o caminho para o diretório correto
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));  // Subindo um nível para sair da pasta 'backend'

  // Roteamento para todas as outras rotas, garantindo que o React seja servido corretamente
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));  // Ajuste no caminho
  });
}

// Tratamento de erros para capturar falhas inesperadas
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Exporta o app
