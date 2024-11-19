const express = require('express');
const router = express.Router(); // Definindo o roteador
const pool = require('../db'); // Importando o pool do db.js
const User = require('../models/User');  // Importando o modelo User

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
  const { name, email, password, peso, altura, telefone, experiencia, user_type } = req.body;

  // Verifique se todos os dados foram enviados corretamente
  if (!name || !email || !password || !peso || !altura || !telefone || !experiencia || !user_type) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  // Verificar se o tipo de usuário é válido
  const validUserTypes = ['admin', 'trainer', 'user']; // Tipos válidos de usuário
  if (!validUserTypes.includes(user_type)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido' });
  }

  // Verificar se o usuário já existe (verificar o email)
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe com esse email' });
    }

    // Criar um novo usuário com a senha diretamente
    const newUser = await User.create({
      name,
      email,
      password, // Senha sem hash
      peso,
      altura,
      telefone,
      experiencia,
      user_type
    });

    return res.status(201).json(newUser); // Retorna os dados do usuário criado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao salvar usuário no banco de dados' });
  }
};

// Função para login do usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Tentativa de login recebida:', { email });

  if (!email || !password) {
    console.log('Erro: Email ou senha não fornecidos');
    return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Erro: Nenhum usuário encontrado com o email: ${email}`);
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Verifica se a senha fornecida é igual à senha no banco
    if (password !== user.password) {
      console.log(`Erro: Senha incorreta para o email: ${email}`);
      return res.status(401).json({ message: 'Senha incorreta!' });
    }
    console.log(`Login bem-sucedido para o email: ${email}`);

    res.status(200).json({ message: 'Login realizado com sucesso!', user });
  } catch (error) {
    console.error('Erro interno ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
};

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para login
router.post('/login', loginUser);

module.exports = router;
