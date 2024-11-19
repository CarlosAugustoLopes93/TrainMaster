import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate('/user-registration'); // Atualize para a rota correta
  };
  

  return (
    <div className="container mt-5">
      <h1 className="text-center text-success">Bem-vindo ao Sistema</h1>
      <p className="text-center">Clique abaixo para criar uma conta.</p>
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleNavigateToRegister}>
          Cadastre-se
        </button>
      </div>
    </div>
  );
};

export default HomePage;
