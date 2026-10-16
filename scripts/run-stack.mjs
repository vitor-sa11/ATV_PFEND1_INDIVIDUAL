import { spawn as criarProcesso } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve as resolverCaminho } from "node:path";
import { fileURLToPath } from "node:url";

const modo = process.argv[2] === "start" ? "start" : "dev";
const portaApi = process.env.PORTA_API || "4001";
const enderecoApi = process.env.ENDERECO_API || "127.0.0.1";
const portaWeb = process.env.PORT || "3000";
const urlApi = process.env.URL_API || `http://${enderecoApi}:${portaApi}`;
const raizProjeto = fileURLToPath(new URL("../", import.meta.url));
const raizBackend = resolverCaminho(raizProjeto, "backend");
const raizFrontend = resolverCaminho(raizProjeto, "frontend");
const executaveisNext = [
  resolverCaminho(raizProjeto, "node_modules", "next", "dist", "bin", "next"),
  resolverCaminho(raizFrontend, "node_modules", "next", "dist", "bin", "next"),
];
const executavelNext = executaveisNext.find((caminho) => existsSync(caminho));

if (!executavelNext) {
  console.error("[Next.js] Executável não encontrado. Execute npm ci na raiz do projeto.");
  process.exit(1);
}

const processos = [];
let encerrando = false;

function encerrar(codigo = 0) {
  if (encerrando) return;
  encerrando = true;

  for (const processo of processos) {
    if (!processo.pid || processo.exitCode !== null || processo.killed) continue;

    try {
      processo.kill("SIGTERM");
    } catch (erro) {
      if (erro.code !== "ESRCH" && erro.code !== "EINVAL") {
        console.error(`[Processo] ${erro.message}`);
      }
    }
  }

  setTimeout(() => process.exit(codigo), 1000);
}

function iniciarProcesso(rotulo, executavel, argumentos, ambiente, diretorio) {
  const processo = criarProcesso(executavel, argumentos, {
    cwd: diretorio,
    env: { ...ambiente, FORCE_COLOR: ambiente.FORCE_COLOR || "1" },
    stdio: "inherit",
    windowsHide: true,
  });

  processos.push(processo);
  processo.on("error", (erro) => {
    console.error(`[${rotulo}] ${erro.message}`);
    encerrar(1);
  });
  processo.on("exit", (codigo) => {
    if (!encerrando) {
      console.error(`[${rotulo}] processo encerrado com código ${codigo ?? "desconhecido"}.`);
      encerrar(codigo || 0);
    }
  });
}

process.on("SIGINT", () => encerrar(0));
process.on("SIGTERM", () => encerrar(0));

const ambienteBase = {
  ...process.env,
  PORTA_API: portaApi,
  ENDERECO_API: enderecoApi,
  URL_API: urlApi,
};

iniciarProcesso("API Express", process.execPath, ["src/server.js"], ambienteBase, raizBackend);
iniciarProcesso(
  "Next.js",
  process.execPath,
  [executavelNext, modo, "--hostname", "0.0.0.0"],
  { ...ambienteBase, PORT: portaWeb },
  raizFrontend,
);
