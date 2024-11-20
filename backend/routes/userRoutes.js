const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importando o pool do db.js

// Função para validar campos obrigatórios
const validateUserFields = (data) => {
    const { name, email, password, peso, altura, telefone, experiencia, user_type } = data;
    if (!name || !email || !password || !peso || !altura || !telefone || !experiencia || !user_type) {
        return 'Todos os campos são obrigatórios';
    }
    return null;
};

// Criar um novo usuário
router.post('/', async (req, res) => {
    const { name, email, password, peso, altura, telefone, experiencia, user_type } = req.body;
    
    console.log('Requisição POST recebida para criar usuário:', req.body);  // Log dos dados recebidos

    const error = validateUserFields(req.body);
    if (error) return res.status(400).json({ error });

    // Verificando tipos de dados
    if (isNaN(peso) || isNaN(altura)) {
        return res.status(400).json({ error: 'Peso e altura devem ser números válidos' });
    }

    try {
        console.log('Inserindo usuário no banco...');  // Log antes da inserção no banco
        const result = await pool.query(
            'INSERT INTO users (name, email, password, peso, altura, telefone, experiencia, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, email, password, peso, altura, telefone, experiencia, user_type]
        );
        console.log('Usuário criado:', result.rows[0]);  // Log após a criação do usuário no banco
        const user = result.rows[0];
        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário no banco:', error);  // Log de erro no banco
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

module.exports = router;
