"use client";

import { useState } from "react";
import Vinculo from "next/link";
import Icone from "./Icone.jsx";
import MarcadorChamado from "./MarcadorChamado.jsx";
import { SeloPrioridade, SeloSituacao } from "./Marcadores.jsx";

const filtrosSituacao = ["Todas", "Aberto", "Em andamento", "Aguardando peça", "Concluído"];

function formatarPrazo(valor) {
  if (!valor) return { texto: "Sem prazo", classe: "" };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const prazo = new Date(`${valor}T12:00:00`);
  const diasRestantes = Math.round(
    (new Date(prazo.getFullYear(), prazo.getMonth(), prazo.getDate()) - hoje) / 86400000,
  );

  if (diasRestantes < 0) return { texto: "Atrasado", classe: "prazo-atrasado" };
  if (diasRestantes === 0) return { texto: "Hoje", classe: "prazo-hoje" };
  if (diasRestantes === 1) return { texto: "Amanhã", classe: "" };

  return {
    texto: prazo.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", ""),
    classe: "",
  };
}

function obterIniciais(nome = "") {
  return nome
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || "")
    .join("");
}

function LinhaChamado({ chamado, aoVer, aoEditar, aoExcluir }) {
  const prazo = formatarPrazo(chamado.prazo);
  const concluido = chamado.situacao === "Concluído";

  return (
    <tr>
      <td>
        <button
          className="botao-nome-chamado"
          type="button"
          onClick={aoVer}
          aria-label={`Ver chamado ${chamado.id}: ${chamado.equipamento}`}
        >
          <MarcadorChamado />
          <span className="texto-nome-chamado">
            <strong>CH-{chamado.id}</strong>
            <span>{chamado.equipamento}</span>
          </span>
        </button>
      </td>
      <td>
        <span className="texto-principal">{chamado.tipo}</span>
        <span className="texto-secundario">{chamado.setor}</span>
      </td>
      <td><SeloPrioridade prioridade={chamado.prioridade} compacto /></td>
      <td><SeloSituacao situacao={chamado.situacao} /></td>
      <td>
        <span className={`prazo-chamado ${concluido ? "prazo-concluido" : prazo.classe}`}>
          <Icone nome="calendario" tamanho={14} />
          {concluido ? "Concluído" : prazo.texto}
        </span>
      </td>
      <td className="celula-responsavel">
        <span className="avatar-responsavel">{obterIniciais(chamado.responsavel)}</span>
        <span>{chamado.responsavel}</span>
      </td>
      <td className="celula-acoes-linha">
        <div className="acoes-linha">
          <button className="botao-acao-linha" type="button" aria-label={`Ver detalhes de CH-${chamado.id}`} title="Ver detalhes" onClick={aoVer}>
            <Icone nome="busca" tamanho={16} />
          </button>
          <button className="botao-acao-linha" type="button" aria-label={`Editar CH-${chamado.id}`} title="Editar" onClick={aoEditar}>
            <Icone nome="editar" tamanho={16} />
          </button>
          <button className="botao-acao-linha acao-excluir" type="button" aria-label={`Excluir CH-${chamado.id}`} title="Excluir" onClick={aoExcluir}>
            <Icone nome="lixeira" tamanho={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EstadoSemChamados({ buscaAtiva, aoLimpar, aoCriar }) {
  return (
    <div className="estado-fila-vazia">
      <span className="simbolo-fila-vazia">
        <Icone nome={buscaAtiva ? "busca" : "chamado"} tamanho={23} />
      </span>
      <h3>{buscaAtiva ? "Nenhum chamado encontrado" : "Sua fila está pronta"}</h3>
      <p>
        {buscaAtiva
          ? "Tente outros termos ou limpe os filtros para ver todos os registros."
          : "Registre a primeira solicitação e mantenha a operação em movimento."}
      </p>
      <button className="botao botao-secundario" type="button" onClick={buscaAtiva ? aoLimpar : aoCriar}>
        {buscaAtiva ? "Limpar filtros" : "Registrar chamado"}
      </button>
    </div>
  );
}

export default function TabelaChamados({
  chamados,
  carregando,
  mostrarTodos,
  aoVer,
  aoEditar,
  aoExcluir,
  aoCriar,
}) {
  const [consulta, definirConsulta] = useState("");
  const [filtroSituacao, definirFiltroSituacao] = useState("Todas");
  const termoBusca = consulta.trim().toLocaleLowerCase("pt-BR");
  const chamadosFiltrados = chamados.filter((chamado) => {
    const situacaoCoincide = filtroSituacao === "Todas" || chamado.situacao === filtroSituacao;
    const textoChamado = [
      chamado.id,
      chamado.equipamento,
      chamado.setor,
      chamado.tipo,
      chamado.responsavel,
      chamado.ocorrencia,
    ].join(" ").toLocaleLowerCase("pt-BR");

    return situacaoCoincide && (!termoBusca || textoChamado.includes(termoBusca));
  });

  function limparFiltros() {
    definirConsulta("");
    definirFiltroSituacao("Todas");
  }

  return (
    <section className="secao-chamados" id="secao-chamados" aria-labelledby="titulo-chamados">
      <div className="cabecalho-secao">
        <div className="linha-titulo-secao">
          <h2 id="titulo-chamados">{mostrarTodos ? "Todos os chamados" : "Chamados recentes"}</h2>
          <span className="contador-secao">{chamadosFiltrados.length}</span>
        </div>
        <Vinculo className="botao-ver-todos" href={mostrarTodos ? "/" : "/chamados"}>
          {mostrarTodos ? "Voltar ao painel" : "Ver todos"}
        </Vinculo>
      </div>

      <div className="barra-ferramentas-chamados">
        <label className="campo-busca">
          <Icone nome="busca" tamanho={18} />
          <input
            id="campo-busca"
            type="search"
            value={consulta}
            onChange={(evento) => definirConsulta(evento.target.value)}
            placeholder="Buscar chamado, equipamento ou responsável…"
            aria-label="Buscar chamados"
          />
          <span className="atalho-busca">⌘ K</span>
        </label>
        <label className="controle-filtro">
          <Icone nome="filtro" tamanho={17} />
          <select
            value={filtroSituacao}
            onChange={(evento) => definirFiltroSituacao(evento.target.value)}
            aria-label="Filtrar por situação"
          >
            {filtrosSituacao.map((situacao) => <option key={situacao}>{situacao}</option>)}
          </select>
          <Icone classe="seta-filtro" nome="chevron" tamanho={14} />
        </label>
      </div>

      <div className="envoltorio-tabela-chamados">
        <table className="tabela-chamados">
          <thead>
            <tr>
              <th scope="col">CHAMADO / EQUIPAMENTO</th>
              <th scope="col">TIPO / SETOR</th>
              <th scope="col">PRIORIDADE</th>
              <th scope="col">SITUAÇÃO</th>
              <th scope="col">PRAZO</th>
              <th scope="col">RESPONSÁVEL</th>
              <th scope="col"><span className="texto-oculto">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {carregando
              ? Array.from({ length: 4 }, (_elemento, indice) => (
                  <tr className="linha-esqueleto" key={indice}>
                    <td colSpan="7"><span /></td>
                  </tr>
                ))
              : chamadosFiltrados.map((chamado) => (
                  <LinhaChamado
                    key={chamado.id}
                    chamado={chamado}
                    aoVer={() => aoVer(chamado)}
                    aoEditar={() => aoEditar(chamado)}
                    aoExcluir={() => aoExcluir(chamado)}
                  />
                ))}
          </tbody>
        </table>
        {!carregando && chamadosFiltrados.length === 0 && (
          <EstadoSemChamados
            buscaAtiva={Boolean(consulta || filtroSituacao !== "Todas")}
            aoLimpar={limparFiltros}
            aoCriar={aoCriar}
          />
        )}
      </div>
    </section>
  );
}
