import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/DashBoard.css";
import { dados } from "../data/Dados";
import Historico from "./Historico";

export default function DashBoard() {
    const [dashboard, setDashboard] = useState(dados);

    useEffect(() => {
    const intervalo = setInterval(() => {
        setDashboard((e) => {
            return {
                ...e,

                disponibilidade: dados.disponibilidade,
                progressoEstimado: dados.progressoEstimado,
                dadosBarras: dados.dadosBarras
            };
        });
    }, 1000);
        return () => clearInterval(intervalo); 
    }, []);

    return (

        <div className="container">

            <div className="sideBar">
                <a>Dashboard</a>
                <Link to="/Historico">Histórico</Link>
                <a>Relatórios</a>
                <a>Configurações</a>

                <a>{dashboard.usuarioNome}</a>
                <p>{dashboard.usuarioTipo}</p>

                <a>Sair do sistema</a>
            </div>

            <div className="cabecalho">
                <h1>Painel de monitoramento</h1>
                <p>
                    Acompanhamento operacional e telemetria em tempo real
                </p>
                
                <a className="nome_da_maquina">
                    {dashboard.maquina}
                </a>
                <input type="date" />
            </div>

            <div className="cards">

                <div className="status">
                    <p>Status do {dashboard.maquina}</p>
                    <p className="operandoStatus" style={{color: dashboard.status === 1 ? "#00FF00" : dashboard.status === 0 ? "#FF0000" : ""}}>
                        {
                            dashboard.status === 1 ? 
                            "Operando" : 
                            dashboard.status === 0 ?
                            "Parado" : ""
                        }
                    </p>
                    <p>{
                            dashboard.status === 1 ? 
                            "Em operação" : 
                            dashboard.status === 0 ?
                            "Parado" : ""
                        }</p>
                </div>

                <div className="operacao">
                    <p>Tempo de Operação Hoje</p>
                    <p>{dashboard.tempoEmOperacao}</p>
                    <p>Meta diária: {dashboard.meta}</p>
                </div>

                <div className="parada">
                    <p>Tempo Parado Hoje</p>
                    <p>{dashboard.tempoParado}</p>
                    <p>Manutenção ou Setup</p>
                </div>

                <div className="disponibilidade">

                    <p>Disponibilidade</p>

                    <p>{dashboard.disponibilidade}%</p>

                    <p>Rendimento da máquina</p>

                    <div
                        className="graficoDisponibilidade"
                        style={{
                            "--progresso": `${dashboard.disponibilidade}%`
                        }}
                    >
                        <span>
                            {dashboard.disponibilidade}%
                        </span>
                    </div>

                </div>

            </div>

            <div className="grafico">
                <h2>Tempo de Operação por Dia</h2>
                <p>Histórico semanal de horas ativas</p>

                <div className="barras">
                    {dashboard.dadosBarras.map((dia, index) => (
                        <div className="barraContainer" key={index}>

                            <div
                                className={`barra ${
                                    index === dashboard.dadosBarras.length - 2
                                        ? "barraAtual"
                                        : ""
                                }`}
                                style={{
                                    height: `${dia.valor}%`
                                }}
                                data-tooltip={`${dia.dia} - ${dia.horas}`}
                            />

                            <span>{dia.dia}</span>

                        </div>
                    ))}
                </div>
            </div>

            <div className="cardOperacao">

                <h2>Operação Atual</h2>

                <span>{dashboard.operando}</span>

                <p>Início da atividade</p>

                <p>{dashboard.tempoDecorrido}</p>

                <p>{dashboard.progressoEstimado}%</p>

                <div className="barraProgresso">
                    <div
                        className="barraProgressoValor"
                        style={{
                            width: `${dashboard.progressoEstimado}%`
                        }}
                    />
                </div>

            </div>


            <div className="cardUltimaOperacao">

                <h2>Últimas Operações</h2>

                <p>Início</p>

                <ul>
                    {dashboard.listaInicio.map((inicio, index) => (
                        <li key={index}>{inicio}</li>
                    ))}
                </ul>

                <p>Término</p>

                <ul>
                    {dashboard.listaTermino.map((termino, index) => (
                        <li key={index}>{termino}</li>
                    ))}
                </ul>

                <p>Duração</p>

                <ul>
                    {dashboard.duracao.map((duracao, index) => (
                        <li key={index}>{duracao}</li>
                    ))}
                </ul>

            </div>

        </div>
    );
}
