import Icone from "./Icone.jsx";

const classesSituacao = {
  Aberto: "situacao-aberta",
  "Em andamento": "situacao-em-andamento",
  "Aguardando peça": "situacao-aguardando-peca",
  Concluído: "situacao-concluida",
};

const classesPrioridade = {
  Urgente: "prioridade-urgente",
  Alta: "prioridade-alta",
  Média: "prioridade-media",
  Baixa: "prioridade-baixa",
};

export function SeloSituacao({ situacao }) {
  return (
    <span className={`selo-situacao ${classesSituacao[situacao] || "situacao-aberta"}`}>
      <i />
      {situacao}
    </span>
  );
}

export function SeloPrioridade({ prioridade, compacto = false }) {
  const nomeIcone = prioridade === "Urgente" ? "raio" : "alerta";
  const classeCompacta = compacto ? "prioridade-compacta" : "";

  return (
    <span className={`selo-prioridade ${classesPrioridade[prioridade] || "prioridade-media"} ${classeCompacta}`}>
      <Icone nome={nomeIcone} tamanho={13} larguraTraco={2.1} />
      {prioridade}
    </span>
  );
}
