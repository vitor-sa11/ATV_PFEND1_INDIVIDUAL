import teste, { beforeEach as antesDeCadaTeste } from "node:test";
import verificar from "node:assert/strict";
import * as modeloChamados from "../models/ChamadoModel.js";
import * as servicoChamados from "../services/ChamadoService.js";

const dadosDeChamadoValido = {
  equipamento: "Torno CNC · TC-03",
  setor: "Produção",
  tipo: "Corretiva",
  turno: "Manhã",
  prioridade: "Alta",
  situacao: "Aberto",
  responsavel: "Alex Souza",
  prazo: "2026-10-20",
  ocorrencia: "O eixo principal apresenta ruído incomum durante a operação.",
};

antesDeCadaTeste(() => modeloChamados.restaurarDadosIniciais());

teste("lista os registros de demonstração em ordem decrescente", () => {
  const chamados = servicoChamados.listar();
  verificar.equal(chamados.length, 4);
  verificar.ok(chamados[0].id > chamados[1].id);
});

teste("cadastra e consulta um chamado", () => {
  const novoChamado = servicoChamados.criar(dadosDeChamadoValido);
  verificar.equal(novoChamado.equipamento, dadosDeChamadoValido.equipamento);
  verificar.equal(novoChamado.situacao, "Aberto");
  verificar.equal(servicoChamados.buscarPorId(novoChamado.id).id, novoChamado.id);
});

teste("edita e exclui um chamado existente", () => {
  const novoChamado = servicoChamados.criar(dadosDeChamadoValido);
  const atualizado = servicoChamados.atualizar(novoChamado.id, { prioridade: "Urgente" });
  verificar.equal(atualizado.prioridade, "Urgente");
  verificar.equal(servicoChamados.remover(novoChamado.id), novoChamado.id);
  verificar.throws(() => servicoChamados.buscarPorId(novoChamado.id), { codigoHttp: 404 });
});

teste("rejeita campos obrigatórios vazios e valores fora das opções", () => {
  verificar.throws(
    () => servicoChamados.criar({ ...dadosDeChamadoValido, setor: "", prioridade: "Crítica" }),
    (erro) => erro.codigoHttp === 400 && Boolean(erro.campos.setor) && Boolean(erro.campos.prioridade),
  );
});

teste("rejeita identificadores inválidos ou inexistentes", () => {
  verificar.throws(() => servicoChamados.buscarPorId("abc"), { codigoHttp: 400 });
  verificar.throws(() => servicoChamados.buscarPorId(999999), { codigoHttp: 404 });
});
