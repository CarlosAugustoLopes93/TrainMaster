require('dotenv').config();  // Carrega as variáveis do arquivo .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const workoutRoutes = require('./routes/workoutRoutes'); // Adicionando a rota de treinos
const exerciseRoutes = require('./routes/exerciseRoutes'); // Adicionando a rota de exercícios
const authRoutes = require('./routes/authRouter'); // Corrigindo o nome da rota de autenticação para usar 'authRoutes'
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
app.use('/api/workouts', workoutRoutes); // Usando a rota de treinos
app.use('/api/exercises', exerciseRoutes); // Usando a rota de exercícios
app.use('/api/auth', authRoutes); // Usando a nova rota de autenticação para login

// Rota básica de teste
app.get('/', (req, res) => {
  res.send('Servidor Express rodando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Agora exportando apenas o app
