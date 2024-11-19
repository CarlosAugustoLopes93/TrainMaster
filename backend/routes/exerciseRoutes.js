const express = require('express');
const router = express.Router();
const pool = require('../db'); // Certifique-se de que o `db.js` está configurado corretamente para conectar ao banco de dados


// Rota para atualizar o status do treino
router.patch('/trainings/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE trainings SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar status do treino:', error);
        res.status(500).json({ error: 'Erro ao atualizar status do treino' });
    }
});


// Rota para obter todos os exercícios
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM exercises'); // Altere o nome da tabela conforme necessário
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar exercícios:', error);
        res.status(500).json({ error: 'Erro ao buscar exercícios' });
    }
});

// Rota para criar um novo treino
router.post('/trainings', async (req, res) => {
    const { title, description, trainer_id, student_id, date } = req.body;

    if (!title || !trainer_id || !student_id) {
        return res.status(400).json({ error: 'Título, treinador e aluno são obrigatórios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO trainings (title, description, trainer_id, student_id, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, trainer_id, student_id, date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar treino:', error);
        res.status(500).json({ error: 'Erro ao criar treino' });
    }
});


module.exports = router;
