function obterDataRelativa(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
}

function criarChamadosIniciais() {
  const agora = new Date().toISOString();
  return [
    {
      id: 4812,
      equipamento: "Prensa hidráulica · PH-04",
      setor: "Produção",
      tipo: "Corretiva",
      turno: "Manhã",
      prioridade: "Urgente",
      situacao: "Em andamento",
      responsavel: "Marcos Oliveira",
      prazo: obterDataRelativa(0),
      ocorrencia: "Vibração elevada durante o ciclo e queda de pressão no cilindro principal.",
      solucao: "",
      criadoEm: agora,
      atualizadoEm: agora,
    },
    {
      id: 4811,
      equipamento: "Compressor Atlas · CA-02",
      setor: "Utilidades",
      tipo: "Preventiva",
      turno: "Tarde",
      prioridade: "Alta",
      situacao: "Aberto",
      responsavel: "Camila Ferreira",
      prazo: obterDataRelativa(1),
      ocorrencia: "Executar inspeção dos filtros e verificar a temperatura do conjunto motor.",
      solucao: "",
      criadoEm: agora,
      atualizadoEm: agora,
    },
    {
      id: 4810,
      equipamento: "Esteira transportadora · ET-12",
      setor: "Acabamento",
      tipo: "Inspeção",
      turno: "Noite",
      prioridade: "Média",
      situacao: "Aguardando peça",
      responsavel: "Rafael Santos",
      prazo: obterDataRelativa(2),
      ocorrencia: "Rolamento do eixo de retorno apresenta ruído intermitente e temperatura acima do normal.",
      solucao: "Aguardando chegada do rolamento especificado para substituição.",
      criadoEm: agora,
      atualizadoEm: agora,
    },
    {
      id: 4809,
      equipamento: "Bomba centrífuga · BC-07",
      setor: "Qualidade",
      tipo: "Preditiva",
      turno: "Manhã",
      prioridade: "Baixa",
      situacao: "Concluído",
      responsavel: "Juliana Costa",
      prazo: obterDataRelativa(-1),
      ocorrencia: "Inspeção preditiva do conjunto de bombeamento após leitura de vibração.",
      solucao: "Acoplamento alinhado e lubrificação executada. Equipamento liberado para operação.",
      criadoEm: agora,
      atualizadoEm: agora,
    },
  ];
}

let chamadosNaMemoria = criarChamadosIniciais();
let proximoIdentificador = Math.max(...chamadosNaMemoria.map(({ id }) => id)) + 1;

export function listarTodos() {
  return [...chamadosNaMemoria].sort((primeiro, segundo) => segundo.id - primeiro.id);
}

export function buscarPorId(identificador) {
  return chamadosNaMemoria.find((chamado) => chamado.id === identificador) ?? null;
}

export function criar(dados) {
  const chamado = { ...dados, id: proximoIdentificador++ };
  chamadosNaMemoria = [chamado, ...chamadosNaMemoria];
  return chamado;
}

export function atualizar(identificador, dados) {
  const indice = chamadosNaMemoria.findIndex((chamado) => chamado.id === identificador);
  if (indice < 0) return null;
  chamadosNaMemoria[indice] = {
    ...chamadosNaMemoria[indice],
    ...dados,
    id: identificador,
    atualizadoEm: new Date().toISOString(),
  };
  return chamadosNaMemoria[indice];
}

export function excluir(identificador) {
  const indice = chamadosNaMemoria.findIndex((chamado) => chamado.id === identificador);
  if (indice < 0) return false;
  chamadosNaMemoria.splice(indice, 1);
  return true;
}

export function restaurarDadosIniciais() {
  chamadosNaMemoria = criarChamadosIniciais();
  proximoIdentificador = Math.max(...chamadosNaMemoria.map(({ id }) => id)) + 1;
}
