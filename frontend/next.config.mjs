const portaApi = process.env.PORTA_API || "4001";
const urlApi = process.env.URL_API || `http://127.0.0.1:${portaApi}`;

const configuracaoNext = {
  async rewrites() {
    return [
      {
        source: "/api/:caminho*",
        destination: `${urlApi}/api/:caminho*`,
      },
    ];
  },
};

export default configuracaoNext;
