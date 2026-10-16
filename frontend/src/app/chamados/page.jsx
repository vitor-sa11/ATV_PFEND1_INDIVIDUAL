import PainelChamados from "../../componentes/PainelChamados.jsx";

export const metadata = {
  title: "Todos os chamados | UptimeSys",
  description: "Lista completa dos chamados de manutenção industrial.",
};

export default function PaginaTodosChamados() {
  return <PainelChamados mostrarTodos />;
}
