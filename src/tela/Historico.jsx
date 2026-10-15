import { useState } from "react";
import "../css/Historico.css";
import { dados } from "../data/Dados";
import { Link } from "react-router-dom";

export default function Historico() {
        const [historico, setHistorico] = useState(dados);

    return (
        <div className="histContainer">
            <div className="histSideBar">
                <Link to="/Dashboard">Dashboard</Link>
                <a>Histórico</a>
                <a>Relatórios</a>
                <a>Configurações</a>

                <a>{historico.usuarioNome}</a>
                <p>{historico.usuarioTipo}</p>

                <a>Sair do sistema</a>
            </div>

            <div className="histCabecalho">
                <h1>Histórico de operações</h1>
                <p>
                    Registro completo de todos os ciclos de atividade da máquina
                </p>
                <a className="histNome_da_maquina">
                    {historico.maquina}
                </a>
                <input type="date" />
            </div>

            <div className="histCards">

                <div className="cardFiltro">
                    <p>De: {historico.dataOperacao}</p>
                    <p>Até: {historico.listaInicio[0]}</p>
                    <p>{historico.listaTermino[0]}</p>
                    <p>{historico.duracao[0]}</p>
                    <p className="operandoStatus" style={{color: historico.status === 1 ? "#ffee00" : historico.status === 0 ? "#00ff2a" : ""}}>
                        {
                            historico.status === 1 ? 
                            "Em andamento" : 
                            historico.status === 0 ?
                            "Concluído" : ""
                        }
                    </p>
                </div>

                <div className="cardListaHist">
                    <table>
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Início</th>
                            <th>Término</th>
                            <th>Duração</th>
                            <th>Status</th>
                        </tr>
                        </thead>

                        <tbody>
                        {(historico.listaInicio || []).map((inicio, index) => (
                            <tr key={index}>
                            <td>{historico.dataOperacao}</td>
                            <td>{inicio}</td>
                            <td>{historico.listaTermino?.[index] || "—"}</td>
                            <td>{historico.duracao?.[index] || "—"}</td>
                            <td>
                                <span
                                className={
                                    historico.status === 1
                                    ? "statusAndamento"
                                    : "statusConcluida"
                                }
                                >
                                {historico.status === 1
                                    ? "Em andamento"
                                    : "Concluída"}
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="cardPassarPaginas">
                    <span>Mostrando 1–8 de {historico.totalOperacoes} operações</span>
                    <button className="paginaAtiva">1</button>
                    <button>2</button>
                    <button>3</button>
                    <span>...</span>
                    <button>12</button>
                    <button>Próxima →</button>
                </div>

                <div className="cardResumoHist">
                    <p>Total de operações: {historico.totalOperacoes}</p>
                    <p>Tempo total de operação: {historico.tempoEmOperacao}</p>
                    <p>Disponibilidade média: {historico.disponibilidade}%</p>
                </div>
                
            </div>

        </div>
    );
};