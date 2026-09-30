import { useEffect, useState } from "react";
import "../css/DashBoard.css";
import { dados } from "../data/Dados";
import { Link } from "react-router-dom";

export default function Historico() {
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
                <Link to="/Dashboard">Dashboard</Link>
                <a>Histórico</a>
                <a>Relatórios</a>
                <a>Configurações</a>

                <a>{dashboard.usuarioNome}</a>
                <p>{dashboard.usuarioTipo}</p>

                <a>Sair do sistema</a>
            </div>

            <div className="cabecalho">
                <h1>histórico de operações</h1>
                <p>
                    Registro completo de todos os ciclos de atividade da máquina
                </p>
                <a className="nome_da_maquina">
                    {dashboard.maquina}
                </a>
                <input type="date" />
            </div>


        </div>
    );
};