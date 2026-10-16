export function ordenarChamadosRecentes(chamados) {
  return [...chamados].sort((primeiro, segundo) => {
    const dataPrimeiro = Date.parse(primeiro.criadoEm || "") || 0;
    const dataSegundo = Date.parse(segundo.criadoEm || "") || 0;
    return dataSegundo - dataPrimeiro || segundo.id - primeiro.id;
  });
}

export function selecionarChamadosRecentes(chamados, quantidade = 5) {
  return ordenarChamadosRecentes(chamados).slice(0, quantidade);
}
