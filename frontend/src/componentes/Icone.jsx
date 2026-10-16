const caminhos = {
  grade: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  chamado: <><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /><path d="M8 3v4h8V3" /><path d="M7 12h10M7 16h7" /></>,
  busca: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.3 4.3" /></>,
  mais: <><path d="M12 5v14M5 12h14" /></>,
  sino: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  setas: <><path d="M4 7h16M4 12h16M4 17h16" /><path d="m9 4-3 3 3 3" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  filtro: <><path d="M4 6h16M7 12h10m-7 6h4" /><circle cx="8" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /></>,
  calendario: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  relogio: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  editar: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
  lixeira: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
  fechar: <><path d="m6 6 12 12M18 6 6 18" /></>,
  seta: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  raio: <path d="m13 2-9 12h7l-1 8 10-13h-7z" />,
  engrenagem: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-1.6 2.76-.09-.02a1.8 1.8 0 0 0-1.85.5l-.07.07h-3.2l-.03-.1a1.8 1.8 0 0 0-1.2-1.28l-.1-.03-1.6-2.76.07-.07a1.8 1.8 0 0 0 .18-1.9l-.05-.09v-3.2l.1-.04a1.8 1.8 0 0 0 1.26-1.2l.03-.1 2.76-1.6.07.07a1.8 1.8 0 0 0 1.9.18l.09-.05h3.2l.04.1a1.8 1.8 0 0 0 1.2 1.26l.1.03 1.6 2.76-.07.07a1.8 1.8 0 0 0-.18 1.9l.05.09z" /></>,
  manutencao: <><path d="M14.5 6.5a5 5 0 0 0-6.8 6.8L4 17l3 3 3.7-3.7a5 5 0 0 0 6.8-6.8L14 13l-3-3z" /><path d="m15 5 4 4" /></>,
  sucesso: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
  alerta: <><path d="M10.4 4.3 2.7 18a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.6 4.3a1.8 1.8 0 0 0-3.2 0Z" /><path d="M12 9v4m0 3h.01" /></>,
  usuario: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  fabrica: <><path d="M3 21V8l6 4V8l6 4V4h6v17z" /><path d="M8 17h2m4 0h2m2-9h1" /></>,
};

export default function Icone({ nome, tamanho = 20, larguraTraco = 1.8, classe = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={classe}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={larguraTraco}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {caminhos[nome] || caminhos.chamado}
    </svg>
  );
}
