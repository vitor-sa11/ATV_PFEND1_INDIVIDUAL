"use client";

import { useEffect, useState } from "react";
import Icone from "./Icone.jsx";

const opcoes = {
  setor: ["Produção", "Impressão", "Acabamento", "Qualidade", "Utilidades"],
  tipo: ["Corretiva", "Preventiva", "Preditiva", "Inspeção"],
  turno: ["Manhã", "Tarde", "Noite"],
  prioridade: ["Baixa", "Média", "Alta", "Urgente"],
  situacao: ["Aberto", "Em andamento", "Aguardando peça", "Concluído"],
};

const camposTexto = [
  { campo: "equipamento", rotulo: "Equipamento", exemplo: "Ex.: Bomba centrífuga · BC-07", obrigatorio: true },
  { campo: "responsavel", rotulo: "Responsável técnico", exemplo: "Nome de quem conduz o chamado", obrigatorio: true },
];

function obterValoresIniciais(chamado) {
  return {
    equipamento: chamado?.equipamento || "",
    setor: chamado?.setor || "",
    tipo: chamado?.tipo || "Corretiva",
    turno: chamado?.turno || "",
    prioridade: chamado?.prioridade || "Média",
    situacao: chamado?.situacao || "Aberto",
    responsavel: chamado?.responsavel || "",
    prazo: chamado?.prazo || "",
    ocorrencia: chamado?.ocorrencia || "",
    solucao: chamado?.solucao || "",
  };
}

export default function ModalChamado({ chamado, aoSalvar, aoFechar, salvando = false }) {
  const [dados, definirDados] = useState(() => obterValoresIniciais(chamado));
  const [erros, definirErros] = useState({});
  const estaEditando = Boolean(chamado);

  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === "Escape" && !salvando) aoFechar();
    }

    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aoFechar, salvando]);

  function atualizar(campo, valor) {
    definirDados((atuais) => ({ ...atuais, [campo]: valor }));
    definirErros((atuais) => ({ ...atuais, [campo]: "" }));
  }

  function submeter(evento) {
    evento.preventDefault();
    const camposInvalidos = {};

    for (const campo of ["equipamento", "setor", "tipo", "turno", "prioridade", "responsavel", "prazo", "ocorrencia"]) {
      if (!String(dados[campo] || "").trim()) {
        camposInvalidos[campo] = "Este campo é obrigatório.";
      }
    }

    if (dados.ocorrencia.trim().length > 1200) {
      camposInvalidos.ocorrencia = "Use até 1.200 caracteres.";
    }

    if (Object.keys(camposInvalidos).length > 0) {
      definirErros(camposInvalidos);
      return;
    }

    aoSalvar({
      ...dados,
      equipamento: dados.equipamento.trim(),
      responsavel: dados.responsavel.trim(),
      ocorrencia: dados.ocorrencia.trim(),
    });
  }

  function fecharFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) aoFechar();
  }

  return (
    <div className="fundo-modal" onMouseDown={fecharFundo} role="presentation">
      <section className="painel-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-chamado">
        <header className="cabecalho-modal">
          <div className="envoltorio-titulo-modal">
            <span className="icone-modal"><Icone nome={estaEditando ? "editar" : "mais"} tamanho={20} /></span>
            <div>
              <p className="rotulo-superior">ORDEM DE MANUTENÇÃO</p>
              <h2 id="titulo-modal-chamado">{estaEditando ? `Editar CH-${chamado.id}` : "Novo chamado"}</h2>
              <p className="subtitulo-modal">Dados claros ajudam a equipe a agir com segurança.</p>
            </div>
          </div>
          <button className="botao-icone botao-fechar-modal" type="button" aria-label="Fechar formulário" onClick={aoFechar} disabled={salvando}>
            <Icone nome="fechar" tamanho={18} />
          </button>
        </header>

        <form onSubmit={submeter} noValidate>
          <div className="corpo-formulario">
            <div className="titulo-secao-formulario">
              <span className="indice-secao">01</span>
              <div><h3>Identificação</h3><p>Onde e quando a intervenção acontece.</p></div>
            </div>
            <div className="grade-formulario">
              {camposTexto.map((definicao) => (
                <label className="campo-formulario ocupa-duas-colunas" key={definicao.campo}>
                  <span>{definicao.rotulo}<b aria-hidden="true"> *</b></span>
                  <input
                    autoComplete={definicao.campo === "responsavel" ? "name" : "off"}
                    maxLength={100}
                    placeholder={definicao.exemplo}
                    value={dados[definicao.campo]}
                    onChange={(evento) => atualizar(definicao.campo, evento.target.value)}
                    aria-invalid={Boolean(erros[definicao.campo])}
                    aria-describedby={erros[definicao.campo] ? `${definicao.campo}-erro` : undefined}
                  />
                  {erros[definicao.campo] && <small className="erro-campo" id={`${definicao.campo}-erro`}>{erros[definicao.campo]}</small>}
                </label>
              ))}

              {[
                ["setor", "Setor", "Selecione o setor"],
                ["tipo", "Tipo de manutenção", "Selecione o tipo"],
                ["turno", "Turno", "Selecione o turno"],
                ["prioridade", "Prioridade", "Selecione a prioridade"],
                ["situacao", "Situação", "Selecione a situação"],
              ].map(([nomeCampo, rotulo, textoAjuda]) => (
                <label className="campo-formulario" key={nomeCampo}>
                  <span>{rotulo}{nomeCampo !== "situacao" && <b aria-hidden="true"> *</b>}</span>
                  <select
                    value={dados[nomeCampo]}
                    onChange={(evento) => atualizar(nomeCampo, evento.target.value)}
                    aria-invalid={Boolean(erros[nomeCampo])}
                  >
                    {nomeCampo !== "situacao" && <option value="">{textoAjuda}</option>}
                    {opcoes[nomeCampo].map((opcao) => <option value={opcao} key={opcao}>{opcao}</option>)}
                  </select>
                  {erros[nomeCampo] && <small className="erro-campo">{erros[nomeCampo]}</small>}
                </label>
              ))}

              <label className="campo-formulario">
                <span>Prazo da intervenção <b aria-hidden="true"> *</b></span>
                <input type="date" value={dados.prazo} onChange={(evento) => atualizar("prazo", evento.target.value)} aria-invalid={Boolean(erros.prazo)} />
                {erros.prazo && <small className="erro-campo">{erros.prazo}</small>}
              </label>
            </div>

            <div className="titulo-secao-formulario segunda-secao-formulario">
              <span className="indice-secao">02</span>
              <div><h3>Ocorrência e solução</h3><p>Registre o contexto para a próxima ação.</p></div>
            </div>
            <div className="grade-formulario">
              <label className="campo-formulario ocupa-duas-colunas">
                <span>Descrição da ocorrência <b aria-hidden="true"> *</b></span>
                <textarea rows="3" maxLength={1200} placeholder="Descreva o sintoma, o risco ou a atividade solicitada…" value={dados.ocorrencia} onChange={(evento) => atualizar("ocorrencia", evento.target.value)} aria-invalid={Boolean(erros.ocorrencia)} />
                <div className="nota-campo"><small>{erros.ocorrencia ? <span className="erro-campo">{erros.ocorrencia}</span> : "Inclua sintomas e condições observadas."}</small><small>{dados.ocorrencia.length}/1200</small></div>
              </label>
              <label className="campo-formulario ocupa-duas-colunas">
                <span>Solução aplicada <small className="rotulo-opcional">OPCIONAL</small></span>
                <textarea rows="2" maxLength={1200} placeholder="Preencha quando o serviço for concluído…" value={dados.solucao} onChange={(evento) => atualizar("solucao", evento.target.value)} />
              </label>
            </div>
          </div>

          <footer className="rodape-modal">
            <span className="aviso-obrigatorios"><b>*</b> Campos obrigatórios</span>
            <div className="acoes-modal">
              <button className="botao botao-discreto" type="button" onClick={aoFechar} disabled={salvando}>Cancelar</button>
              <button className="botao botao-principal" type="submit" disabled={salvando}>
                {salvando ? <><span className="indicador-carregamento-botao" /> Salvando…</> : <><Icone nome="sucesso" tamanho={17} /> {estaEditando ? "Salvar alterações" : "Registrar chamado"}</>}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
