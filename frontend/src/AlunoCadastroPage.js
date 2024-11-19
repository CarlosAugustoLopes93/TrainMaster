import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AlunoCadastroPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    email: '',
    telefone: '',
    peso: '',
    altura: '',
    experiencia: '',
    senha: '',  // Adicionando campo para senha
  });

  const navigate = useNavigate();

  // Função para atualizar os dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se todos os campos estão preenchidos
    if (!formData.nome || !formData.idade || !formData.email || !formData.senha || !formData.peso || !formData.altura || !formData.telefone || !formData.experiencia) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    // Definindo `user_type` como 'aluno' antes de enviar os dados
    const dataToSend = {
      name: formData.nome,
      email: formData.email,
      password: formData.senha,  // A senha está sendo enviada sem hash (isso é feito no back-end)
      peso: formData.peso,
      altura: formData.altura,
      telefone: formData.telefone,
      experiencia: formData.experiencia,
      user_type: 'aluno' // Definindo explicitamente o tipo de usuário
    };

    try {
      // Enviando os dados para o back-end (API)
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log('Dados do aluno enviados:', result);

      // Se o cadastro for bem-sucedido, redireciona para a lista de usuários
      if (response.status === 201) {
        navigate('/users');
      } else {
        alert('Erro ao cadastrar aluno!');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao cadastrar aluno!');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-success">Cadastro de Aluno</h2>

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        {/* Campo Nome */}
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Campo Idade */}
        <div className="mb-3">
          <label htmlFor="idade" className="form-label">Idade:</label>
          <input
            type="number"
            id="idade"
            name="idade"
            value={formData.idade}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Campo Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Campo Telefone */}
        <div className="mb-3">
          <label htmlFor="telefone" className="form-label">Telefone:</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Campo Peso */}
        <div className="mb-3">
          <label htmlFor="peso" className="form-label">Peso:</label>
          <input
            type="number"
            id="peso"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Campo Altura */}
        <div className="mb-3">
          <label htmlFor="altura" className="form-label">Altura:</label>
          <input
            type="number"
            id="altura"
            name="altura"
            value={formData.altura}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Campo Experiência */}
        <div className="mb-3">
          <label htmlFor="experiencia" className="form-label">Nível de Experiência:</label>
          <select
            id="experiencia"
            name="experiencia"
            value={formData.experiencia}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Selecione</option>
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>

        {/* Campo Senha */}
        <div className="mb-3">
          <label htmlFor="senha" className="form-label">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Botão de Submissão */}
        <button type="submit" className="btn btn-success w-100 mt-3">Cadastrar Aluno</button>
      </form>
    </div>
    
  );
};

export default AlunoCadastroPage;
