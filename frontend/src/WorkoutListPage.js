import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';

const WorkoutListPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); // Pegando o 'id' da URL (que é o user_id)

  // Definir a URL base da API, considerando o ambiente de produção ou desenvolvimento
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Para desenvolvimento local

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!id) {
        console.error('ID não fornecido na URL');
        return;
      }

      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        console.error('ID inválido');
        return;
      }

      try {
        console.log('Fazendo requisição para treinos...');
        const response = await axios.get(`${apiUrl}/api/workouts/${userId}`);
        console.log('Resposta recebida dos treinos:', response.data);

        // Verifique se a resposta contém treinos
        if (response.data.length === 0) {
          console.log('Nenhum treino encontrado.');
        } else {
          // Agora vamos buscar o nome do treinador para cada treino
          const workoutsWithTrainerName = await Promise.all(
            response.data.map(async (workout) => {
              try {
                // Realizando uma requisição para obter o nome do treinador
                const trainerResponse = await axios.get(`${apiUrl}/api/trainers/${workout.trainer_id}`);
                const trainerName = trainerResponse.data.name;  // Ajuste o campo conforme o formato da resposta da API
                return {
                  ...workout,
                  trainer_name: trainerName || 'Nome do treinador não encontrado',
                };
              } catch (error) {
                console.error('Erro ao buscar o nome do treinador', error);
                return {
                  ...workout,
                  trainer_name: 'Nome do treinador não encontrado',
                };
              }
            })
          );

          setWorkouts(workoutsWithTrainerName);
        }
      } catch (error) {
        console.error('Erro ao carregar os workouts', error);
        setError('Erro ao carregar os treinos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [id]); // Dependência do id

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="success" />
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Lista de Treinos</h1>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {workouts.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nenhum treino encontrado para o usuário com ID {id}.
        </Alert>
      ) : (
        <div className="row">
          {workouts.map((workout) => (
            <div className="col-md-4 mb-4" key={workout.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{workout.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Duração: {workout.duration} minutos</Card.Subtitle>
                  <Card.Text>{workout.description}</Card.Text>
                  {/* Exibindo ID e Nome do Treinador */}
                  <Card.Text>
                    <strong>Treinador:</strong> {workout.trainer_id} - {workout.trainer_name}
                  </Card.Text>
                  <Button variant="primary" onClick={() => alert('Visualizando mais detalhes do treino!')}>
                    Ver Detalhes
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutListPage;
