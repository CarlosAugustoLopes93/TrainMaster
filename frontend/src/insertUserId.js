import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InserirAlunoIdPage = () => {
    const [alunoId, setAlunoId] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (alunoId) {
            // Redireciona para a página de WorkoutListPage com o alunoId
            navigate(`/treinos/${alunoId}`);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Insira o ID do Aluno</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="alunoId">ID do Aluno:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="alunoId"
                        value={alunoId}
                        onChange={(e) => setAlunoId(e.target.value)}
                        placeholder="Digite o ID do aluno"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Ver Treino</button>
            </form>
        </div>
    );
};

export default InserirAlunoIdPage;
