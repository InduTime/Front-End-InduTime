import { useState } from "react";
import "../css/Historico.css";
import { dados } from "../data/Dados";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  };

  
  function gerarRel() {
    const doc = new jsPDF();

    // Título do relatório
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de operações da máquina", 14, 20);

    // Informações da máquina e do usuário
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Máquina: ${historico.maquina}`, 14, 32);
    doc.text(`Usuário: ${historico.usuarioNome}`, 14, 39);
    doc.text(`Tipo de usuário: ${historico.usuarioTipo}`, 14, 46);
    doc.text(`Data da operação: ${historico.dataOperacao}`, 14, 53);

    // Monta todas as operações, sem considerar a paginação da tela
    const operacoes = historico.listaInicio.map((inicio, indice) => {
      return [
        historico.dataOperacao ?? "—",
        inicio ?? "—",
        historico.listaTermino[indice] ?? "—",
        historico.duracao[indice] ?? "—",
        historico.status === 1 ? "Em andamento" : "Concluída"
      ];
    });

    // Cria a tabela no PDF
    autoTable(doc, {
      startY: 62,
      head: [["Data", "Início", "Término", "Duração", "Status"]],
      body: operacoes,
      theme: "grid",
      headStyles: {
        fillColor: [41, 65, 100],
        textColor: 255,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: {
        left: 14,
        right: 14
      }
    });

    // Resumo após a tabela
    const posicaoFinal = doc.lastAutoTable.finalY + 12;

    // Se não houver espaço suficiente, inicia uma nova página
    let posicaoResumo = posicaoFinal;

    if (posicaoResumo > 260) {
      doc.addPage();
      posicaoResumo = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo da máquina", 14, posicaoResumo);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      `Total de operações: ${historico.totalOperacoes}`,
      14,
      posicaoResumo + 9
    );

    doc.text(
      `Tempo total de operação: ${historico.tempoEmOperacao}`,
      14,
      posicaoResumo + 17
    );

    doc.text(
      `Disponibilidade média: ${historico.disponibilidade}%`,
      14,
      posicaoResumo + 25
    );

    // Gera o download do arquivo
    doc.save(`relatorio-${historico.maquina}.pdf`);
  }


  return (
    <div className="histContainer">
      <div className="histSideBar">
        <Link to="/Dashboard">Dashboard</Link>
        <a>Histórico</a>
        <a>Configurações</a>

        <a>{historico.usuarioNome}</a>
        <p>{historico.usuarioTipo}</p>

        <Link to="/">Sair do sistema</Link>
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

      <button className="btnRelatorio" onClick={(e)=> gerarRel(e)}>
          Gerar relatório da máquina em formato PDF
      </button>
      
    </div>
  );
}