import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Modal, Form } from 'react-bootstrap';

const ListTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTrainer, setCurrentTrainer] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trainers');
        setTrainers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleEdit = (trainer) => {
    console.log('Editando treinador:', trainer);
    setCurrentTrainer(trainer);
    setShowEditModal(true);
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/trainers/${id}`);
      setTrainers(trainers.filter(trainer => trainer.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  const handleUpdate = async () => {
    console.log('Dados atualizados:', currentTrainer);
    try {
      const response = await axios.put(`http://localhost:5000/api/trainers/${currentTrainer.id}`, currentTrainer);
      setTrainers(trainers.map(trainer => (trainer.id === currentTrainer.id ? response.data : trainer)));
      setShowEditModal(false);
      setCurrentTrainer(null);
    } catch (err) {
      setError(err);
    }
  };
  

  if (loading) return <div>Carregando...</div>;
  if (error) return <Alert variant="danger">Erro ao carregar treinadores: {error.message}</Alert>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-success">Lista de Treinadores</h2>
      <table className="table table-bordered table-striped">
        <thead className="thead-light bg-success text-white">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Biografia</th>
            <th>Localização</th>
            <th>Certificações</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {trainers.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">Nenhum treinador encontrado</td>
            </tr>
          ) : (
            trainers.map((trainer) => (
              <tr key={trainer.id}>
                <td>{trainer.id}</td>
                <td>{trainer.name}</td>
                <td>{trainer.specialty}</td>
                <td>{trainer.email}</td>
                <td>{trainer.phone}</td>
                <td>{trainer.bio}</td>
                <td>{trainer.location}</td>
                <td>{trainer.certifications}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(trainer)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(trainer.id)}>Excluir</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Treinador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTrainerName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={currentTrainer?.name || ''}
                onChange={(e) => setCurrentTrainer({ ...currentTrainer, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTrainerSpecialty">
              <Form.Label>Especialidade</Form.Label>
              <Form.Control
                type="text"
                value={currentTrainer?.specialty || ''}
                onChange={(e) => setCurrentTrainer({ ...currentTrainer, specialty: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTrainerEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentTrainer?.email || ''}
                onChange={(e) => setCurrentTrainer({ ...currentTrainer, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTrainerPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                value={currentTrainer?.phone || ''}
                onChange={(e) => setCurrentTrainer({ ...currentTrainer, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTrainerBio">
              <Form.Label>Biografia</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentTrainer?.bio || ''}
                onChange={(e) => setCurrentTrainer({ ...currentTrainer, bio: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTrainerLocation">
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                value={currentTrainer?.location || ''}
                onChange={(e) => setCurrentTrainer({ ...currentTrainer, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTrainerCertifications">
              <Form.Label>Certificações</Form.Label>
              <Form.Control
                type="text"
                value={currentTrainer?.certifications || ''}
                onChange={(e) => setCurrentTrainer({ ...currentTrainer, certifications: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleUpdate}>Salvar Alterações</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListTrainers;
