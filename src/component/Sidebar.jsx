
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../css/Redesign.css";

export default function Sidebar({ maquinaId = null, paginaMaquinas = false }) {
  const navigate = useNavigate();

  const destinoMaquinas = "/ListaMaquinas";
  const destinoDashboard = maquinaId
    ? `/DashBoard/${maquinaId}`
    : destinoMaquinas;
  const destinoHistorico = maquinaId
    ? `/Historico/${maquinaId}`
    : destinoMaquinas;
  const destinoConfiguracoes = maquinaId
    ? `/Configuracao/${maquinaId}`
    : destinoMaquinas;

  // Recupera os dados do usuário conectado
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  } catch (error) {
    usuario = null;
  }

  function sair() {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  }

  return (
    <aside className="itSidebar">
      <Link className="itSidebarBrand" to={destinoMaquinas}>
        InduTime
      </Link>

     
<nav>
  {paginaMaquinas ? (
    <NavLink to="/ListaMaquinas">
      Máquinas
    </NavLink>
  ) : (
    <>
      <NavLink to={destinoDashboard}>
        Dashboard
      </NavLink>

      <NavLink to={destinoHistorico}>
        Histórico
      </NavLink>

      <NavLink to={destinoMaquinas}>
        Máquinas
      </NavLink>

      <NavLink to={destinoConfiguracoes}>
        Configurações
      </NavLink>
    </>
  )}
</nav>


      <div className="itSidebarBottom">
        <div className="itSidebarUser">
          <span className="itSidebarAvatar">
            {usuario?.nome?.charAt(0)?.toUpperCase() || "U"}
          </span>

          <span>
            <strong>
              {usuario?.nome || "Usuário"}
            </strong>

            <small>
              {usuario?.tipoUsuario || "Conta conectada"}
            </small>
          </span>
        </div>

        <button
          className="itSidebarLogout"
          onClick={sair}
        >
          ↪ <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
