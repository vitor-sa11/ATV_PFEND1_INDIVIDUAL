import "./globals.css";

export const metadata = {
  title: "UptimeSys | Manutenção industrial",
  description: "Painel operacional para organizar chamados de manutenção industrial.",
  applicationName: "UptimeSys",
};

export default function LayoutRaiz({ children: conteudo }) {
  return (
    <>
      <html lang="pt-BR">
        <body>{conteudo}</body>
      </html>
    </>
  );
}
