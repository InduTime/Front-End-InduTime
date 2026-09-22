import { useState } from "react";
import "../css/DashBoard.css"
import { dados } from "../data/Dados";

export default function DashBoard(){
    const [maquina, setMaquina] = useState(dados.maquina);
    const [status, setStatus] = useState(dados.status);
    const [operando, setOperando] = useState(dados.operando);
    const [tempoEmOperacao, setTempoEmOperacao] = useState(dados.tempoEmOperacao);
    const [meta, setMeta] = useState(dados.meta);
    const [tempoParado, setTempoParado] = useState(dados.tempoParado);
    const [disponibilidade, setDisponibilidade] = useState(dados.disponibilidade);
    const [dadosBarras, setDadosBarras] = useState(dados.dadosBarras);
    const [inicio, setInicio] = useState(dados.inicio);
    const [tempoDecorrido, setTempoDecorrido] = useState(dados.tempoDecorrido);
    const [progressoEstimado, setProgressoEstimado] = useState(dados.progressoEstimado)
    const [listaInicio, setListaInicio] = useState(dados.listaInicio);
    const [listaTermino, setListaTermino] = useState(dados.listaTermino);
    const [duracao, setDuracao] = useState(dados.duracao);
    const [usuarioNome, setusuarioNome] = useState(dados.usuarioNome);
    const [usuarioTipo, setusuarioTipo] = useState(dados.usuarioTipo);

    return(
        <div className="container">
            <div className="sideBar">
                <a>Dashboard</a>
                <a>Histórico</a>
                <a>Relatórios</a>
                <a>Configurações</a>
                <a>{usuarioNome}</a>
                <p>{usuarioTipo}</p>
                <a>Sair do sistema</a>
            </div>
            <div className="cabecalho">
                <h1>Painel de monitoramento</h1>
                <p>Acompanhamento operacional e telemetria em tempo real</p>
                <input type="date"/>
            </div>

            <div className="cards">
                <div className="status">
                    <p>Status do {maquina}</p>
                    <p className="operandoStatus">{operando}</p>
                    <p>Em Operação</p>
                </div>
                <div className="operacao">
                    <p>Tempo de Operação Hoje</p>
                    <p>{tempoEmOperacao}</p>
                    <p>Meta diária: {meta}</p>
                </div>
                <div className="parada">
                    <p>Tempo Parado Hoje</p>
                    <p>{tempoParado}</p>
                    <p>Manutenção ou Setup</p>
                </div>
                <div className="disponibilidade">
                    <p>Disponibilidade</p>
                    <p>{disponibilidade}</p>
                    <p>Rendimento da máquina</p>
                </div>
            </div>

            <div className="grafico">
                <h2>Tempo de Operação por Dia</h2>
                <p>Histórico semanal de horas ativas</p>
                <p>{dadosBarras}</p>
            </div>

            <div className="cardOperacao">
                <h2>Operação Atual</h2>
                {operando}
                <p>Início da atividade</p>
                <p>{tempoDecorrido}</p>
                <p>{progressoEstimado}</p>
            </div>
            <div className="cardUltimaOperacao">
                <h2>Últimas Operações</h2>
                <p>início</p>
                <ul>
                    <li>{listaInicio[0]}</li>
                    <li>{listaInicio[1]}</li>
                    <li>{listaInicio[2]}</li>
                    <li>{listaInicio[3]}</li>
                </ul>
                <p>Término</p>
                <ul>
                    <li>{listaTermino[0]}</li>
                    <li>{listaTermino[1]}</li>
                    <li>{listaTermino[2]}</li>
                    <li>{listaTermino[3]}</li>
                </ul>
                <p>Duração</p>
                <ul>
                    <li>{duracao[0]}</li>
                    <li>{duracao[1]}</li>
                    <li>{duracao[2]}</li>
                    <li>{duracao[3]}</li>
                </ul>
            </div>
            <a>Relatórios</a>
        </div>
    );
};