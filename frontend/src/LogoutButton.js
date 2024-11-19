import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <button className="btn btn-outline-light position-absolute top-0 end-0 m-3" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
