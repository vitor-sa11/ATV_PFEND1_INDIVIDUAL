import Icone from "./Icone.jsx";

export default function MarcadorChamado({ pequeno = false }) {
  const classeTamanho = pequeno ? "simbolo-chamado-pequeno" : "";

  return (
    <span className={`simbolo-chamado ${classeTamanho}`}>
      <Icone nome="manutencao" tamanho={pequeno ? 15 : 17} />
    </span>
  );
}
