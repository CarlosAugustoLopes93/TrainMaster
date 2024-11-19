const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Importando as funções de registro e login

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/api/users', registerUser);

// Rota para login do usuário
router.post('/login', loginUser); // Adicionando a rota para login

module.exports = router;
