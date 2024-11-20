import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const TreinadorCadastroPage = () => {
  const [trainerData, setTrainerData] = useState({
    name: '',
    specialty: '',
    email: '',
    password: '',  // Novo campo para senha
    phone: '',
    bio: '',
    location: '',
    certifications: '',
    user_type: 'trainer' // Definindo tipo de usuário como 'trainer'
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  // Definir a URL base da API
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Para desenvolvimento local

  const handleChange = (e) => {
    setTrainerData({ ...trainerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/api/trainers`, {  // Usando apiUrl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainerData),
      });

      console.log('Response:', response); // Adicionando para debug
      if (response.ok) {
        setFeedback({ type: 'success', message: 'Treinador cadastrado com sucesso!' });
        setTimeout(() => {
          navigate('/trainers');
        }, 2000);
      } else {
        setFeedback({ type: 'danger', message: 'Erro ao cadastrar treinador. Verifique os dados e tente novamente.' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar treinador. Tente novamente mais tarde.' });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-success">Cadastro de Treinador</h1>

      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          className="form-control mb-3"
          value={trainerData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialty"
          placeholder="Especialidade"
          className="form-control mb-3"
          value={trainerData.specialty}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          value={trainerData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"  // Tipo 'password' para a senha
          name="password"
          placeholder="Senha"
          className="form-control mb-3"
          value={trainerData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefone"
          className="form-control mb-3"
          value={trainerData.phone}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Biografia"
          className="form-control mb-3"
          value={trainerData.bio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Localização"
          className="form-control mb-3"
          value={trainerData.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="certifications"
          placeholder="Certificações"
          className="form-control mb-3"
          value={trainerData.certifications}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-success w-100">Cadastrar</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/login" className="text-decoration-none text-success">Já tem uma conta? Faça login aqui</Link>
      </div>
    </div>
  );
};

export default TreinadorCadastroPage;
