
import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Configuracao.css";
import { dados } from "../data/Dados";

export default function Configuracao() {
  const [maquinas, setMaquinas] = useState(() => [
    {
      ...dados,
      dadosBarras: [...dados.dadosBarras],
      listaInicio: [...dados.listaInicio],
      listaTermino: [...dados.listaTermino],
      duracao: [...dados.duracao],
    },
  ]);

  const [maquinaSelecionada, setMaquinaSelecionada] = useState(dados.id);
  const [mensagem, setMensagem] = useState("");

  const configuracao = maquinas.find(
    (maquina) => maquina.id === maquinaSelecionada
  );

  // Perfil obtido dos dados da aplicação.
  const isAdmin = configuracao?.usuarioTipo === "Administrador";

  // Operadores só podem editar o próprio nome.
  function podeEditar(campo) {
    if (campo === "usuarioNome") return true;

    if (isAdmin && campo !== "usuarioTipo") return true;

    return false;
  }

  function atualizarCampo(e) {
    const { name, value } = e.target;

    if (!podeEditar(name) || !configuracao) return;

    setMaquinas((anteriores) =>
      anteriores.map((maquina) =>
        maquina.id === maquinaSelecionada
          ? {
              ...maquina,
              [name]: name === "status" ? Number(value) : value,
            }
          : maquina
      )
    );

    setMensagem("");
  }

  function adicionarMaquina() {
    if (!isAdmin) return;

    const novoId =
      Math.max(0, ...maquinas.map((maquina) => maquina.id)) + 1;

    const novaMaquina = {
      ...dados,
      id: novoId,
      maquina: `Nova máquina ${novoId}`,
      status: 0,
      totalOperacoes: 0,
      tempoEmOperacao: "00h 00min",
      meta: "08h 00min",
      tempoParado: "00h 00min",
      disponibilidade: "0",
      dadosBarras: [],
      listaInicio: [],
      listaTermino: [],
      duracao: [],
    };

    setMaquinas((anteriores) => [...anteriores, novaMaquina]);
    setMaquinaSelecionada(novoId);
    setMensagem("Máquina adicionada. Configure os campos permitidos.");
  }

  function excluirMaquina() {
    if (!isAdmin || !configuracao) return;

    const confirmou = window.confirm(
      `Deseja realmente excluir a máquina "${configuracao.maquina}"?`
    );

    if (!confirmou) return;

    const restantes = maquinas.filter(
      (maquina) => maquina.id !== maquinaSelecionada
    );

    setMaquinas(restantes);
    setMaquinaSelecionada(restantes[0]?.id ?? null);
    setMensagem("Máquina excluída com sucesso.");
  }

  function salvarConfiguracoes(e) {
    e.preventDefault();

    if (!configuracao) return;

    setMensagem(
      isAdmin
        ? "Alterações aplicadas nesta sessão."
        : "Nome atualizado nesta sessão."
    );

    console.log("Máquinas atualizadas:", maquinas);
  }

  function Campo({
    id,
    label,
    name,
    value,
    type = "text",
    placeholder,
    min,
    max,
  }) {
    const permitido = podeEditar(name);

    return (
      <div className={`ConfCampo ${permitido ? "campoEditavel" : "campoBloqueado"}`}>
        <div className="ConfLabelLinha">
          <label htmlFor={id}>{label}</label>

          <span className={permitido ? "ConfPermissaoSim" : "ConfPermissaoNao"}>
            {permitido ? "Editável" : "Não permitido editar"}
          </span>
        </div>

        <input
          id={id}
          name={name}
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={atualizarCampo}
          readOnly={!permitido || type === "number" && !isAdmin}
          disabled={!permitido}
          required={permitido}
        />
      </div>
    );
  }

  return (
    <div className="ConfContainer">
      <aside className="ConfSideBar">
        <Link to="/Dashboard">Dashboard</Link>
        <Link to="/Historico">Histórico</Link>
        <a href="#configuracoes">Configurações</a>

        <a href="#usuario">
          {configuracao?.usuarioNome ?? dados.usuarioNome}
        </a>
        <p>{configuracao?.usuarioTipo ?? dados.usuarioTipo}</p>

        <Link to="/">Sair do sistema</Link>
      </aside>

      <main className="ConfConteudo">
        <header className="ConfCabecalho">
          <h1>Configurações</h1>
          <p>
            Consulte as informações e edite os campos permitidos para seu perfil.
          </p>
        </header>

        {/* MENU DE MÁQUINAS EXCLUSIVO DO ADMINISTRADOR */}
        {isAdmin && (
          <section className="ConfSecaoMaquinas">
            <div className="ConfTituloSecao">
              <div>
                <h2>Gerenciar máquinas</h2>
                <p>
                  {maquinas.length}{" "}
                  {maquinas.length === 1
                    ? "máquina cadastrada"
                    : "máquinas cadastradas"}
                </p>
              </div>

              <button
                type="button"
                className="ConfBotaoAdicionar"
                onClick={adicionarMaquina}
              >
                <span>+</span> Adicionar máquina
              </button>
            </div>

            <div className="ConfListaMaquinas">
              {maquinas.map((maquina) => (
                <div
                  key={maquina.id}
                  className={`ConfItemMaquina ${
                    maquinaSelecionada === maquina.id ? "selecionada" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="ConfSelecionarMaquina"
                    onClick={() => {
                      setMaquinaSelecionada(maquina.id);
                      setMensagem("");
                    }}
                  >
                    <span className="ConfIconeMaquina">⚙</span>

                    <span className="ConfInfoMaquina">
                      <strong>{maquina.maquina}</strong>
                      <small>
                        {maquina.status === 1 ? "Em andamento" : "Parada"}
                      </small>
                    </span>

                    <span className="ConfSetaMaquina">
                      {maquinaSelecionada === maquina.id ? "✓" : "›"}
                    </span>
                  </button>
                </div>
              ))}

              {maquinas.length === 0 && (
                <div className="ConfListaVazia">
                  <p>Nenhuma máquina cadastrada.</p>
                  <span>Adicione uma máquina para começar.</span>
                </div>
              )}
            </div>
          </section>
        )}

        {configuracao ? (
          <form
            id="configuracoes"
            className="ConfFormulario"
            onSubmit={salvarConfiguracoes}
          >
            <div className="ConfTituloFormulario">
              <div>
                <h2>Dados da máquina</h2>
                <p>
                  Perfil atual: <strong>{configuracao.usuarioTipo}</strong>
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  className="ConfBotaoExcluir"
                  onClick={excluirMaquina}
                >
                  Excluir máquina
                </button>
              )}
            </div>

            <div className="ConfLegendaPermissoes">
              <span className="ConfPermissaoSim">Editável</span>
              <span>Você pode alterar este campo.</span>

              <span className="ConfPermissaoNao">Bloqueado</span>
              <span>Você não pode alterar este campo.</span>
            </div>

            <div className="ConfGradeCampos">
              <Campo
                id="maquina"
                label="Nome da máquina"
                name="maquina"
                value={configuracao.maquina}
              />

              <div className={`ConfCampo ${podeEditar("status") ? "campoEditavel" : "campoBloqueado"}`}>
                <div className="ConfLabelLinha">
                  <label htmlFor="status">Status da máquina</label>
                  <span className={podeEditar("status") ? "ConfPermissaoSim" : "ConfPermissaoNao"}>
                    {podeEditar("status") ? "Editável" : "Não permitido editar"}
                  </span>
                </div>

                <select
                  id="status"
                  name="status"
                  value={configuracao.status}
                  onChange={atualizarCampo}
                  disabled={!podeEditar("status")}
                >
                  <option value={1}>Em andamento</option>
                  <option value={0}>Parada</option>
                </select>
              </div>

              <Campo
                id="meta"
                label="Meta de operação"
                name="meta"
                value={configuracao.meta}
                placeholder="08h 00min"
              />

              <Campo
                id="tempoEmOperacao"
                label="Tempo em operação"
                name="tempoEmOperacao"
                value={configuracao.tempoEmOperacao}
              />

              <Campo
                id="tempoParado"
                label="Tempo parado"
                name="tempoParado"
                value={configuracao.tempoParado}
              />

              <Campo
                id="disponibilidade"
                label="Disponibilidade (%)"
                name="disponibilidade"
                type="number"
                min="0"
                max="100"
                value={configuracao.disponibilidade}
              />

              <Campo
                id="totalOperacoes"
                label="Total de operações"
                name="totalOperacoes"
                type="number"
                min="0"
                value={configuracao.totalOperacoes}
              />

              <Campo
                id="dataOperacao"
                label="Data da operação"
                name="dataOperacao"
                value={configuracao.dataOperacao}
              />

              <Campo
                id="usuarioNome"
                label="Nome do responsável"
                name="usuarioNome"
                value={configuracao.usuarioNome}
              />

              <div className="ConfCampo campoBloqueado">
                <div className="ConfLabelLinha">
                  <label htmlFor="usuarioTipo">Tipo de usuário</label>
                  <span className="ConfPermissaoNao">Não permitido editar</span>
                </div>

                <input
                  id="usuarioTipo"
                  value={configuracao.usuarioTipo}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="ConfAcoesFormulario">
              <button type="submit" className="ConfBotaoSalvar">
                {isAdmin ? "Salvar alterações" : "Salvar meu nome"}
              </button>
            </div>

            {mensagem && (
              <p className="ConfMensagem" role="status">
                {mensagem}
              </p>
            )}
          </form>
        ) : (
          <section className="ConfFormulario">
            <h2>Nenhuma máquina disponível</h2>
            <p>
              {isAdmin
                ? "Adicione uma máquina para começar."
                : "Não há máquinas disponíveis para exibir."}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
