import { existsSync } from "node:fs";

const caminhoArquivoAmbiente = new URL("../../.env", import.meta.url);

if (existsSync(caminhoArquivoAmbiente)) {
  process.loadEnvFile(caminhoArquivoAmbiente);
}

export const configuracao = Object.freeze({
  portaApi: Number(process.env.PORTA_API || 4001),
  enderecoApi: process.env.ENDERECO_API || "127.0.0.1",
});
