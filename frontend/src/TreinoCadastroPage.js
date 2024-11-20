import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import axios from 'axios';

const TreinoCadastroPage = () => {
    const [workoutData, setWorkoutData] = useState({ name: '', description: '', duration: '', trainerId: '', studentId: '' });
    const [exercises, setExercises] = useState([{ id: '', sets: '', reps: '', weight: '' }]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [availableTrainers, setAvailableTrainers] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    // Definir a URL base da API
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Para desenvolvimento local

    useEffect(() => {
        // Carregar exercícios
        axios.get(`${apiUrl}/api/exercises`)
            .then(response => {
                setAvailableExercises(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar exercícios:', error);
            });

        // Carregar treinadores
        axios.get(`${apiUrl}/api/trainers`)
            .then(response => {
                setAvailableTrainers(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar treinadores:', error);
            });

        // Carregar alunos (com filtro no servidor ou local)
        axios.get(`${apiUrl}/api/users`)
            .then(response => {
                const filteredStudents = response.data.filter(user => user.user_type === 'aluno');
                setAvailableStudents(filteredStudents);
            })
            .catch(error => {
                console.error('Erro ao carregar alunos:', error);
            });
    }, []);

    const handleChange = (e) => {
        setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
    };

    const handleExerciseChange = (index, e) => {
        const updatedExercises = [...exercises];
        updatedExercises[index][e.target.name] = e.target.value;
        setExercises(updatedExercises);
    };

    const addExercise = () => {
        setExercises([...exercises, { id: '', sets: '', reps: '', weight: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const dataToSend = {
            name: workoutData.name,
            description: workoutData.description,
            duration: parseInt(workoutData.duration, 10),
            trainer_id: workoutData.trainerId,
            user_id: workoutData.studentId,
            exercises: exercises.map(ex => ({
                name: ex.name || 'Nome não fornecido', // Verifique se o nome do exercício é fornecido
                sets: parseInt(ex.sets, 10),
                reps: parseInt(ex.reps, 10),
                weight: parseFloat(ex.weight)
            }))
        };
    
        try {
            const response = await fetch(`${apiUrl}/api/workouts`, {  // Usando apiUrl
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                setFeedback({ type: 'danger', message: `Erro: ${errorData.error || 'Erro desconhecido'}` });
            } else {
                setFeedback({ type: 'success', message: 'Treino cadastrado com sucesso!' });
                setTimeout(() => navigate('/treinos'), 1500);
            }
        } catch (error) {
            setFeedback({ type: 'danger', message: 'Erro ao enviar dados' });
        }
    };
    

    return (
        <div className="container mt-5">
            <h1 className="text-center text-success">Cadastro de Treino</h1>

            {feedback.message && (
                <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
                    {feedback.message}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="form-group">
                <input
                    type="text"
                    name="name"
                    placeholder="Nome do Treino"
                    className="form-control mb-3"
                    value={workoutData.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Descrição"
                    className="form-control mb-3"
                    value={workoutData.description}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="duration"
                    placeholder="Duração (minutos)"
                    className="form-control mb-3"
                    value={workoutData.duration}
                    onChange={handleChange}
                    required
                />

                <div className="form-group mb-3">
                    <select
                        name="trainerId"
                        className="form-control"
                        value={workoutData.trainerId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um Treinador</option>
                        {availableTrainers.map(trainer => (
                            <option key={trainer.id} value={trainer.id}>
                                {trainer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mb-3">
                    <select
                        name="studentId"
                        className="form-control"
                        value={workoutData.studentId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um Aluno</option>
                        {availableStudents.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                <h5 className="mt-4">Exercícios</h5>
                {exercises.map((exercise, index) => (
                    <div key={index} className="exercise-group mb-3">
                        <select
                            name="id"
                            className="form-control mb-2"
                            value={exercise.id}
                            onChange={(e) => handleExerciseChange(index, e)}
                            required
                        >
                            <option value="">Selecione um exercício</option>
                            {availableExercises.map(availableExercise => (
                                <option key={availableExercise.id} value={availableExercise.id}>
                                    {availableExercise.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="sets"
                            placeholder="Séries"
                            className="form-control mb-2"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="reps"
                            placeholder="Repetições"
                            className="form-control mb-2"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(index, e)}
                            required
                        />
                        <input
                            type="number"
                            name="weight"
                            placeholder="Peso (kg)"
                            className="form-control mb-2"
                            value={exercise.weight}
                            onChange={(e) => handleExerciseChange(index, e)}
                            required
                        />
                    </div>
                ))}

                <button type="button" className="btn btn-secondary mb-3" onClick={addExercise}>
                    Adicionar Exercício
                </button>
                <button type="submit" className="btn btn-success w-100">Cadastrar Treino</button>
            </form>
        </div>
    );
};

export default TreinoCadastroPage;
