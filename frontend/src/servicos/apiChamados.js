async function requisitarApi(caminho, opcoes = {}) {
  const resposta = await fetch(caminho, {
    ...opcoes,
    cache: "no-store",
    headers: {
      ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
      ...opcoes.headers,
    },
  });
  const conteudo = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const erro = new Error(conteudo.mensagem || "Não foi possível comunicar com a API.");
    erro.codigoHttp = resposta.status;
    erro.campos = conteudo.campos || {};
    throw erro;
  }

  return conteudo;
}

export const apiChamados = {
  listar: () => requisitarApi("/api/chamados"),
  buscarPorId: (identificador) => requisitarApi(`/api/chamados/${identificador}`),
  criar: (dados) => requisitarApi("/api/chamados", { method: "POST", body: JSON.stringify(dados) }),
  atualizar: (identificador, dados) => requisitarApi(`/api/chamados/${identificador}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  }),
  excluir: (identificador) => requisitarApi(`/api/chamados/${identificador}`, { method: "DELETE" }),
};
