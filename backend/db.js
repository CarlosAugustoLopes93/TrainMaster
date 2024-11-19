const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'trainmaster',
  password: 'gutinho12',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Conectado ao banco de dados PostgreSQL'))
  .catch((err) => console.error('Erro ao conectar ao banco de dados', err));

module.exports = pool; // Exportando apenas o pool
