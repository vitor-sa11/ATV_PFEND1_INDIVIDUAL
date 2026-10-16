"use client";

import { useEffect } from "react";
import Icone from "./Icone.jsx";
import { SeloPrioridade, SeloSituacao } from "./Marcadores.jsx";

function formatarDataCompleta(valor) {
  if (!valor) return "—";
  return new Date(`${valor}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function FichaChamado({ chamado, aoFechar, aoEditar }) {
  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === "Escape") aoFechar();
    }

    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aoFechar]);

  return (
    <div className="fundo-modal" onMouseDown={(evento) => evento.target === evento.currentTarget && aoFechar()} role="presentation">
      <section className="painel-modal modal-detalhes" role="dialog" aria-modal="true" aria-labelledby="titulo-detalhes">
        <header className="cabecalho-detalhes">
          <div className="rotulo-superior-detalhes"><span className="simbolo-detalhes"><Icone nome="manutencao" tamanho={23} /></span><span>REGISTRO OPERACIONAL</span></div>
          <button className="botao-icone botao-fechar-detalhes" type="button" aria-label="Fechar detalhes" onClick={aoFechar}><Icone nome="fechar" /></button>
          <div className="linha-titulo-detalhes">
            <div><p className="rotulo-superior rotulo-claro">CHAMADO Nº {chamado.id}</p><h2 id="titulo-detalhes">{chamado.equipamento}</h2></div>
            <SeloSituacao situacao={chamado.situacao} />
          </div>
          <p className="subtitulo-detalhes">{chamado.setor} <span>·</span> {chamado.tipo}</p>
        </header>

        <div className="conteudo-detalhes">
          <div className="linha-prioridade-detalhes"><span>Prioridade operacional</span><SeloPrioridade prioridade={chamado.prioridade} /></div>
          <div className="grade-dados-detalhes">
            <div className="dado-detalhes"><span><Icone nome="usuario" tamanho={15} /> RESPONSÁVEL</span><strong>{chamado.responsavel}</strong></div>
            <div className="dado-detalhes"><span><Icone nome="calendario" tamanho={15} /> PRAZO</span><strong>{formatarDataCompleta(chamado.prazo)}</strong></div>
            <div className="dado-detalhes"><span><Icone nome="relogio" tamanho={15} /> TURNO</span><strong>{chamado.turno}</strong></div>
            <div className="dado-detalhes"><span><Icone nome="fabrica" tamanho={15} /> ÁREA</span><strong>{chamado.setor}</strong></div>
          </div>
          <section className="descricao-detalhes"><h3>Ocorrência reportada</h3><p>{chamado.ocorrencia}</p></section>
          <section className="descricao-detalhes descricao-solucao"><h3>Solução aplicada</h3><p>{chamado.solucao || "Aguardando registro da equipe técnica."}</p></section>
        </div>
        <footer className="rodape-modal rodape-detalhes">
          <span className="atualizacao-detalhes">Atualizado {new Date(chamado.atualizadoEm || chamado.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
          <div className="acoes-modal"><button className="botao botao-discreto" type="button" onClick={aoFechar}>Fechar</button><button className="botao botao-principal" type="button" onClick={aoEditar}><Icone nome="editar" tamanho={16} /> Editar chamado</button></div>
        </footer>
      </section>
    </div>
  );
}
