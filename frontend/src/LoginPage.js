import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Inicializando o useNavigate

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Credenciais enviadas:', credentials); // Log das credenciais enviadas

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);

      console.log('Resposta da API:', response.data); // Log da resposta recebida

      alert(response.data.message); // Exibe mensagem de sucesso
      localStorage.setItem('token', response.data.token); // Armazenando o token no localStorage

      // Verificando o tipo de usuário (user_type) e redirecionando
      if (response.data.user_type === 'treinador') {
        navigate('/treinador-dashboard'); // Usando navigate para redirecionar
      } else if (response.data.user_type === 'aluno') {
        navigate('/aluno-dashboard'); // Usando navigate para redirecionar
      } else {
        alert('Tipo de usuário inválido');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error); // Log do erro completo
      console.error('Detalhes do erro:', error.response?.data); // Detalhes da resposta da API, se disponíveis
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
