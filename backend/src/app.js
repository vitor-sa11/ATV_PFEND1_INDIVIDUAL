import express from "express";
import chamadoRoutes from "./routes/chamadoRoutes.js";
import { tratarErros } from "./middlewares/tratamentoErros.js";

const aplicativoExpress = express();

aplicativoExpress.disable("x-powered-by");
aplicativoExpress.use(express.json({ limit: "64kb" }));
aplicativoExpress.get("/api/saude", (_solicitacao, resposta) => (
  resposta.status(200).json({ situacao: "ok" })
));
aplicativoExpress.use("/api/chamados", chamadoRoutes);
aplicativoExpress.use("/api/*caminho", (_solicitacao, resposta) => (
  resposta.status(404).json({ mensagem: "Rota da API não encontrada." })
));
aplicativoExpress.use(tratarErros);

export default aplicativoExpress;
