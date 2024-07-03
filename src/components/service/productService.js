// productService.js



// Função para buscar todos os produtos
export const fetchProducts = async () => {
  try {
    const response = await fetch('https://hotmenu.com.br/webhook/Produtos/hotmenu');
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    const data = await response.json();
    console.log('Dados da API de Produtos:', data);
    return data; // Supondo que o retorno da API seja um array de produtos
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

// Função para buscar todas as categorias
export const fetchCategories = async () => {
  try {
    const response = await fetch('https://hotmenu.com.br/webhook/Categorias/hotmenu');
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }
    const data = await response.json();
    console.log('Dados da API de Categorias:', data);
    return data; // Supondo que o retorno da API seja um array de categorias
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};
