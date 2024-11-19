const pool = require('../db');  // Conexão com o banco de dados PostgreSQL
const jwt = require('jsonwebtoken'); // Importando jwt para geração de token

const User = {
  // Método para criar um novo usuário
  create: async (userData) => {
    const { name, email, password, peso, altura, telefone, experiencia, user_type } = userData;

    // Verifica se o e-mail já existe no banco de dados
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('Este e-mail já está registrado.');
    }

    // Executar a inserção no banco de dados
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email, password, peso, altura, telefone, experiencia, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [name, email, password, peso, altura, telefone, experiencia, user_type]
      );
      return result.rows[0];  // Retorna o usuário recém-criado
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message);
      throw new Error('Erro ao criar o usuário.');
    }
  },

  // Método para encontrar um usuário pelo e-mail
  findOne: async (query) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [query.email]);
      return result.rows[0];  // Retorna o usuário ou undefined caso não encontrado
    } catch (error) {
      console.error('Erro ao buscar o usuário:', error.message);
      throw new Error('Erro ao buscar o usuário.');
    }
  },

  // Método para retornar todos os usuários
  findAll: async () => {
    try {
      const result = await pool.query('SELECT * FROM users');
      return result.rows;  // Retorna todos os usuários
    } catch (error) {
      console.error('Erro ao listar usuários:', error.message);
      throw new Error('Erro ao listar os usuários.');
    }
  },

  // Método para gerar o token JWT
  generateToken: (userId) => {
    const jwtSecret = process.env.JWT_SECRET;  // A chave secreta para JWT
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está configurado.');
    }

    const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' }); // Gerando o token JWT
    return token;
  }
};

module.exports = User;
