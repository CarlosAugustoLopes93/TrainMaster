import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user'); // Verifique se o usuário está logado
  
  // Para testes, permita acesso à rota de usuários sem autenticação
  const allowAccessForTesting = true; // Mude para false quando a autenticação real estiver implementada

  return isAuthenticated || allowAccessForTesting ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
