const { Pool } = require('pg');
require('dotenv').config(); // Carrega as variáveis de ambiente

// Usando as variáveis de ambiente para configurar a conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,       // Variável de ambiente para o usuário
  host: process.env.DB_HOST,       // Variável de ambiente para o host do banco de dados
  database: process.env.DB_NAME,   // Variável de ambiente para o nome do banco de dados
  password: process.env.DB_PASSWORD, // Variável de ambiente para a senha do banco
  port: process.env.DB_PORT,       // Variável de ambiente para a porta
});

// Conectando ao banco de dados e tratando erros
pool.connect()
  .then(() => console.log('Conectado ao banco de dados PostgreSQL'))
  .catch((err) => console.error('Erro ao conectar ao banco de dados', err));

module.exports = pool; // Exportando apenas o pool
