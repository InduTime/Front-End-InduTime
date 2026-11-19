import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import "../css/DashBoard.css";
import { buscarMaquina, rotuloEnum, rotuloStatus } from "../services/api";
import { formatarDataHora, formatarDuracaoSegundos, valorNumericoValido } from "../utils/formatacao";

export default function DashBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maquina, setMaquina] = useState(null);
  const [segundosOperacao, setSegundosOperacao] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    let primeiraCarga = true;

    async function carregar() {
      try {
        const dados = await buscarMaquina(id);
        if (!ativo) return;
        setMaquina(dados);
        setErro("");
      } catch (e) {
        if (ativo) setErro(e.message);
      } finally {
        if (ativo && primeiraCarga) {
          setLoading(false);
          primeiraCarga = false;
        }
      }
    }

    carregar();
    const intervalo = window.setInterval(carregar, 30000);
    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, [id]);

  useEffect(() => {
    if (!maquina) return;
    setSegundosOperacao(valorNumericoValido(maquina.totalOperatingSeconds) ? maquina.totalOperatingSeconds : 0);
  }, [maquina]);

  useEffect(() => {
    if (!maquina?.running) return undefined;
    const intervalo = window.setInterval(() => setSegundosOperacao((valor) => valor + 1), 1000);
    return () => window.clearInterval(intervalo);
  }, [maquina?.running, maquina?.id]);

  if (loading) return <div className="container"><Sidebar maquinaId={id} /><main className="painelConteudo"><p>Carregando dados da máquina...</p></main></div>;
  if (erro || !maquina) return <div className="container"><Sidebar maquinaId={id} /><main className="painelConteudo"><h2>Não foi possível carregar a máquina</h2><p role="alert">{erro || "Máquina não encontrada."}</p><button onClick={() => navigate("/ListaMaquinas")}>Voltar para máquinas</button></main></div>;

  const emOperacao = maquina.running === true;
  const statusColor = maquina.status === "ONLINE" ? "#16a34a" : maquina.status === "OFFLINE" ? "#dc2626" : "#d97706";
  const temTempoOperacao = valorNumericoValido(maquina.totalOperatingSeconds);
  const temTempoAcumulado = valorNumericoValido(maquina.operatingTimeSeconds);

  return <div className="container">
    <Sidebar maquinaId={id} />
    <main className="painelConteudo">
      <header className="cabecalho">
        <h1>Painel de monitoramento</h1>
        <p>Informações cadastrais e dados operacionais recebidos da API.</p>
        <span className="nome_da_maquina">{maquina.displayName}</span>
      </header>

      <section className="cards">
        <div className="status">
          <p>Status da máquina</p>
          <p className="operandoStatus" style={{ color: statusColor }}>{rotuloStatus(maquina.status)}</p>
          <p>{emOperacao ? "Máquina em operação" : "Sem operação em andamento"}</p>
        </div>
        <div className="operacao">
          <p>Tempo da operação atual</p>
          <p>{emOperacao && temTempoOperacao ? formatarDuracaoSegundos(segundosOperacao) : "—"}</p>
          <p>{emOperacao ? "Contador baseado em totalOperatingSeconds" : "Disponível quando a máquina estiver operando"}</p>
        </div>
        <div className="parada">
          <p>Temperatura atual</p>
          <p>{typeof maquina.temperature === "number" && Number.isFinite(maquina.temperature) ? `${maquina.temperature.toFixed(1)} °C` : "—"}</p>
          <p>Último valor informado pela API</p>
        </div>
        <div className="disponibilidade">
        {emOperacao ? (
          <div>
            <p>Operação atual</p>
            <p>Tempo em operação: {temTempoOperacao ? formatarDuracaoSegundos(segundosOperacao) : "Não informado pela API"}</p>
            <p>Início da operação: {formatarDataHora(maquina.operationStartedAt)}</p>
          </div>
        ) : (
          <p>A API informa que não há uma operação em andamento neste momento.</p>
        )}
        </div>
      </section>

      <section className="cardOperacao">
        <h2>Dados da máquina</h2>
        <p><strong>ID:</strong> {maquina.id}</p>
        <p><strong>ID do Raspberry:</strong> {maquina.raspberryMachineId ?? "Não vinculado/informado"}</p>
        <p><strong>Modelo:</strong> {rotuloEnum(maquina.model)}</p>
        <p><strong>Fabricante:</strong> {rotuloEnum(maquina.manufacturer)}</p>
        <p><strong>Setor:</strong> {rotuloEnum(maquina.location)}</p>
        <p><strong>Número de série:</strong> {maquina.serialNumber || "—"}</p>
        <p><strong>Tempo total acumulado de operação:</strong> {temTempoAcumulado ? formatarDuracaoSegundos(maquina.operatingTimeSeconds) : "Não informado pela API"}</p>
      </section>

      <section className="cardUltimaOperacao">
        <h2>Sobre os dados operacionais</h2>
        <p>O contador desta tela utiliza <code>totalOperatingSeconds</code>, que representa a duração da sessão de operação atual. Ele avança localmente enquanto <code>running</code> estiver verdadeiro. A tela atualiza os dados da API a cada 30 segundos.</p>
        <p>O campo <code>operatingTimeSeconds</code> representa o tempo total acumulado de operação da máquina desde sua criação.</p>
      </section>
    </main>
  </div>;
}
