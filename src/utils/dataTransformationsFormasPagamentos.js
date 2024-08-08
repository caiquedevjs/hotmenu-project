export const transformFormasDePagamento = (data) => {
  const text = data.FormaDePagamento;
  const sections = text.split('\n\n');
  const result = { formasDePagamento: [] };

  sections.forEach(section => {
    const [header, ...items] = section.split('\n');
    const tipo = header.replace('*', '').trim();
    const opcoes = items.map(item => item.replace('- ', '').trim());

    result.formasDePagamento.push({ tipo, opcoes });
  });

  return result;
};
