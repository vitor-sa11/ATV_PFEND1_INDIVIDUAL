import teste from "node:test";
import verificar from "node:assert/strict";
import { ordenarChamadosRecentes, selecionarChamadosRecentes } from "./chamadosRecentes.js";

const chamadosDeTeste = [
  { id: 8, criadoEm: "2026-10-12T09:00:00.000Z" },
  { id: 12, criadoEm: "2026-10-15T09:00:00.000Z" },
  { id: 9, criadoEm: "2026-10-12T09:00:00.000Z" },
  { id: 11, criadoEm: "2026-10-14T09:00:00.000Z" },
  { id: 10, criadoEm: "2026-10-13T09:00:00.000Z" },
  { id: 13, criadoEm: "2026-10-16T09:00:00.000Z" },
];

teste("ordena os chamados pela data de criação e usa o identificador para desempatar", () => {
  verificar.deepEqual(
    ordenarChamadosRecentes(chamadosDeTeste).map((chamado) => chamado.id),
    [13, 12, 11, 10, 9, 8],
  );
});

teste("seleciona cinco registros recentes sem alterar a lista original", () => {
  verificar.deepEqual(
    selecionarChamadosRecentes(chamadosDeTeste).map((chamado) => chamado.id),
    [13, 12, 11, 10, 9],
  );
  verificar.deepEqual(chamadosDeTeste.map((chamado) => chamado.id), [8, 12, 9, 11, 10, 13]);
});
