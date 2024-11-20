require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes'); // Rotas de usuário
const trainerRoutes = require('./routes/trainerRoutes'); // Rotas de treinador
const workoutRoutes = require('./routes/workoutRoutes'); // Rotas de treino
const exerciseRoutes = require('./routes/exerciseRoutes'); // Rotas de exercícios
const authRoutes = require('./routes/authRouter'); // Rotas de autenticação
const pool = require('./db'); // Banco de dados
const app = express();

// Adicionando log para confirmar que o servidor iniciou
console.log('Iniciando o servidor...');

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
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));  // Ajuste o caminho

  // Roteamento para todas as outras rotas, garantindo que o React seja servido corretamente
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));  // Ajuste o caminho
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);  // Adicionando log para erro no servidor
  res.status(500).send('Algo deu errado!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Exporta o app
