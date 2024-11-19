const express = require('express');
const router = express.Router();
const pool = require('../db'); // Acesse o pool do db.js

// Criar um novo treinador
router.post('/', async (req, res) => {
    const { name, specialty, email, location, phone, bio, certifications } = req.body;

   
// Verifique se todos os campos obrigatórios estão presentes
if (!name || !specialty || !email || !location || !phone || !bio || !certifications) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
}

    try {
        // Atualize a query de inserção para incluir 'bio' e 'certifications'
const result = await pool.query(
    'INSERT INTO trainers (name, specialty, email, location, phone, bio, certifications) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [name, specialty, email, location, phone, bio, certifications]
);
        const trainer = result.rows[0];
        res.status(201).json(trainer);
    } catch (error) {
        console.error('Erro ao criar treinador:', error);
        res.status(500).json({ error: 'Erro ao criar treinador' });
    }
});


// Listar todos os treinadores
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trainers');
        const trainers = result.rows;
        res.status(200).json(trainers);
    } catch (error) {
        console.error('Erro ao buscar treinadores:', error);
        res.status(500).json({ error: 'Erro ao buscar treinadores' });
    }
});

// Editar um treinador
router.put('/:id', async (req, res) => {
    const { name, specialty, email, phone, bio, location, certifications } = req.body;
    const { id } = req.params;

    if (!name || !specialty || !email || !phone || !bio || !location || !certifications) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const result = await pool.query(
            'UPDATE trainers SET name = $1, specialty = $2, email = $3, phone = $4, bio = $5, location = $6, certifications = $7 WHERE id = $8 RETURNING *',
            [name, specialty, email, phone, bio, location, certifications, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Treinador não encontrado' });
        }

        const trainer = result.rows[0];
        res.status(200).json(trainer);
    } catch (error) {
        console.error('Erro ao atualizar treinador:', error);
        res.status(500).json({ error: 'Erro ao atualizar treinador' });
    }
});


// Excluir um treinador
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM trainers WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Treinador não encontrado' });
        }

        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Erro ao excluir treinador:', error);
        res.status(500).json({ error: 'Erro ao excluir treinador' });
    }
});

// Consultar um treinador pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM trainers WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Treinador não encontrado' });
        }

        const trainer = result.rows[0];
        res.status(200).json(trainer);
    } catch (error) {
        console.error('Erro ao buscar treinador:', error);
        res.status(500).json({ error: 'Erro ao buscar treinador' });
    }
});

module.exports = router;
