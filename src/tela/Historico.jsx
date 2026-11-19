import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import "../css/Historico.css";
import "../css/Redesign.css";
import { buscarMaquina, rotuloStatus } from "../services/api";
import { formatarDataHora, formatarDuracaoSegundos, valorNumericoValido } from "../utils/formatacao";

export default function Historico() {
  const { id } = useParams();
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

    if (id) carregar();
    const intervalo = window.setInterval(() => { if (id) carregar(); }, 30000);
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

  const emOperacao = maquina?.running === true;
  const temTempo = valorNumericoValido(maquina?.totalOperatingSeconds);
  const temTempoAcumulado = valorNumericoValido(maquina?.operatingTimeSeconds);

  return <div className="histContainer">
    <Sidebar maquinaId={id} />
    <main className="histConteudo">
      <header className="histCabecalho">
        <h1>Histórico de operações</h1>
        <p>{maquina ? `Máquina: ${maquina.displayName} · ID: ${maquina.id}` : "Acompanhamento da operação da máquina"}</p>
      </header>

      {loading && <section className="histCards"><div className="cardListaHist"><p>Carregando informações da máquina...</p></div></section>}
      {erro && <p className="histErro" role="alert">{erro}</p>}

      {!loading && maquina && (
        <>
          <section className="histResumoAtual">
            <div>
              <span className="histRotulo">Estado atual</span>
              <strong className={emOperacao ? "histEstadoOnline" : "histEstadoOffline"}>{emOperacao ? "Em operação" : rotuloStatus(maquina.status)}</strong>
            </div>
            <div>
              <span className="histRotulo">Duração da operação atual</span>
              <strong>{emOperacao && temTempo ? formatarDuracaoSegundos(segundosOperacao) : "—"}</strong>
            </div>
            <div>
              <span className="histRotulo">Início da operação atual</span>
              <strong>{emOperacao ? formatarDataHora(maquina.operationStartedAt) : "—"}</strong>
            </div>
            <div>
              <span className="histRotulo">Tempo acumulado desde a criação</span>
              <strong>{temTempoAcumulado ? formatarDuracaoSegundos(maquina.operatingTimeSeconds) : "—"}</strong>
            </div>
          </section>

          <section className="histCards">
            <div className="cardListaHist">
              <div className="histTituloLista">
                <div>
                  <h2>Sessão de operação</h2>
                  <p>Informações atuais fornecidas pela rota de consulta da máquina.</p>
                </div>
                <span className={emOperacao ? "histBadgeAtivo" : "histBadgeParado"}>{emOperacao ? "EM ANDAMENTO" : "SEM OPERAÇÃO ATUAL"}</span>
              </div>

              {emOperacao ? (
                <div className="histEvento">
                  <span className="histEventoIcone">⏻</span>
                  <div className="histEventoConteudo">
                    <strong>Máquina ligada / operação iniciada</strong>
                    <span>{formatarDataHora(maquina.operationStartedAt)}</span>
                    <small>Tempo decorrido informado pela API: {temTempo ? formatarDuracaoSegundos(segundosOperacao) : "não informado"}</small>
                  </div>
                  <span className="histBadgeAtivo">ONLINE</span>
                </div>
              ) : (
                <div className="histSemEvento">
                  <p>A API informa que não existe uma operação em andamento.</p>
                  <p>Última telemetria recebida: {formatarDataHora(maquina.lastTelemetryAt)}.</p>
                </div>
              )}
            </div>
          </section>

          <section className="histAvisoDados">
            <strong>Limite dos dados disponíveis</strong>
            <p>A rota <code>GET /v1/cncmachine/{id}</code> informa a operação atual, mas não retorna uma lista de eventos anteriores de ligar e desligar. Por isso, esta tela mostra somente a sessão atual e não cria registros passados fictícios. Quando houver uma rota de eventos, ela poderá alimentar esta lista cronológica com todas as sessões reais.</p>
            <p>A duração da sessão atual utiliza <code>totalOperatingSeconds</code>. O tempo acumulado desde a criação da máquina utiliza <code>operatingTimeSeconds</code>.</p>
          </section>
        </>
      )}
    </main>
  </div>;
}
