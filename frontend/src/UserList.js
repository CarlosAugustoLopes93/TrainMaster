import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import LogoutButton from './LogoutButton';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    peso: '',
    altura: '',
    telefone: '',
    experiencia: '',
    user_type: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setFeedback({ type: 'danger', message: 'Erro ao carregar usuários' });
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userToDelete}`);
      setUsers(users.filter(user => user.id !== userToDelete));
      setFeedback({ type: 'success', message: 'Usuário excluído com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error.response?.data || error.message);
      setFeedback({ type: 'danger', message: 'Erro ao excluir usuário' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleEdit = (user) => {
    setUserToEdit(user.id);
    setEditFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      peso: user.peso,
      altura: user.altura,
      telefone: user.telefone,
      experiencia: user.experiencia,
      user_type: user.user_type
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const confirmEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userToEdit}`, editFormData);
      setUsers(users.map(user => user.id === userToEdit ? { ...user, ...editFormData } : user));
      setFeedback({ type: 'success', message: 'Usuário editado com sucesso!' });
    } catch (error) {
      console.error('Erro ao editar usuário:', error.response?.data || error.message);
      setFeedback({ type: 'danger', message: 'Erro ao editar usuário' });
    } finally {
      setShowEditModal(false);
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setUserToEdit(null);
    setEditFormData({
      name: '',
      email: '',
      password: '',
      peso: '',
      altura: '',
      telefone: '',
      experiencia: '',
      user_type: ''
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-success">Lista de Usuários</h1>
      <LogoutButton />
      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      <table className="table table-bordered table-striped">
        <thead className="thead-light bg-success text-white">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo de Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nenhum usuário encontrado
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.user_type}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => handleDelete(user.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal de Exclusão */}
      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você realmente deseja excluir este usuário?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={editFormData.password}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formPeso">
              <Form.Label>Peso</Form.Label>
              <Form.Control
                type="number"
                name="peso"
                value={editFormData.peso}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formAltura">
              <Form.Label>Altura</Form.Label>
              <Form.Control
                type="number"
                name="altura"
                value={editFormData.altura}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formTelefone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="telefone"
                value={editFormData.telefone}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formExperiencia">
              <Form.Label>Experiência</Form.Label>
              <Form.Control
                type="text"
                name="experiencia"
                value={editFormData.experiencia}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserType">
              <Form.Label>Tipo de Usuário</Form.Label>
              <Form.Control
                as="select"
                name="user_type"
                value={editFormData.user_type}
                onChange={handleEditChange}
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuário</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmEdit}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;
