import Sidebar from "../component/Sidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Historico.css";
import { buscarMaquina } from "../services/api";

export default function Historico() {
  const { id } = useParams();
  const [maquina, setMaquina] = useState(null);
  const [erro, setErro] = useState("");
  useEffect(() => {
    if (!id) return;
    let ativo = true;
    buscarMaquina(id).then(data => { if (ativo) setMaquina(data); }).catch(e => { if (ativo) setErro(e.message); });
    return () => { ativo = false; };
  }, [id]);
  return <div className="histContainer">
    <Sidebar maquinaId={id} />
    <main className="histConteudo" id="historico">
      <header className="histCabecalho"><h1>Histórico de operações</h1><p>{maquina ? `Máquina: ${maquina.displayName} · ID: ${maquina.id}` : "Consulta de operações"}</p></header>
      {erro && <p role="alert">{erro}</p>}
      <section className="histCards"><div className="cardListaHist"><h2>Histórico indisponível na API atual</h2><p>O Swagger enviado não documenta endpoints para listar operações, consultar períodos ou recuperar início, término, duração e status das operações.</p><p>Para preencher esta tela com dados reais, o backend precisa disponibilizar uma rota de consulta do histórico, com filtros por máquina e período.</p></div></section>
    </main>
  </div>;
}
