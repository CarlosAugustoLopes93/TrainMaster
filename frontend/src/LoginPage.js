import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Definir a URL base da API, usando a variável de ambiente REACT_APP_API_URL
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Usando localhost para desenvolvimento local

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Credenciais enviadas:', credentials); // Log das credenciais enviadas

    try {
      // Enviar a requisição POST para a API de login
      const response = await axios.post(`${apiUrl}/api/auth/login`, credentials);

      console.log('Resposta da API:', response.data);

      alert(response.data.message); // Exibe mensagem de sucesso
      localStorage.setItem('token', response.data.token); // Armazenando o token no localStorage

      // Verificando o tipo de usuário (user_type) e redirecionando
      if (response.data.user_type === 'treinador') {
        navigate('/treinador-dashboard');
      } else if (response.data.user_type === 'aluno') {
        navigate('/aluno-dashboard');
      } else {
        alert('Tipo de usuário inválido');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      console.error('Detalhes do erro:', error.response?.data);
      setErrorMessage(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-success">Login</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Senha"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
