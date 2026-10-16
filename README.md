# UptimeSys

Aplicação responsiva para organizar chamados de manutenção industrial. O frontend é desenvolvido em Next.js com App Router; a API é Node.js com Express. O painel busca os registros pela API e apresenta somente os cinco chamados mais recentes. O botão **Ver todos** abre `/chamados`, que lista o conjunto completo.

> Os chamados ficam somente em um array na memória da API. Ao reiniciar o servidor Express, os quatro registros iniciais de demonstração são restaurados. A aplicação não usa banco de dados, de acordo com o requisito original.

## Requisitos e execução local

- Node.js 20.12 ou superior (validado com Node.js 22.13.0)
- npm 10.9.2 ou compatível

Na raiz do repositório:

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. O lançador inicia o Next.js na porta 3000 e o Express em `127.0.0.1:4001`; as solicitações do navegador em `/api/*` são encaminhadas pelo Next.js à API.

Para verificar o código e a lógica:

```bash
npm run check
npm test
npm run build
npm start
```

A configuração local pode ser ajustada por `backend/.env` e `frontend/.env`, usando como base os arquivos `.env.example` correspondentes. As variáveis da API são `PORTA_API` e `ENDERECO_API`; `URL_API` configura o destino do proxy Next.js. O contrato `PORT` do servidor web é mantido por compatibilidade com Next.js e com o ambiente de execução.

## Execução com Docker Compose

Com Docker e o plugin Compose disponíveis:

```bash
docker compose up --build
```

O frontend fica disponível em `http://localhost:3000`; o serviço `backend` permanece acessível dentro da rede Compose e tem uma verificação de saúde HTTP. Não há serviço de banco de dados, pois os dados são deliberadamente voláteis.

## Funcionalidades e rotas

- `/` — saudação **Bem-vindo ao sistema**, cartões de resumo em componente próprio, tabela independente com os cinco chamados mais recentes e botão **Ver todos** alinhado à direita do título da tabela.
- `/chamados` — página para consultar, pesquisar, filtrar, abrir, editar ou excluir todos os chamados.
- Novo registro — valida equipamento, setor, tipo, turno, prioridade, responsável, prazo e ocorrência; situação e solução também podem ser informadas.
- Detalhes e edição — ficha do chamado, mensagens de resultado e confirmação antes da exclusão.

A tabela, os cartões de resumo, o formulário, a ficha e os marcadores são componentes separados. A interface usa somente os hooks React `useEffect` e `useState`; o CSS usa classes e variáveis personalizadas em português, com cada declaração em linha própria.

### API Express

- `GET /api/saude` — estado da API.
- `GET /api/chamados` — lista todos os chamados.
- `GET /api/chamados/:id` — consulta um chamado.
- `POST /api/chamados` — cadastra um chamado.
- `PUT /api/chamados/:id` — atualiza um chamado.
- `DELETE /api/chamados/:id` — exclui um chamado.

O Next.js usa um rewrite para encaminhar `/api/*` ao Express. O navegador não precisa acessar diretamente outra porta.

## Organização

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── componentes/
│   │   └── servicos/
│   ├── public/
│   ├── .env.example
│   ├── Dockerfile
│   ├── next.config.mjs
│   └── package.json
├── scripts/run-stack.mjs
├── docker-compose.yml
├── package.json
└── package-lock.json
```

O arquivo `app.config.ts` permanece na raiz por exigência do ambiente WebDev. A estrutura segue os diretórios `frontend/` e `backend/` pedidos, com workspaces npm e dependências Next.js, React, React DOM e Express já utilizadas no projeto.
