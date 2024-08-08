
// <------- Função para buscar todos os produtos ------->
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

// <------- Função para buscar todas as categorias ------->
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

// <------- Função para buscar horarios de funcionamentos ------->
export const fetchHorarioFuncionamento = async () => {
  try {
    const response = await fetch('https://hotmenu.com.br/webhook/HorarioAtendimento/hotmenu');
    if (!response.ok) {
      throw new Error('Erro ao buscar horário de funcionamento');
    }
    const data = await response.json();
    console.log('Dados dos horários de funcionamento:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar horário de funcionamento', error);
    return { status: 'Erro ao carregar horários' }; // Valor padrão caso ocorra erro
  }
};

// <------- Função para buscar formas de pagamentos ------->
export const fetchFormaPagamentos = async () => {
  try {
    const response = await fetch('https://hotmenu.com.br/webhook/FormaDePagamento/hotmenu');
    if (!response.ok) {
      throw new Error('Erro ao forma de pagamentos');
    }
    const data = await response.json();
    console.log('Dados de formas de pagamento:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar formas de pagamentos', error);
    return { status: 'Erro ao carregar formas de pagamentos' }; // Valor padrão caso ocorra erro
  }
};