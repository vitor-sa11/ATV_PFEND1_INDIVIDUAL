import Chamado, { validarDadosChamado } from "../models/Chamado.js";
import * as modeloChamados from "../models/ChamadoModel.js";

function validarIdentificador(valorRecebido) {
  const identificador = Number(valorRecebido);
  if (!Number.isInteger(identificador) || identificador <= 0) {
    const erro = new TypeError("O identificador do chamado é inválido.");
    erro.codigoHttp = 400;
    throw erro;
  }
  return identificador;
}

export function listar() {
  return modeloChamados.listarTodos();
}

export function buscarPorId(identificadorRecebido) {
  const identificador = validarIdentificador(identificadorRecebido);
  const chamado = modeloChamados.buscarPorId(identificador);
  if (!chamado) {
    const erro = new Error("Chamado não encontrado.");
    erro.codigoHttp = 404;
    throw erro;
  }
  return chamado;
}

export function criar(dados) {
  const erros = validarDadosChamado(dados);
  if (Object.keys(erros).length > 0) {
    const erro = new TypeError("Revise os campos obrigatórios do chamado.");
    erro.codigoHttp = 400;
    erro.campos = erros;
    throw erro;
  }
  const chamado = new Chamado({ ...dados, criadoEm: new Date().toISOString() });
  return modeloChamados.criar(chamado);
}

export function atualizar(identificadorRecebido, dados) {
  const identificador = validarIdentificador(identificadorRecebido);
  const existente = buscarPorId(identificador);
  const dadosAtualizados = { ...existente, ...dados, id: identificador };
  const erros = validarDadosChamado(dadosAtualizados);
  if (Object.keys(erros).length > 0) {
    const erro = new TypeError("Revise os campos obrigatórios do chamado.");
    erro.codigoHttp = 400;
    erro.campos = erros;
    throw erro;
  }
  const chamado = new Chamado({
    ...dadosAtualizados,
    criadoEm: existente.criadoEm,
    atualizadoEm: new Date().toISOString(),
  });
  return modeloChamados.atualizar(identificador, chamado);
}

export function remover(identificadorRecebido) {
  const identificador = validarIdentificador(identificadorRecebido);
  buscarPorId(identificador);
  modeloChamados.excluir(identificador);
  return identificador;
}
