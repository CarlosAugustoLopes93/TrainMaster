import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white">
          <h3>TrainMaster</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
            <Nav.Link as={Link} to="/login" className="text-white">Login</Nav.Link>
            <Nav.Link as={Link} to="/users" className="text-white">Usuários</Nav.Link>
            <Nav.Link as={Link} to="/trainers" className="text-white">Treinadores</Nav.Link>
            <Nav.Link as={Link} to="/treinador-cadastro" className="text-white">Cadastro Treinador</Nav.Link>
            <Nav.Link as={Link} to="/treino-cadastro" className="text-white">Cadastro de Treino</Nav.Link>
            <Nav.Link as={Link} to="/treinos" className="text-white">Listar Treinos</Nav.Link> {/* Alterado aqui */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
