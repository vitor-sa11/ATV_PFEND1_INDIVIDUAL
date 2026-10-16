import Icone from "./Icone.jsx";

function CartaoResumo({ rotulo, valor, complemento, tom, icone, auxiliar }) {
  const larguraMedidor = Math.min(100, Math.max(8, valor * 9));

  return (
    <article className={`cartao-resumo resumo-${tom}`}>
      <div className="topo-resumo">
        <span className="rotulo-resumo">{rotulo}</span>
        <span className="icone-resumo">
          <Icone nome={icone} tamanho={18} />
        </span>
      </div>
      <div className="linha-valor-resumo">
        <strong>{valor}</strong>
        {auxiliar && <span className="complemento-resumo">{auxiliar}</span>}
      </div>
      <div className="rodape-resumo">
        <span>{complemento}</span>
        <span className="medidor-resumo">
          <i style={{ width: `${larguraMedidor}%` }} />
        </span>
      </div>
    </article>
  );
}

export default function CartoesResumo({ chamados }) {
  const chamadosAbertos = chamados.filter((chamado) => chamado.situacao === "Aberto").length;
  const chamadosEmAndamento = chamados.filter((chamado) => chamado.situacao === "Em andamento").length;
  const chamadosUrgentes = chamados.filter(
    (chamado) => chamado.prioridade === "Urgente" && chamado.situacao !== "Concluído",
  ).length;
  const chamadosConcluidos = chamados.filter((chamado) => chamado.situacao === "Concluído").length;

  return (
    <section className="grade-resumo" aria-label="Resumo dos chamados">
      <CartaoResumo
        rotulo="Chamados abertos"
        valor={chamadosAbertos}
        complemento="Aguardando início"
        tom="azul"
        icone="chamado"
      />
      <CartaoResumo
        rotulo="Em execução"
        valor={chamadosEmAndamento}
        complemento="Equipe em campo"
        tom="menta"
        icone="manutencao"
      />
      <CartaoResumo
        rotulo="Prioridade urgente"
        valor={chamadosUrgentes}
        complemento="Requer atenção"
        tom="ambar"
        icone="raio"
        auxiliar={chamadosUrgentes ? "AGORA" : "NO PRAZO"}
      />
      <CartaoResumo
        rotulo="Concluídos"
        valor={chamadosConcluidos}
        complemento="Serviços finalizados"
        tom="violeta"
        icone="sucesso"
      />
    </section>
  );
}
