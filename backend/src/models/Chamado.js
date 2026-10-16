export const OPCOES_CHAMADO = {
  setores: ["Produção", "Impressão", "Acabamento", "Qualidade", "Utilidades"],
  tipos: ["Corretiva", "Preventiva", "Preditiva", "Inspeção"],
  turnos: ["Manhã", "Tarde", "Noite"],
  prioridades: ["Baixa", "Média", "Alta", "Urgente"],
  situacoes: ["Aberto", "Em andamento", "Aguardando peça", "Concluído"],
};

const propriedadesObrigatorias = [
  ["equipamento", "Informe o equipamento."],
  ["setor", "Selecione o setor."],
  ["tipo", "Selecione o tipo de manutenção."],
  ["turno", "Selecione o turno."],
  ["prioridade", "Selecione a prioridade."],
  ["responsavel", "Informe a pessoa responsável."],
  ["prazo", "Informe a data limite."],
  ["ocorrencia", "Descreva a falha ou solicitação."],
];

export function validarDadosChamado(dados) {
  const erros = {};

  for (const [campo, mensagem] of propriedadesObrigatorias) {
    if (typeof dados?.[campo] !== "string" || dados[campo].trim() === "") {
      erros[campo] = mensagem;
    }
  }

  for (const [campo, lista] of [
    ["setor", OPCOES_CHAMADO.setores],
    ["tipo", OPCOES_CHAMADO.tipos],
    ["turno", OPCOES_CHAMADO.turnos],
    ["prioridade", OPCOES_CHAMADO.prioridades],
  ]) {
    if (dados?.[campo] && !lista.includes(dados[campo])) {
      erros[campo] = "Selecione uma opção válida.";
    }
  }

  if (dados?.situacao && !OPCOES_CHAMADO.situacoes.includes(dados.situacao)) {
    erros.situacao = "Selecione uma situação válida.";
  }

  if (typeof dados?.prazo === "string" && dados.prazo.trim()) {
    const data = new Date(`${dados.prazo}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.prazo) || Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== dados.prazo) {
      erros.prazo = "Informe uma data válida.";
    }
  }

  if (typeof dados?.ocorrencia === "string" && dados.ocorrencia.trim().length > 1200) {
    erros.ocorrencia = "A descrição deve ter no máximo 1.200 caracteres.";
  }

  if (typeof dados?.solucao === "string" && dados.solucao.trim().length > 1200) {
    erros.solucao = "A solução deve ter no máximo 1.200 caracteres.";
  }

  return erros;
}

export default class Chamado {
  constructor(dados) {
    const erros = validarDadosChamado(dados);
    if (Object.keys(erros).length > 0) {
      const erro = new TypeError("Revise os dados do chamado.");
      erro.codigoHttp = 400;
      erro.campos = erros;
      throw erro;
    }

    this.id = dados.id;
    this.equipamento = dados.equipamento.trim();
    this.setor = dados.setor;
    this.tipo = dados.tipo;
    this.turno = dados.turno;
    this.prioridade = dados.prioridade;
    this.situacao = dados.situacao || "Aberto";
    this.responsavel = dados.responsavel.trim();
    this.prazo = dados.prazo;
    this.ocorrencia = dados.ocorrencia.trim();
    this.solucao = typeof dados.solucao === "string" ? dados.solucao.trim() : "";
    this.criadoEm = dados.criadoEm || new Date().toISOString();
    this.atualizadoEm = dados.atualizadoEm || this.criadoEm;
  }
}
