import { useState } from "react";
import "../css/Historico.css";
import { dados } from "../data/Dados";
import { Link } from "react-router-dom";

export default function Historico() {
  const [historico] = useState(dados);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 10;

  // O array de início define quantas operações serão exibidas.
  const totalOperacoes = historico.listaInicio.length;

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalOperacoes / itensPorPagina)
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = Math.min(
    indiceInicial + itensPorPagina,
    totalOperacoes
  );

  // Monta as linhas usando os arrays já existentes.
  const operacoesVisiveis = historico.listaInicio
    .slice(indiceInicial, indiceFinal)
    .map((inicio, index) => {
      const indice = indiceInicial + index;

      return {
        id: indice,
        data: historico.dataOperacao,
        inicio,
        termino: historico.listaTermino[indice] || "—",
        duracao: historico.duracao[indice] || "—",
        status: historico.status
      };
    });

  function irParaPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  }

  return (
    <div className="histContainer">
      <div className="histSideBar">
        <Link to="/Dashboard">Dashboard</Link>
        <a>Histórico</a>
        <a>Relatórios</a>
        <a>Configurações</a>

        <a>{historico.usuarioNome}</a>
        <p>{historico.usuarioTipo}</p>

        <Link to="/login">Sair do sistema</Link>
      </div>

      <div className="histCabecalho">
            <h1>Histórico de operações</h1>
            <p>
                Registro completo de todos os ciclos de atividade da máquina
            </p>
            
            <a className="nome_da_maquina">
                {historico.maquina}
            </a>
            <input type="date" />
        </div>

      <div className="histCards">
        <div className="cardListaHist">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Início</th>
                <th>Término</th>
                <th>Duração</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {operacoesVisiveis.map((operacao) => (
                <tr key={operacao.id}>
                  <td>{operacao.data}</td>
                  <td>{operacao.inicio}</td>
                  <td>{operacao.termino}</td>
                  <td>{operacao.duracao}</td>
                  <td>
                    <span
                      className={
                        operacao.status === 1
                          ? "statusAndamento"
                          : "statusConcluida"
                      }
                    >
                      {operacao.status === 1
                        ? "Em andamento"
                        : "Concluída"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cardPassarPaginas">
          <span>
            Mostrando {totalOperacoes === 0 ? 0 : indiceInicial + 1}
            –{indiceFinal} de {totalOperacoes} operações
          </span>

          <button
            disabled={paginaAtual === 1}
            onClick={() => irParaPagina(paginaAtual - 1)}
          >
            Anterior
          </button>

          {Array.from(
            { length: totalPaginas },
            (_, index) => index + 1
          ).map((pagina) => (
            <button
              key={pagina}
              className={
                paginaAtual === pagina ? "paginaAtiva" : ""
              }
              onClick={() => irParaPagina(pagina)}
            >
              {pagina}
            </button>
          ))}

          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => irParaPagina(paginaAtual + 1)}
          >
            Próxima →
          </button>
        </div>

        <div className="cardResumoHist">
          <p>
            Total de operações:{" "}
            <strong>{historico.totalOperacoes}</strong>
          </p>

          <p>
            Tempo total de operação:{" "}
            <strong>{historico.tempoEmOperacao}</strong>
          </p>

          <p>
            Disponibilidade média:{" "}
            <strong>{historico.disponibilidade}%</strong>
          </p>
        </div>
      </div>
    </div>
  );
}