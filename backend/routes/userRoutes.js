const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importando o pool do db.js

// Função para validar se os campos obrigatórios são fornecidos
const validateUserFields = ({ name, email, password, peso, altura, telefone, experiencia, user_type }) => {
    if (!name || !email || !password || !peso || !altura || !telefone || !experiencia || !user_type) {
        return 'Todos os campos são obrigatórios';
    }
    return null;
};

// Criar um novo usuário
router.post('/', async (req, res) => {
    const { name, email, password, peso, altura, telefone, experiencia, user_type } = req.body;

    console.log('Recebido:', req.body); // Verificando dados recebidos

    const error = validateUserFields(req.body);
    if (error) return res.status(400).json({ error });

    // Verificando se os dados possuem tipos esperados
    if (isNaN(peso) || isNaN(altura)) {
        return res.status(400).json({ error: 'Peso e altura devem ser números válidos' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password, peso, altura, telefone, experiencia, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, email, password, peso, altura, telefone, experiencia, user_type]
        );
        console.log('Usuário criado:', result.rows[0]); // Verificando retorno do banco
        const user = result.rows[0];
        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        // Primeira busca na tabela 'users'
        let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        console.log('Resultado de users:', result.rows);

        if (result.rows.length === 0) {
            // Se não encontrou na tabela 'users', busca na tabela 'trainers'
            console.log('Não encontrado na tabela "users", buscando na tabela "trainers"...');
            result = await pool.query('SELECT * FROM trainers WHERE email = $1', [email]);
            console.log('Resultado de trainers:', result.rows);
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nenhum usuário encontrado com o email fornecido' });
        }

        const user = result.rows[0];

        // Verificando a senha
        if (user.password !== password) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Verificando o tipo de usuário (user_type_enum)
        const validUserTypes = ['normal', 'trainer']; // Adicione todos os valores válidos do enum aqui
        if (!user.user_type || !validUserTypes.includes(user.user_type)) {
            return res.status(400).json({ error: 'Tipo de usuário inválido ou não encontrado' });
        }

        console.log('Login bem-sucedido para o email:', email);

        // Retornando os dados do usuário, incluindo user_type
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            user_type: user.user_type, // Retornando o tipo de usuário
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});


// Rota para listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users'); // ou User.findAll(), se estiver usando o modelo User
        res.json(users.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Rota para buscar usuário por user_type
router.get('/user_type/:type', async (req, res) => {
    const { type } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_type = $1', [type]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários por tipo:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários por tipo' });
    }
});

// Rota para buscar usuário por nome
router.get('/name/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE name ILIKE $1', [`%${name}%`]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários por nome:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários por nome' });
    }
});

// Rota para buscar usuário por experiência
router.get('/experiencia/:experiencia', async (req, res) => {
    const { experiencia } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE experiencia = $1', [experiencia]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários por experiência:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários por experiência' });
    }
});

// Rota para buscar usuário por peso mínimo
router.get('/peso/:peso', async (req, res) => {
    const { peso } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE peso >= $1', [peso]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários por peso:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários por peso' });
    }
});

// Rota para buscar usuário por altura mínima
router.get('/altura/:altura', async (req, res) => {
    const { altura } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE altura >= $1', [altura]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários por altura:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários por altura' });
    }
});

// Rota para editar um usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, peso, altura, telefone, experiencia, user_type } = req.body;

    console.log('Recebido para edição:', req.body); // Verificando dados recebidos

    const error = validateUserFields(req.body);
    if (error) return res.status(400).json({ error });

    // Verificando se os dados possuem tipos esperados
    if (isNaN(peso) || isNaN(altura)) {
        return res.status(400).json({ error: 'Peso e altura devem ser números válidos' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = $3, peso = $4, altura = $5, telefone = $6, experiencia = $7, user_type = $8 WHERE id = $9 RETURNING *',
            [name, email, password, peso, altura, telefone, experiencia, user_type, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        console.log('Usuário atualizado:', result.rows[0]); // Verificando retorno do banco
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        res.status(500).json({ error: 'Erro ao editar usuário' });
    }
});

// Rota para excluir um usuário
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Primeiro, verifique se existem registros na tabela "exercises" com referência ao usuário
        const exercisesResult = await pool.query('SELECT * FROM exercises WHERE workout_id = $1', [id]);

        if (exercisesResult.rows.length > 0) {
            // Exclui os registros na tabela 'exercises' que referenciam o id do usuário
            await pool.query('DELETE FROM exercises WHERE workout_id = $1', [id]);
        }

        // Agora, exclua o usuário
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        console.log('Usuário excluído:', result.rows[0]); // Verificando retorno do banco
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
});

module.exports = router;
