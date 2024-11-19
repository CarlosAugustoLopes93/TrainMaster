const express = require('express');
const router = express.Router(); // Definindo o roteador

const pool = require('../db'); // Importando o pool do db.js

// Criar um novo treino
router.post('/', async (req, res) => {
    const { name, description, duration, trainer_id, user_id, exercises } = req.body;

    console.log('Recebido:', req.body); // Verificando dados recebidos

    // Verificando se todos os campos necessários foram recebidos
    if (!name || !exercises || !user_id) {
        return res.status(400).json({ error: 'Nome, exercícios e user_id são obrigatórios' });
    }

    try {
        // Criando o treino
        const result = await pool.query(
            'INSERT INTO workouts (name, description, duration, trainer_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, description, duration, trainer_id, user_id]
        );

        const workout_id = result.rows[0].id; // Pegando o ID do treino recém-criado
        console.log('Treino criado:', result.rows[0]); // Verificando retorno do banco

        // Criando os exercícios e associando ao treino
        for (const ex of exercises) {
            await pool.query(
                'INSERT INTO exercises (name, sets, reps, weight, workout_id) VALUES ($1, $2, $3, $4, $5)',
                [ex.name, ex.sets, ex.reps, ex.weight, workout_id]
            );
        }

        res.status(201).json({ message: 'Treino e exercícios cadastrados com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar treino:', error); // Logando erro completo
        res.status(500).json({ error: 'Erro ao criar treino', details: error.message });
    }
});

// Rota para listar os treinos filtrados pelo user_id da URL
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Capturando o user_id diretamente da URL
    console.log(`Recebido ID: ${id}`); // Verificando se o ID está correto

    // Verificando se o user_id é um número válido
    if (isNaN(id)) {
        return res.status(400).json({ error: 'user_id deve ser um número válido' });
    }

    try {
        const userIdInt = parseInt(id, 10);
        console.log(`Consultando banco para user_id: ${userIdInt}`);

        // Consultando os treinos para o user_id especificado
        const query = 'SELECT * FROM workouts WHERE user_id = $1';
        const treinos = await pool.query(query, [userIdInt]);

        if (treinos.rows.length === 0) {
            console.log('Nenhum treino encontrado.');
        } else {
            console.log(`Encontrados ${treinos.rows.length} treinos.`);
        }

        res.json(treinos.rows);
    } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        res.status(500).json({ error: 'Erro ao buscar treinos' });
    }
});



// Exportando o roteador
module.exports = router;
