import * as servicoChamados from "../services/ChamadoService.js";

function responderComErro(resposta, erro) {
  const codigoHttp = erro.codigoHttp || 500;
  return resposta.status(codigoHttp).json({
    mensagem: erro.codigoHttp ? erro.message : "Não foi possível concluir a operação. Tente novamente.",
    ...(erro.campos ? { campos: erro.campos } : {}),
  });
}

export function listar(_solicitacao, resposta) {
  try {
    return resposta.status(200).json({ chamados: servicoChamados.listar() });
  } catch (erro) {
    return responderComErro(resposta, erro);
  }
}

export function buscarPorId(solicitacao, resposta) {
  try {
    return resposta.status(200).json({ chamado: servicoChamados.buscarPorId(solicitacao.params.id) });
  } catch (erro) {
    return responderComErro(resposta, erro);
  }
}

export function criar(solicitacao, resposta) {
  try {
    const chamado = servicoChamados.criar(solicitacao.body);
    return resposta.status(201).json({ chamado, mensagem: "Chamado cadastrado com sucesso." });
  } catch (erro) {
    return responderComErro(resposta, erro);
  }
}

export function atualizar(solicitacao, resposta) {
  try {
    const chamado = servicoChamados.atualizar(solicitacao.params.id, solicitacao.body);
    return resposta.status(200).json({ chamado, mensagem: "Chamado atualizado com sucesso." });
  } catch (erro) {
    return responderComErro(resposta, erro);
  }
}

export function remover(solicitacao, resposta) {
  try {
    const identificador = servicoChamados.remover(solicitacao.params.id);
    return resposta.status(200).json({ id: identificador, mensagem: "Chamado excluído com sucesso." });
  } catch (erro) {
    return responderComErro(resposta, erro);
  }
}
