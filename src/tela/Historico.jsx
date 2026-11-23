import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import "../css/Historico.css";
import "../css/Redesign.css";
import { buscarMaquina, buscarOperacoes, buscarDetalheOperacao } from "../services/api";
import { formatarDataHora, formatarDuracaoSegundos } from "../utils/formatacao";

const STATUS_OPERACAO = [
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
];

function rotuloStatusOperacao(status) {
  return STATUS_OPERACAO.find((item) => item.value === status)?.label || status || "Não informado";
}

function dataLocalParaIsoComOffset(data, fimDoDia = false) {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-").map(Number);
  const valor = new Date(ano, mes - 1, dia, fimDoDia ? 23 : 0, fimDoDia ? 59 : 0, fimDoDia ? 59 : 0);
  const pad = (n) => String(n).padStart(2, "0");
  const offset = -valor.getTimezoneOffset();
  const sinal = offset >= 0 ? "+" : "-";
  const horas = pad(Math.floor(Math.abs(offset) / 60));
  const minutos = pad(Math.abs(offset) % 60);
  return `${valor.getFullYear()}-${pad(valor.getMonth() + 1)}-${pad(valor.getDate())}T${pad(valor.getHours())}:${pad(valor.getMinutes())}:${pad(valor.getSeconds())}${sinal}${horas}:${minutos}`;
}

function duracaoOperacao(operacao) {
  if (!operacao?.operationStartedAt) return "—";
  const inicio = new Date(operacao.operationStartedAt).getTime();
  const fim = operacao.actualEndAt ? new Date(operacao.actualEndAt).getTime() : Date.now();
  if (!Number.isFinite(inicio) || !Number.isFinite(fim) || fim < inicio) return "—";
  return formatarDuracaoSegundos(Math.floor((fim - inicio) / 1000));
}

function baixarCSV(operacoes) {
  const cabecalho = ["ID da operação", "Máquina", "Data", "Início", "Encerramento real", "Previsão de encerramento", "Duração", "Status"];
  const linhas = operacoes.map((op) => [
    op.id,
    op.machineName,
    op.operationDate,
    op.operationStartedAt,
    op.actualEndAt || "",
    op.scheduledEndAt || "",
    duracaoOperacao(op),
    op.status,
  ]);
  const csv = [cabecalho, ...linhas].map((linha) => linha.map((valor) => `"${String(valor ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "historico-operacoes-indutime.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Historico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maquina, setMaquina] = useState(null);
  const [operacoes, setOperacoes] = useState([]);
  const [operacaoSelecionada, setOperacaoSelecionada] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [status, setStatus] = useState("");
  const [carregandoMaquina, setCarregandoMaquina] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erro, setErro] = useState("");
  const [erroDetalhe, setErroDetalhe] = useState("");
  const [versaoDetalhe, setVersaoDetalhe] = useState(0);

  useEffect(() => {
    let ativo = true;
    async function carregarMaquina() {
      setCarregandoMaquina(true);
      setErro("");
      try {
        const dados = await buscarMaquina(id);
        if (ativo) setMaquina(dados);
      } catch (e) {
        if (ativo) setErro(e.message);
      } finally {
        if (ativo) setCarregandoMaquina(false);
      }
    }
    if (id) carregarMaquina();
    return () => { ativo = false; };
  }, [id]);

  const carregarOperacoes = useCallback(async (filtros = {}) => {
    if (!maquina) return;
    if (maquina.raspberryMachineId == null) {
      setOperacoes([]);
      setOperacaoSelecionada(null);
      setDetalhe(null);
      setVersaoDetalhe((valor) => valor + 1);
      setErro("Esta máquina ainda não possui raspberryMachineId vinculado. O vínculo é realizado pela importação de telemetria CSV.");
      return;
    }

    setCarregando(true);
    setErro("");
    setErroDetalhe("");
    try {
      const parametros = {
        raspberryMachineId: maquina.raspberryMachineId,
        ...(filtros.inicio ? { startDate: dataLocalParaIsoComOffset(filtros.inicio) } : {}),
        ...(filtros.fim ? { endDate: dataLocalParaIsoComOffset(filtros.fim, true) } : {}),
        ...(filtros.status ? { status: filtros.status } : {}),
      };
      const resposta = await buscarOperacoes(parametros);
      const lista = Array.isArray(resposta) ? resposta : [];
      setOperacoes(lista);
      setOperacaoSelecionada(lista.length ? lista[0].id : null);
      setDetalhe(null);
      setVersaoDetalhe((valor) => valor + 1);
    } catch (e) {
      setOperacoes([]);
      setOperacaoSelecionada(null);
      setDetalhe(null);
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [maquina]);

  useEffect(() => {
    if (maquina) carregarOperacoes({});
  }, [maquina, carregarOperacoes]);

  useEffect(() => {
    if (operacaoSelecionada == null) {
      setDetalhe(null);
      return;
    }
    let ativo = true;
    async function carregarDetalhe() {
      setCarregandoDetalhe(true);
      setErroDetalhe("");
      try {
        const dados = await buscarDetalheOperacao(operacaoSelecionada);
        if (ativo) setDetalhe(dados);
      } catch (e) {
        if (ativo) {
          setDetalhe(null);
          setErroDetalhe(e.message);
        }
      } finally {
        if (ativo) setCarregandoDetalhe(false);
      }
    }
    carregarDetalhe();
    return () => { ativo = false; };
  }, [operacaoSelecionada, versaoDetalhe]);

  const leituras = useMemo(() => detalhe?.temperatureReadings || [], [detalhe]);
  const totalConcluidas = operacoes.filter((op) => op.status === "CONCLUIDA").length;
  const totalAndamento = operacoes.filter((op) => op.status === "EM_ANDAMENTO").length;
  const duracaoTotalSegundos = operacoes.reduce((total, op) => {
    if (!op.operationStartedAt || !op.actualEndAt) return total;
    const segundos = (new Date(op.actualEndAt).getTime() - new Date(op.operationStartedAt).getTime()) / 1000;
    return Number.isFinite(segundos) && segundos > 0 ? total + segundos : total;
  }, 0);

  function aplicarFiltros(evento) {
    evento.preventDefault();
    if (inicio && fim && fim < inicio) {
      setErro("A data final não pode ser anterior à data inicial.");
      return;
    }
    carregarOperacoes({ inicio, fim, status });
  }

  function limparFiltros() {
    setInicio(""); setFim(""); setStatus("");
    carregarOperacoes({});
  }

  if (carregandoMaquina) {
    return <div className="histContainer"><Sidebar maquinaId={id} /><main className="histConteudo"><p>Carregando dados da máquina...</p></main></div>;
  }

  if (!maquina && erro) {
    return <div className="histContainer"><Sidebar maquinaId={id} /><main className="histConteudo"><h1>Histórico de operações</h1><p className="histErro" role="alert">{erro}</p><button type="button" onClick={() => navigate("/ListaMaquinas")}>Voltar para máquinas</button></main></div>;
  }

  return (
    <div className="histContainer">
      <Sidebar maquinaId={id} />
      <main className="histConteudo">
        <header className="histCabecalho">
          <div>
            <span className="histEyebrow">MONITORAMENTO CNC</span>
            <h1>Histórico de operações</h1>
            <p>Consulte as operações registradas e as leituras de temperatura da máquina.</p>
          </div>
          <div className="histMaquinaTag"><span>Máquina selecionada</span><strong>{maquina?.displayName || "Máquina"}</strong><small>ID interno: {maquina?.id} · Raspberry: {maquina?.raspberryMachineId ?? "Não vinculado"}</small></div>
        </header>

        <section className="histIndicadores" aria-label="Resumo do histórico">
          <article><span>Operações encontradas</span><strong>{operacoes.length}</strong><small>Resultado dos filtros atuais</small></article>
          <article><span>Concluídas</span><strong>{totalConcluidas}</strong><small>Operações finalizadas</small></article>
          <article><span>Em andamento</span><strong>{totalAndamento}</strong><small>Operações ainda abertas</small></article>
          <article><span>Duração das concluídas</span><strong>{formatarDuracaoSegundos(duracaoTotalSegundos)}</strong><small>Soma das operações com início e fim real</small></article>
        </section>

        <section className="histPainel histPainelFiltros">
          <div className="histSecaoTitulo"><div><h2>Filtrar operações</h2><p>Os períodos são aplicados à data de início da operação.</p></div></div>
          <form className="histFiltrosForm" onSubmit={aplicarFiltros}>
            <label>Data inicial<input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} /></label>
            <label>Data final<input type="date" value={fim} onChange={(e) => setFim(e.target.value)} /></label>
            <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos os status</option>{STATUS_OPERACAO.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <div className="histAcoesFiltro"><button type="submit" disabled={carregando}> {carregando ? "Buscando..." : "Aplicar filtros"}</button><button type="button" className="histBotaoSecundario" onClick={limparFiltros} disabled={carregando}>Limpar</button></div>
          </form>
        </section>

        {erro && <p className="histErro" role="alert">{erro}</p>}

        <section className="histPainel histPainelTabela">
          <div className="histSecaoTitulo histTituloTabela"><div><h2>Operações registradas</h2><p>Mais recentes primeiro, conforme a ordenação da API.</p></div><button type="button" className="histBotaoExportar" onClick={() => baixarCSV(operacoes)} disabled={!operacoes.length}>Exportar CSV</button></div>
          {carregando ? <div className="histEstadoVazio">Carregando operações...</div> : operacoes.length === 0 ? <div className="histEstadoVazio"><strong>Nenhuma operação encontrada</strong><p>Não há registros para esta máquina e os filtros selecionados.</p></div> : (
            <div className="histTabelaScroll">
              <table className="histTabela">
                <thead><tr><th>ID</th><th>Data</th><th>Início</th><th>Encerramento real</th><th>Previsão</th><th>Duração</th><th>Status</th><th>Detalhes</th></tr></thead>
                <tbody>{operacoes.map((op) => <tr key={op.id} className={String(operacaoSelecionada) === String(op.id) ? "linhaSelecionada" : ""}>
                  <td>#{op.id}</td><td>{op.operationDate || "—"}</td><td>{formatarDataHora(op.operationStartedAt)}</td><td>{op.actualEndAt ? formatarDataHora(op.actualEndAt) : "—"}</td><td>{op.scheduledEndAt ? formatarDataHora(op.scheduledEndAt) : "—"}</td><td>{duracaoOperacao(op)}</td><td><span className={`histStatusPill ${op.status === "CONCLUIDA" ? "concluida" : "andamento"}`}>{rotuloStatusOperacao(op.status)}</span></td><td><button type="button" className="histLinkDetalhe" onClick={() => setOperacaoSelecionada(op.id)}>Visualizar</button></td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
          <div className="histRodapeTabela"><span>{operacoes.length} registro(s) retornado(s) pela API</span><span>Listagem sem paginação · ordenação decrescente</span></div>
        </section>

        <section className="histPainel histPainelDetalhe">
          <div className="histSecaoTitulo"><div><h2>Detalhes da operação</h2><p>Dados completos e temperaturas da operação selecionada.</p></div>{detalhe && <span className={`histStatusPill ${detalhe.status === "CONCLUIDA" ? "concluida" : "andamento"}`}>{rotuloStatusOperacao(detalhe.status)}</span>}</div>
          {carregandoDetalhe ? <div className="histEstadoVazio">Carregando detalhes da operação...</div> : erroDetalhe ? <p className="histErro" role="alert">{erroDetalhe}</p> : !detalhe ? <div className="histEstadoVazio"><strong>Selecione uma operação</strong><p>Os detalhes e as leituras de temperatura aparecerão aqui.</p></div> : (
            <>
              <div className="histDetalheResumo">
                <div><span>Operação</span><strong>#{detalhe.id}</strong></div>
                <div><span>Início</span><strong>{formatarDataHora(detalhe.operationStartedAt)}</strong></div>
                <div><span>Fim real</span><strong>{detalhe.actualEndAt ? formatarDataHora(detalhe.actualEndAt) : "Ainda em andamento"}</strong></div>
                <div><span>Fim previsto</span><strong>{detalhe.scheduledEndAt ? formatarDataHora(detalhe.scheduledEndAt) : "Não informado"}</strong></div>
                <div><span>Duração</span><strong>{duracaoOperacao(detalhe)}</strong></div>
                <div><span>Leituras</span><strong>{leituras.length}</strong></div>
              </div>
              <div className="histLeiturasCabecalho"><h3>Leituras de temperatura</h3><span>Ordem cronológica crescente</span></div>
              {leituras.length ? <div className="histTabelaScroll"><table className="histTabela histTabelaLeituras"><thead><tr><th>Leitura</th><th>Data e hora</th><th>Temperatura</th><th>Estado na leitura</th><th>Event ID</th></tr></thead><tbody>{leituras.map((leitura) => <tr key={leitura.id}><td>#{leitura.id}</td><td>{formatarDataHora(leitura.measuredAt)}</td><td><strong>{Number(leitura.temperature).toFixed(2)} °C</strong></td><td><span className={`histStatusPill ${leitura.running ? "andamento" : "concluida"}`}>{leitura.running ? "Em operação" : "Encerramento"}</span></td><td className="histEventId">{leitura.eventId}</td></tr>)}</tbody></table></div> : <div className="histEstadoVazio histSemLeituras">A API não retornou leituras de temperatura para esta operação.</div>}
            </>
          )}
        </section>

        <p className="histNotaTecnica">Fonte dos dados: <code>GET /v1/operations</code> e <code>GET /v1/operations/{"{operationId}"}</code>. O filtro da listagem utiliza o ID externo da Raspberry; o detalhe utiliza o ID interno da operação.</p>
      </main>
    </div>
  );
}
