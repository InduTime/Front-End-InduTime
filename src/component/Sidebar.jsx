import { NavLink, Link } from "react-router-dom";
import "../css/Redesign.css";

export default function Sidebar({ maquinaId = null, paginaMaquinas = false }) {
  const destinoMaquinas = "/ListaMaquinas";
  const destinoDashboard = maquinaId ? `/maquinas/${maquinaId}/DashBoard` : destinoMaquinas;
  const destinoHistorico = maquinaId ? `/Historico/${maquinaId}` : destinoMaquinas;
  const destinoConfiguracoes = maquinaId ? `/Configuracao/${maquinaId}` : destinoMaquinas;

  return (
    <aside className={`itSidebar ${paginaMaquinas ? "itSidebar--maquinas" : "itSidebar--interna"}`}>
      <Link className="itSidebarBrand" to={destinoMaquinas}>InduTime</Link>
      <nav className="itSidebarNav" aria-label="Navegação principal">
        {paginaMaquinas ? (
          <NavLink to={destinoMaquinas} className={({ isActive }) => `itSidebarLink ${isActive ? "active" : ""}`}>
            <span aria-hidden="true">▦</span> Máquinas
          </NavLink>
        ) : (
          <>
            {maquinaId ? <NavLink to={destinoDashboard} className={({ isActive }) => `itSidebarLink ${isActive ? "active" : ""}`}><span aria-hidden="true">▥</span> Dashboard</NavLink> : <span className="itSidebarLink isDisabled" title="Selecione uma máquina para acessar o dashboard"><span aria-hidden="true">▥</span> Dashboard</span>}
            {maquinaId ? <NavLink to={destinoHistorico} className={({ isActive }) => `itSidebarLink ${isActive ? "active" : ""}`}><span aria-hidden="true">◷</span> Histórico</NavLink> : <span className="itSidebarLink isDisabled" title="Selecione uma máquina para acessar o histórico"><span aria-hidden="true">◷</span> Histórico</span>}
            <NavLink to={destinoMaquinas} className={({ isActive }) => `itSidebarLink ${isActive ? "active" : ""}`}><span aria-hidden="true">▦</span> Máquinas</NavLink>
            {maquinaId ? <NavLink to={destinoConfiguracoes} className={({ isActive }) => `itSidebarLink ${isActive ? "active" : ""}`}><span aria-hidden="true">⚙</span> Configurações</NavLink> : <span className="itSidebarLink isDisabled" title="Selecione uma máquina para acessar as configurações"><span aria-hidden="true">⚙</span> Configurações</span>}
          </>
        )}
      </nav>
      <div className="itSidebarBottom">
        <div className="itSidebarUser"><span className="itSidebarAvatar">U</span><span><strong>Usuário</strong><small>Conta conectada</small></span></div>
        <Link className="itSidebarLogout" to="/">↪ <span>Sair</span></Link>
      </div>
    </aside>
  );
}
