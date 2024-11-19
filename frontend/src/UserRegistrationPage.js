import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegistrationPage = () => {
  const [userType, setUserType] = useState(null); // Armazena o tipo de usuário
  const navigate = useNavigate(); // Gerencia a navegação entre páginas

  const handleSelectUserType = (type) => {
    setUserType(type); // Atualiza o tipo de usuário conforme a seleção
  };

  const handleRegister = () => {
    if (userType) {
      console.log(`Navigating to ${userType} registration page`); // Verificação do tipo de usuário
      if (userType === 'trainer') {
        navigate('/treinador-cadastro'); // Página de cadastro de treinador
      } else if (userType === 'student') {
        navigate('/aluno-cadastro'); // Página de cadastro de aluno
      }
    } else {
      alert('Selecione um tipo de usuário'); // Alerta caso nenhum tipo tenha sido selecionado
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cadastro de Usuário</h2>
      <p style={styles.subtitle}>Escolha o seu tipo de usuário:</p>

      <div style={styles.buttonContainer}>
        {/* Botões para seleção do tipo de usuário */}
        <button
          onClick={() => handleSelectUserType('trainer')}
          style={{
            ...styles.button,
            backgroundColor: userType === 'trainer' ? '#4CAF50' : '#f0f0f0',
          }}
        >
          Sou Treinador
        </button>
        <button
          onClick={() => handleSelectUserType('student')}
          style={{
            ...styles.button,
            backgroundColor: userType === 'student' ? '#4CAF50' : '#f0f0f0',
          }}
        >
          Sou Aluno
        </button>
      </div>

      <button onClick={handleRegister} style={styles.registerButton}>
        Cadastrar
      </button>
    </div>
  );
};

// Estilos básicos para harmonizar com o design das outras telas
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    color: '#333',
  },
  registerButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default UserRegistrationPage;
