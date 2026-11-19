import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import "../css/Configuracao.css";
import { listarMaquinas, criarMaquina, atualizarMaquina, atualizarStatus, desativarMaquina, importarTelemetriaCSV, MODELOS, FABRICANTES, LOCALIZACOES, STATUS, rotuloEnum, rotuloStatus } from "../services/api";

const vazio = { displayName: "", model: "HAAS_ST_10", manufacturer: "HAAS", serialNumber: "", location: "SETOR_USINAGEM" };
export default function Configuracao() {
  const { id } = useParams(); const navigate = useNavigate();
  const [maquinas, setMaquinas] = useState([]); const [form, setForm] = useState(vazio);
  const [selecionada, setSelecionada] = useState(null); const [novo, setNovo] = useState(false);
  const [loading, setLoading] = useState(true); const [salvando, setSalvando] = useState(false); const [mensagem, setMensagem] = useState(""); const [erro, setErro] = useState("");
  async function carregar() {
    setLoading(true); setErro("");
    try { const dados = await listarMaquinas(); const lista = Array.isArray(dados) ? dados : []; setMaquinas(lista);
      const atual = lista.find(m => String(m.id) === String(id)) || (!id ? lista[0] : null);
      setSelecionada(atual || null);
      if (atual) setForm({ displayName: atual.displayName || "", model: atual.model || MODELOS[0], manufacturer: atual.manufacturer || FABRICANTES[0], serialNumber: atual.serialNumber || "", location: atual.location || LOCALIZACOES[0] });
      else if (!id) setForm(vazio);
    } catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { carregar(); /* carrega ao entrar ou trocar ID */ }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  function selecionar(m) { setNovo(false); setSelecionada(m); setForm({ displayName: m.displayName || "", model: m.model, manufacturer: m.manufacturer, serialNumber: m.serialNumber || "", location: m.location }); navigate(`/Configuracao/${m.id}`); setMensagem(""); }
  function iniciarCadastro() { setNovo(true); setSelecionada(null); setForm(vazio); navigate("/Configuracao"); setMensagem(""); }
  function campo(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }
  async function salvar(e) {
    e.preventDefault(); setSalvando(true); setErro(""); setMensagem("");
    const payload = { displayName: form.displayName.trim(), model: form.model, manufacturer: form.manufacturer, serialNumber: form.serialNumber.trim(), location: form.location };
    try {
      if (novo) await criarMaquina(payload);
      else if (selecionada) await atualizarMaquina(selecionada.id, payload);
      setMensagem(novo ? "Máquina cadastrada com sucesso." : "Dados da máquina atualizados."); setNovo(false); await carregar();
    } catch (e) { setErro(e.message); }
    finally { setSalvando(false); }
  }
  async function mudarStatus(e) {
    const status = e.target.value; if (!selecionada) return;
    try { await atualizarStatus(selecionada.id, status); setMensagem("Status atualizado."); await carregar(); }
    catch (e) { setErro(e.message); }
  }
  async function desativar() {
    if (!selecionada || !window.confirm(`Desativar ${selecionada.displayName}?`)) return;
    try { await desativarMaquina(selecionada.id); setMensagem("Máquina desativada."); navigate("/Configuracao"); await carregar(); }
    catch (e) { setErro(e.message); }
  }
  async function importarCSV(e) {
    const file = e.target.files?.[0]; if (!file) return;
    try { const total = await importarTelemetriaCSV(file); setMensagem(`Arquivo processado. Registros retornados pela API: ${total ?? "não informado"}.`); await carregar(); }
    catch (err) { setErro(err.message); }
    finally { e.target.value = ""; }
  }
  return <div className="ConfContainer">
    <Sidebar maquinaId={selecionada?.id || id} />
    <main className="ConfConteudo">
      <header className="ConfCabecalho"><h1>Configurações</h1><p>Gerenciamento de máquinas conectado à API.</p></header>
      {erro && <p role="alert" style={{ color: "#b42318" }}>{erro}</p>}{mensagem && <p role="status">{mensagem}</p>}
      <section className="ConfSecaoMaquinas"><div className="ConfTituloSecao"><div><h2>Gerenciar máquinas</h2><p>{maquinas.length} máquina(s) ativa(s) retornada(s) pela API</p></div><button type="button" className="ConfBotaoAdicionar" onClick={iniciarCadastro}>+ Adicionar máquina</button></div>
        {loading ? <p>Carregando...</p> : <div className="ConfListaMaquinas">{maquinas.map(m => <div key={m.id} className={`ConfItemMaquina ${selecionada?.id === m.id ? "selecionada" : ""}`}><button type="button" className="ConfSelecionarMaquina" onClick={() => selecionar(m)}><span className="ConfIconeMaquina">⚙</span><span className="ConfInfoMaquina"><strong>{m.displayName}</strong><small>ID: {m.id} · {rotuloStatus(m.status)}</small></span><span className="ConfSetaMaquina">›</span></button></div>)}{!maquinas.length && <div className="ConfListaVazia"><p>Nenhuma máquina ativa cadastrada.</p></div>}</div>}
      </section>
      {(novo || selecionada) && <form id="configuracoes" className="ConfFormulario" onSubmit={salvar}>
        <div className="ConfTituloFormulario"><div><h2>{novo ? "Cadastrar máquina" : "Dados da máquina"}</h2><p>{novo ? "Preencha os dados exigidos pela API." : `ID: ${selecionada.id}`}</p></div>{selecionada && <button type="button" className="ConfBotaoExcluir" onClick={desativar}>Desativar máquina</button>}</div>
        <div className="ConfGradeCampos">
          <div className="ConfCampo campoEditavel"><label htmlFor="displayName">Nome de identificação</label><input id="displayName" name="displayName" value={form.displayName} onChange={campo} required /></div>
          <div className="ConfCampo campoEditavel"><label htmlFor="serialNumber">Número de série</label><input id="serialNumber" name="serialNumber" value={form.serialNumber} onChange={campo} /></div>
          <div className="ConfCampo campoEditavel"><label htmlFor="model">Modelo</label><select id="model" name="model" value={form.model} onChange={campo}>{MODELOS.map(v => <option key={v} value={v}>{rotuloEnum(v)}</option>)}</select></div>
          <div className="ConfCampo campoEditavel"><label htmlFor="manufacturer">Fabricante</label><select id="manufacturer" name="manufacturer" value={form.manufacturer} onChange={campo}>{FABRICANTES.map(v => <option key={v} value={v}>{rotuloEnum(v)}</option>)}</select></div>
          <div className="ConfCampo campoEditavel"><label htmlFor="location">Localização</label><select id="location" name="location" value={form.location} onChange={campo}>{LOCALIZACOES.map(v => <option key={v} value={v}>{rotuloEnum(v)}</option>)}</select></div>
          {selecionada && <div className="ConfCampo campoEditavel"><label htmlFor="status">Status</label><select id="status" value={selecionada.status} onChange={mudarStatus}>{STATUS.map(v => <option key={v} value={v}>{rotuloStatus(v)}</option>)}</select></div>}
        </div>
        <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : novo ? "Cadastrar máquina" : "Salvar alterações"}</button>
      </form>}
      <section className="ConfFormulario"><h2>Importar telemetria</h2><p>Envie o CSV de leituras de temperatura aceito pelo endpoint documentado no Swagger.</p><input type="file" accept=".csv,text/csv" onChange={importarCSV} /></section>
      <p style={{ marginTop: 20 }}>A API lista somente máquinas ativas. A reativação e a exclusão permanente existem no Swagger, mas não são exibidas aqui porque não há endpoint documentado para listar máquinas desativadas.</p>
    </main>
  </div>;
}
