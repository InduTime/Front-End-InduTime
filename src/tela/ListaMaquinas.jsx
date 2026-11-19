import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import "../css/ListaMaquinas.css";
import { listarMaquinas, pesquisarMaquinas, rotuloEnum, rotuloStatus, STATUS, LOCALIZACOES } from "../services/api";

export default function ListaMaquinas() {
  const navigate = useNavigate();
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtros, setFiltros] = useState({ status: "", location: "" });

  async function carregar(filtrosAtuais = filtros) {
    setLoading(true); setErro("");
    try {
      const temFiltro = Object.values(filtrosAtuais).some(Boolean);
      const dados = temFiltro ? await pesquisarMaquinas(filtrosAtuais) : await listarMaquinas();
      setMaquinas(Array.isArray(dados) ? dados : []);
    } catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { carregar({ status: "", location: "" }); /* carga inicial */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function alterarFiltro(e) {
    const next = { ...filtros, [e.target.name]: e.target.value };
    setFiltros(next); carregar(next);
  }

  return <div className="listaMaquinas">
    <Sidebar paginaMaquinas />
    <main className="conteudoMaquinas">
      <header className="cabecalhoMaquinas"><h1>Máquinas disponíveis</h1><p>Dados consultados diretamente na API do InduTime.</p></header>
      <section style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "18px 0" }}>
        <label>Status <select name="status" value={filtros.status} onChange={alterarFiltro}><option value="">Todos</option>{STATUS.map(v => <option key={v} value={v}>{rotuloStatus(v)}</option>)}</select></label>
        <label>Setor <select name="location" value={filtros.location} onChange={alterarFiltro}><option value="">Todos</option>{LOCALIZACOES.map(v => <option key={v} value={v}>{rotuloEnum(v)}</option>)}</select></label>
        <button type="button" onClick={() => { const clean = { status: "", location: "" }; setFiltros(clean); carregar(clean); }}>Limpar filtros</button>
        <button type="button" onClick={() => carregar()}>Atualizar</button>
      </section>
      {loading && <p>Carregando máquinas...</p>}
      {erro && <div role="alert" style={{ color: "#b42318", margin: "16px 0" }}><p>{erro}</p><button onClick={() => carregar()}>Tentar novamente</button></div>}
      {!loading && !erro && <section className="gradeMaquinas">
        {maquinas.length ? maquinas.map(m => <article key={m.id} className="cardMaquina" onClick={() => navigate(`/DashBoard/${m.id}`)} tabIndex={0} role="button" onKeyDown={e => { if (e.key === "Enter") navigate(`/DashBoard/${m.id}`); }}>
          <div className="iconeMaquina">⚙</div><div className="informacoesMaquina"><h2>{m.displayName}</h2><p>ID: {m.id} · {m.serialNumber || "Sem número de série"}</p><p>{rotuloEnum(m.model)} · {rotuloEnum(m.manufacturer)}</p><p>{rotuloEnum(m.location)}</p>{typeof m.temperature === "number" && <p>Temperatura: {m.temperature.toFixed(1)} °C</p>}</div>
          <span className="statusMaquina"><span className={m.status === "ONLINE" ? "indicadorOperando" : "indicadorParado"} />{rotuloStatus(m.status)}</span><div className="acessarMaquina">Acessar Dashboard →</div>
        </article>) : <div className="semMaquinas"><h2>Nenhuma máquina encontrada</h2><p>A API não retornou máquinas para os filtros selecionados.</p></div>}
      </section>}
    </main>
  </div>;
}
