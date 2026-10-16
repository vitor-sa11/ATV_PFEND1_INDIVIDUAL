import aplicativoExpress from "./app.js";
import { configuracao } from "./config/ambiente.js";

const servidor = aplicativoExpress.listen(configuracao.portaApi, configuracao.enderecoApi, () => {
  console.log(`API UptimeSys disponível em http://${configuracao.enderecoApi}:${configuracao.portaApi}`);
});

function encerrarServidor(sinal) {
  console.log(`\n${sinal}: encerrando a API UptimeSys...`);
  servidor.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on("SIGINT", () => encerrarServidor("SIGINT"));
process.on("SIGTERM", () => encerrarServidor("SIGTERM"));
