
// <------- Função para buscar todos os produtos ------->
export const fetchProducts = async () => {
  try {
    const response = await fetch('https://hotmenu.com.br/webhook/Produtos/hotmenu');
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    const data = await response.json();
    return data; // Supondo que o retorno da API seja um array de produtos
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

export const fetchPerguntas = async (productId) => {
  try {
    const response = await fetch(`https://hotmenu.com.br/webhook/PerguntasProdutos/${productId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao buscar perguntas do produto. Detalhes do erro:', errorText);
      throw new Error('Erro ao buscar perguntas do produto');
    }

    // Em vez de usar response.text(), use response.json() para obter um objeto
    const jsonData = await response.json();
    console.log('Resposta da API:', jsonData); // Mostra a resposta no console
    return jsonData; // Retorna o objeto JSON
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    return []; // Retorna um array vazio em caso de erro
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
    return data;
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
    return data;
  } catch (error) {
    console.error('Erro ao buscar horário de funcionamento', error);
    return { status: 'Erro ao carregar horários' };
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
    return data;
  } catch (error) {
    console.error('Erro ao buscar formas de pagamentos', error);
    return { status: 'Erro ao carregar formas de pagamentos' }; // Valor padrão caso ocorra erro
  }
};


 export const fetchEstabelecimentoData = async () =>{
  try{
    const response = await fetch('https://hotmenu.com.br/webhook/Cliente/hotmenu');
    if(!response.ok){
      throw new Error('Erro ao buscar dados do estabelecimento');
    }
    const data = await response.json();
    return data.cliente;
  }
  catch(error){
    console.error('Erro ao bsucar dados dos estabelecimento: ', error);
    return {status: 'Erro ao buscar dados do estabelecimento'}
  }
 }

 // https://hotmenu.com.br/webhook/Cliente/hotmenu
 
// https://hotmenu.com.br/webhook/ObterDadosProduto/78
 
// https://hotmenu.com.br/webhook/ObterPerguntasdoProduto/78
 

//https://hotmenu.com.br/webhook/BuscarCupom
 
//BODY:
//{"Id":"1","Cupom":"BEM10","Celular":"5571999723638"}
 