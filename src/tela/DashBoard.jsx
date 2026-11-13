import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import "../css/DashBoard.css";
import { buscarMaquina, rotuloEnum, rotuloStatus } from "../services/api";

export default function DashBoard() {
  const { id } = useParams(); const navigate = useNavigate();
  const [maquina, setMaquina] = useState(null); const [loading, setLoading] = useState(true); const [erro, setErro] = useState("");
  useEffect(() => {
    let ativo = true;
    setLoading(true); setErro("");
    buscarMaquina(id).then(data => { if (ativo) setMaquina(data); }).catch(e => { if (ativo) setErro(e.message); }).finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, [id]);
  if (loading) return <div className="container"><Sidebar maquinaId={id} /><p>Carregando dados da máquina...</p></div>;
  if (erro || !maquina) return <div className="container"><Sidebar maquinaId={id} /><h2>Não foi possível carregar a máquina</h2><p role="alert">{erro || "Máquina não encontrada."}</p><button onClick={() => navigate("/ListaMaquinas")}>Voltar para máquinas</button></div>;
  const statusColor = maquina.status === "ONLINE" ? "#16a34a" : maquina.status === "OFFLINE" ? "#dc2626" : "#d97706";
  return <div className="container">
    <Sidebar maquinaId={id} />
    <div className="cabecalho"><h1>Painel de monitoramento</h1><p>Informações cadastrais e telemetria disponibilizadas pela API.</p><span className="nome_da_maquina">{maquina.displayName}</span></div>
    <div className="cards">
      <div className="status"><p>Status da máquina</p><p className="operandoStatus" style={{ color: statusColor }}>{rotuloStatus(maquina.status)}</p><p>Estado informado pelo backend</p></div>
      <div className="operacao"><p>Modelo</p><p>{rotuloEnum(maquina.model)}</p><p>Fabricante: {rotuloEnum(maquina.manufacturer)}</p></div>
      <div className="parada"><p>Localização</p><p>{rotuloEnum(maquina.location)}</p><p>Série: {maquina.serialNumber || "Não informada"}</p></div>
      <div className="disponibilidade"><p>Temperatura atual</p><p>{typeof maquina.temperature === "number" ? `${maquina.temperature.toFixed(1)} °C` : "Não disponível"}</p><p>Valor retornado pela API</p></div>
    </div>
    <section className="grafico"><h2>Telemetria</h2><p>O Swagger disponibiliza importação de leituras por CSV, mas não documenta consulta de histórico de temperatura. Nenhum gráfico histórico será inventado.</p></section>
    <section className="cardOperacao"><h2>Dados da máquina</h2><p><strong>ID:</strong> {maquina.id}</p><p><strong>Nome:</strong> {maquina.displayName}</p><p><strong>Modelo:</strong> {maquina.model}</p><p><strong>Fabricante:</strong> {maquina.manufacturer}</p><p><strong>Setor:</strong> {maquina.location}</p><p><strong>Número de série:</strong> {maquina.serialNumber || "—"}</p></section>
    <section className="cardUltimaOperacao"><h2>Operações e produtividade</h2><p>A API documentada não possui endpoints de operações, produção, tempo de funcionamento ou produtividade. Esses indicadores dependem de novas rotas no backend.</p></section>
  </div>;
}
