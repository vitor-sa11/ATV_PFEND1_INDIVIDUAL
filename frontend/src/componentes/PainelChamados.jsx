"use client";

import { useEffect, useState } from "react";
import Icone from "./Icone.jsx";
import FichaChamado from "./FichaChamado.jsx";
import CartoesResumo from "./CartoesResumo.jsx";
import TabelaChamados from "./TabelaChamados.jsx";
import ModalChamado from "./ModalChamado.jsx";
import { apiChamados } from "../servicos/apiChamados.js";
import { ordenarChamadosRecentes, selecionarChamadosRecentes } from "../servicos/chamadosRecentes.js";

function obterDataAtual() {
  const data = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return data.charAt(0).toUpperCase() + data.slice(1);
}

async function carregarChamados(definirCarregamento, definirChamados, definirErro) {
  definirCarregamento(true);

  try {
    const resposta = await apiChamados.listar();
    definirChamados(resposta.chamados);
    definirErro("");
  } catch (erro) {
    definirErro(erro.message);
  } finally {
    definirCarregamento(false);
  }
}

function AvisoErro({ mensagem, aoRecarregar }) {
  return (
    <div className="aviso-conexao" role="alert">
      <span><Icone nome="alerta" tamanho={18} /></span>
      <div>
        <strong>Não foi possível carregar os chamados</strong>
        <p>{mensagem || "Confira se a API local está em execução e tente novamente."}</p>
      </div>
      <button className="botao botao-discreto" onClick={aoRecarregar} type="button">
        Tentar de novo
      </button>
    </div>
  );
}

export default function PainelChamados({ mostrarTodos = false }) {
  const [chamados, definirChamados] = useState([]);
  const [carregando, definirCarregamento] = useState(true);
  const [erroConexao, definirErroConexao] = useState("");
  const [criando, definirCriacao] = useState(false);
  const [editando, definirEdicao] = useState(null);
  const [selecionado, definirSelecionado] = useState(null);
  const [salvando, definirSalvamento] = useState(false);
  const [mensagemFlutuante, definirMensagemFlutuante] = useState(null);
  const [dataAtual] = useState(obterDataAtual);

  useEffect(() => {
    carregarChamados(definirCarregamento, definirChamados, definirErroConexao);
  }, []);

  useEffect(() => {
    if (!mensagemFlutuante) return undefined;
    const temporizador = window.setTimeout(() => definirMensagemFlutuante(null), 3600);
    return () => window.clearTimeout(temporizador);
  }, [mensagemFlutuante]);

  useEffect(() => {
    function tratarAtalho(evento) {
      const elemento = evento.target;
      const estaDigitando = elemento instanceof HTMLElement
        && (elemento.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(elemento.tagName));

      if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === "k") {
        evento.preventDefault();
        document.getElementById("campo-busca")?.focus();
      } else if (!estaDigitando && evento.key === "Escape" && (criando || editando || selecionado)) {
        definirCriacao(false);
        definirEdicao(null);
        definirSelecionado(null);
      }
    }

    window.addEventListener("keydown", tratarAtalho);
    return () => window.removeEventListener("keydown", tratarAtalho);
  }, [criando, editando, selecionado]);

  useEffect(() => {
    document.body.classList.toggle("modal-aberto", Boolean(criando || editando || selecionado));
    return () => document.body.classList.remove("modal-aberto");
  }, [criando, editando, selecionado]);

  function mostrarMensagem(tipo, texto) {
    definirMensagemFlutuante({ tipo, texto });
  }

  async function salvarChamado(dados) {
    definirSalvamento(true);

    try {
      if (editando) {
        await apiChamados.atualizar(editando.id, dados);
        mostrarMensagem("sucesso", `CH-${editando.id} atualizado com sucesso.`);
      } else {
        const resposta = await apiChamados.criar(dados);
        mostrarMensagem("sucesso", `CH-${resposta.chamado.id} registrado com sucesso.`);
      }

      definirCriacao(false);
      definirEdicao(null);
      definirSelecionado(null);
      await carregarChamados(definirCarregamento, definirChamados, definirErroConexao);
    } catch (erro) {
      mostrarMensagem("erro", erro.message);
    } finally {
      definirSalvamento(false);
    }
  }

  async function excluirChamado(chamado) {
    const confirmado = window.confirm(
      `Excluir CH-${chamado.id} — ${chamado.equipamento}? Esta ação não pode ser desfeita.`,
    );
    if (!confirmado) return;

    try {
      await apiChamados.excluir(chamado.id);
      definirSelecionado(null);
      mostrarMensagem("sucesso", `CH-${chamado.id} excluído com sucesso.`);
      await carregarChamados(definirCarregamento, definirChamados, definirErroConexao);
    } catch (erro) {
      mostrarMensagem("erro", erro.message);
    }
  }

  function abrirEdicao(chamado) {
    definirSelecionado(null);
    definirEdicao(chamado);
  }

  const chamadosDaTabela = mostrarTodos
    ? ordenarChamadosRecentes(chamados)
    : selecionarChamadosRecentes(chamados);

  return (
    <div className="estrutura-aplicativo" id="inicio">
      <main className="area-principal">
        <header className="barra-superior">
          <a className="assinatura-marca marca-cabecalho" href="/" aria-label="UptimeSys — início">
            <span className="simbolo-marca"><span /><i /><b /></span>
            <span className="nome-marca">uptime<span>sys</span></span>
          </a>
          <div className="lado-direito-cabecalho">
            <span className="data-cabecalho"><Icone nome="calendario" tamanho={15} />{dataAtual}</span>
          </div>
        </header>

        <div className="conteudo-central">
          <section className="linha-boas-vindas" aria-labelledby="titulo-pagina">
            <h1 id="titulo-pagina">{mostrarTodos ? "Todos os chamados" : "Bem-vindo ao sistema"}<span>.</span></h1>
            <button className="botao botao-principal botao-novo-chamado" type="button" onClick={() => definirCriacao(true)}>
              <Icone nome="mais" tamanho={18} /> Novo chamado
            </button>
          </section>

          {erroConexao && (
            <AvisoErro
              mensagem={erroConexao}
              aoRecarregar={() => carregarChamados(definirCarregamento, definirChamados, definirErroConexao)}
            />
          )}

          {!mostrarTodos && <CartoesResumo chamados={chamados} />}

          <TabelaChamados
            chamados={chamadosDaTabela}
            carregando={carregando}
            mostrarTodos={mostrarTodos}
            aoVer={definirSelecionado}
            aoEditar={abrirEdicao}
            aoExcluir={excluirChamado}
            aoCriar={() => definirCriacao(true)}
          />
        </div>
      </main>

      {criando && (
        <ModalChamado
          aoSalvar={salvarChamado}
          aoFechar={() => definirCriacao(false)}
          salvando={salvando}
        />
      )}
      {editando && (
        <ModalChamado
          key={`editar-${editando.id}`}
          chamado={editando}
          aoSalvar={salvarChamado}
          aoFechar={() => definirEdicao(null)}
          salvando={salvando}
        />
      )}
      {selecionado && (
        <FichaChamado
          chamado={selecionado}
          aoFechar={() => definirSelecionado(null)}
          aoEditar={() => abrirEdicao(selecionado)}
        />
      )}
      {mensagemFlutuante && (
        <div className={`notificacao-flutuante notificacao-${mensagemFlutuante.tipo}`} role={mensagemFlutuante.tipo === "erro" ? "alert" : "status"}>
          <span className="icone-notificacao"><Icone nome={mensagemFlutuante.tipo === "sucesso" ? "sucesso" : "alerta"} tamanho={18} /></span>
          <span>{mensagemFlutuante.texto}</span>
          <button type="button" aria-label="Fechar mensagem" onClick={() => definirMensagemFlutuante(null)}>
            <Icone nome="fechar" tamanho={16} />
          </button>
        </div>
      )}
    </div>
  );
}
