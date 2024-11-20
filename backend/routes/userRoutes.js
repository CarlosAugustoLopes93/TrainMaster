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

    // Logando os dados recebidos na requisição
    console.log('Requisição POST recebida para criar usuário:', req.body);

    const error = validateUserFields(req.body);
    if (error) {
        console.log('Erro na validação dos campos:', error);  // Log de erro de validação
        return res.status(400).json({ error });
    }

    // Verificando tipos de dados para peso e altura
    if (isNaN(peso) || isNaN(altura)) {
        console.log('Erro: Peso ou altura não são números válidos. Peso:', peso, 'Altura:', altura);
        return res.status(400).json({ error: 'Peso e altura devem ser números válidos' });
    }

    try {
        console.log('Tentando inserir o usuário no banco...');  // Log antes da inserção no banco
        const result = await pool.query(
            'INSERT INTO users (name, email, password, peso, altura, telefone, experiencia, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, email, password, peso, altura, telefone, experiencia, user_type]
        );
        console.log('Usuário criado no banco de dados:', result.rows[0]);  // Log após a inserção do usuário
        const user = result.rows[0];
        res.status(201).json(user);
    } catch (error) {
        // Log de erro ao tentar inserir no banco
        console.error('Erro ao criar usuário no banco:', error);  
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

module.exports = router;
