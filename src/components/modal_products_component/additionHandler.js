import { useState, useEffect, useCallback } from 'react';
import { fetchPerguntas, fetchProductById } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);
  // NOVO ESTADO: Para armazenar os dados do produto (incluindo a flag "EhCombo")
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const perguntas = await fetchPerguntas(productId);
        // O nome da variável foi alterado para evitar conflito com o nome do estado
        const fetchedProductData = await fetchProductById(productId);

        // DADO GUARDADO: Salvamos os dados do produto no estado para usar na validação
        setProductData(fetchedProductData);

        const transformedData = perguntas.map(pergunta => ({
          id: pergunta.PerguntaId,
          description: pergunta.Texto,
          type: pergunta.Tipo,
          required: pergunta.RespostaObrigatoria,
          minOptions: pergunta.QtdOpcoesResPostaMin,
          maxOptions: pergunta.QtdOpcoesResPostaMax,
          options: pergunta.Complemento.map(complemento => ({
            id: complemento.Id,
            name: complemento.Nome,
            price: complemento.PrecoVenda,
            count: 0,
            QtdMaximaPermitida: complemento.QtdMaximaPermitida || null
          })),
          selectedCount: 0,
          produtos: pergunta.Produto.map(produto => ({
            Id: produto.Id,
            Nome: produto.Nome,
            PrecoDeVenda: produto.PrecoDeVenda,
            count: 0,
            QtdMaximaPermitida: produto.QtdMaximaPermitida || null
          })),
          observacao: pergunta.Observacao || []
        }));

        if (fetchedProductData?.Tamanhos?.length > 0) {
          const tamanhosPergunta = {
            id: 'tamanhos',
            description: 'Escolha um tamanho',
            type: 1,
            required: true,
            minOptions: 1,
            maxOptions: 1,
            selectedCount: 0,
            produtos: [],
            options: [],
            observacao: fetchedProductData.Tamanhos.map(tamanho => ({
              Id: tamanho.Id,
              Nome: tamanho.Nome,
              PrecoDeVenda: tamanho.PrecoDeVenda,
              selected: false
            }))
          };
          transformedData.unshift(tamanhosPergunta);
        }

        if (fetchedProductData?.PartesProduto?.length > 0 && fetchedProductData.QuantidadePartes > 0) {
          const partesPergunta = {
            id: 'partes-produto',
            description: `Escolha ${fetchedProductData.QuantidadePartes} sabores`,
            type: 2,
            required: true,
            minOptions: fetchedProductData.QuantidadePartes,
            maxOptions: fetchedProductData.QuantidadePartes,
            selectedCount: 0,
            produtos: fetchedProductData.PartesProduto.map(parte => ({
              Id: parte.Id,
              Nome: parte.Nome,
              PrecoDeVenda: parte.PrecoDeVenda,
              count: 0,
              QtdMaximaPermitida: 1
            })),
            options: [],
            observacao: [],
            PrecoPeloMaiorValor: fetchedProductData.PrecoPeloMaiorValor
          };
          transformedData.push(partesPergunta);
        }

        setAdditionalStates(transformedData);
      } catch (error) {
        console.error('Erro ao buscar dados adicionais:', error);
      }
    };

    if (productId) {
      fetchAdditionalData();
    }
  }, [productId]);

  // Nenhuma alteração nesta função
  const handleIncrement = useCallback((id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => {
        // ...código original mantido...
      const additionalIndex = prevState.findIndex(add => add.id === perguntaId);
      if (additionalIndex === -1) return prevState;

      const additional = prevState[additionalIndex];
      const newState = [...prevState];
      
      if (!isProduto && additional.type === 1) {
        const item = additional.observacao.find(obs => obs.Id === id);
        if (item && !item.selected) {
          const updatedObservacoes = additional.observacao.map(obs => ({...obs, selected: obs.Id === id}));
          newState[additionalIndex] = {...additional, observacao: updatedObservacoes, selectedCount: 1};
          return newState;
        }
        return prevState;
      }
      
      const targetArray = isProduto ? additional.produtos : additional.options;
      const itemIndex = targetArray.findIndex(item => (isProduto ? item.Id : item.id) === id);
      if (itemIndex === -1) return prevState;

      const item = targetArray[itemIndex];
      if (additional.selectedCount < additional.maxOptions && item.count < (item.QtdMaximaPermitida ?? additional.maxOptions)) {
        const newTargetArray = [...targetArray];
        newTargetArray[itemIndex] = { ...item, count: item.count + 1 };
        
        newState[additionalIndex] = {
          ...additional,
          [isProduto ? 'produtos' : 'options']: newTargetArray,
          selectedCount: additional.selectedCount + 1,
        };
        return newState;
      }

      return prevState;
    });
  }, []);

  // Nenhuma alteração nesta função
  const handleDecrement = useCallback((id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => {
        // ...código original mantido...
      const additionalIndex = prevState.findIndex(add => add.id === perguntaId);
      if (additionalIndex === -1) return prevState;

      const additional = prevState[additionalIndex];
      const targetArray = isProduto ? additional.produtos : additional.options;
      const itemIndex = targetArray.findIndex(item => (isProduto ? item.Id : item.id) === id);
      if (itemIndex === -1) return prevState;

      const item = targetArray[itemIndex];
      if (item.count > 0) {
        const newState = [...prevState];
        const newTargetArray = [...targetArray];
        newTargetArray[itemIndex] = { ...item, count: item.count - 1 };

        newState[additionalIndex] = {
          ...additional,
          [isProduto ? 'produtos' : 'options']: newTargetArray,
          selectedCount: additional.selectedCount - 1,
        };
        return newState;
      }
      return prevState;
    });
  }, []);

  const calcularPrecoAdicionais = useCallback(() => {
    // LÓGICA ALTERADA: Validando se o produto é um combo (EhCombo: true)
    // Se for um combo, o preço dos adicionais é 0.
    if (productData && productData.EhCombo === true) {
      return 0;
    }

    // Se não for um combo, o cálculo original acontece normalmente.
    let total = 0;
    additionalStates.forEach(additional => {
      if (additional.id === 'partes-produto') {
        const precoPeloMaiorValor = additional.PrecoPeloMaiorValor ?? false;
        if (precoPeloMaiorValor) {
          const precosSelecionados = additional.produtos.filter(prod => prod.count > 0).map(prod => prod.PrecoDeVenda);
          if (precosSelecionados.length > 0) {
            total += Math.max(...precosSelecionados);
          }
        } else {
          total += additional.produtos.reduce((acc, prod) => acc + prod.PrecoDeVenda * prod.count, 0);
        }
      } else {
        if (additional.produtos && additional.produtos.length > 0) {
          total += additional.produtos.reduce((acc, prod) => acc + prod.PrecoDeVenda * prod.count, 0);
        } else if (additional.options && additional.options.length > 0) {
          total += additional.options.reduce((acc, opt) => acc + opt.price * opt.count, 0);
        }
      }
    });
    return total;
  // DEPENDÊNCIA ADICIONADA: Para que a validação funcione corretamente
  }, [additionalStates, productData]);

  const getSelectedTamanho = useCallback(() => {
    const tamanhoPergunta = additionalStates.find(item => item.id === 'tamanhos');
    if (!tamanhoPergunta || !tamanhoPergunta.observacao) return null;
    return tamanhoPergunta.observacao.find(obs => obs.selected) || null;
  }, [additionalStates]);

  const totalAdditional = useCallback(() => {
    return additionalStates.reduce((total, additional) => total + additional.selectedCount, 0);
  }, [additionalStates]);

  return {
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement,
    getSelectedTamanho,
    calcularPrecoAdicionais,
  };
};

export default useAdditionalState;