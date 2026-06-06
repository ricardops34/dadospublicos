export function competenciaPadraoRfb(dataBase: Date = new Date()): string {
  const ano = dataBase.getFullYear();
  const mes = dataBase.getMonth();

  if (mes === 0) {
    return `${ano - 1}-12`;
  }

  return `${ano}-${String(mes).padStart(2, '0')}`;
}
