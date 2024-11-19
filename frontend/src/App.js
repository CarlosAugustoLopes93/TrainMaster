import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import UserList from './UserList';
import LoginPage from './LoginPage';
import CustomNavbar from './Navbar';
import PrivateRoute from './PrivateRoute';
import ListTrainers from './components/ListTrainers';
import TreinadorCadastroPage from './TreinadorCadastroPage';
import TreinoCadastroPage from './TreinoCadastroPage';
import WorkoutListPage from './WorkoutListPage';
import AlunoCadastroPage from './AlunoCadastroPage'; // Certifique-se que está importado
import UserRegistrationPage from './UserRegistrationPage';
import InserirAlunoIdPage from './insertUserId'; // Importando a página de inserir ID

const App = () => {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
        <Route path="/trainers" element={<PrivateRoute><ListTrainers /></PrivateRoute>} />
        <Route path="/treinador-cadastro" element={<PrivateRoute><TreinadorCadastroPage /></PrivateRoute>} />
        <Route path="/treinos" element={<PrivateRoute><InserirAlunoIdPage /></PrivateRoute>} /> {/* Alterado para a página de inserir ID */}
        <Route path="/treinos/:id" element={<PrivateRoute><WorkoutListPage /></PrivateRoute>}/>
        <Route path="/treino-cadastro" element={<PrivateRoute><TreinoCadastroPage /></PrivateRoute>} />
        <Route path="/aluno-cadastro" element={<PrivateRoute><AlunoCadastroPage /></PrivateRoute>} /> {/* Adicione esta rota */}
        <Route path="/user-registration" element={<UserRegistrationPage />} /> {/* Adicionando a rota de cadastro de usuário */}
      </Routes>
    </Router>
  );
};

export default App;
