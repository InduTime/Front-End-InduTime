import { useState } from "react";

export default function DashBoard(){
    /* Tipo de maquina que sera mostrada na página */
    const [maquina, setMaquina] = useState("Torno CNC");
    
    /* Variaveis do card de operaçoes */
    const [status, setStatus] = useState(0);
    const [operando, setOperando] = useState("Operando");
    
    /* Variaveis do card de Tempo em operação */
    const [tempoEmOperacao, setTempoEmOperacao] = useState("06h 42min");
    const [meta, setMeta] = useState("08h 00min");

    /* Variaveis do card de Tempo parado */
    const [tempoParado, setTempoParado] = useState("01h 18min");
    
    /* Variaveis do card de Disponibilidade */
    const [disponibilidade, setDisponibilidade] = useState(84.5);
    
    /* Variaveis do Grafico de barras */
    const [dadosBarras, setDadosBarras] = useState("Gráfico da porcentagem");
    
    /* Variaveis do Card de Operação Atual */
    const [inico, setInicio] = useState("14:32");
    const [tempoDecorrido, setTempoDecorrido] = useState("02h 17min");
    const [tempoEstimado, setTempoEstimado] = useState(76)

    return(
        <div>
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
                    <p>"Gráfico da porcentagem"</p>
                </div>
            </div>

            <div className="grafico">
                <h2>Tempo de Operação por Dia</h2>
                <p>Histórico semanal de horas ativas</p>
                <p>{dadosBarras}</p>
            </div>

            <div className="cardOperacao">
                <h2>Operação Atial</h2>
                {operando}
                <p>Início da atividade</p>
            </div>
            <div className="cardUltimaOperacao">

            </div>
        </div>
    );
};