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
                    <p>{historico.dataOperacao}</p>
                    <p>{historico.listaInicio[0]}</p>
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

                </div>

                <div className="cardPassarPaginas">

                </div>

                <div className="cardResumoHist">

                </div>
                
            </div>

        </div>
    );
};