export function tratarErros(erro, _solicitacao, resposta, proximo) {
  if (resposta.headersSent) {
    return proximo(erro);
  }

  if (erro instanceof SyntaxError && "body" in erro) {
    return resposta.status(400).json({
      mensagem: "O corpo da solicitação precisa ser um JSON válido.",
    });
  }

  return resposta.status(500).json({
    mensagem: "Erro interno da API.",
  });
}
