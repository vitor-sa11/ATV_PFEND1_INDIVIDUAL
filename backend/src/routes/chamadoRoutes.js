import { Router } from "express";
import * as controladorChamados from "../controllers/ChamadoController.js";

const roteador = Router();

roteador.get("/", controladorChamados.listar);
roteador.get("/:id", controladorChamados.buscarPorId);
roteador.post("/", controladorChamados.criar);
roteador.put("/:id", controladorChamados.atualizar);
roteador.delete("/:id", controladorChamados.remover);

export default roteador;
