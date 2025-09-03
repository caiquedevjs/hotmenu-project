// OTIMIZADO E CORRIGIDO
import { useState, useEffect, useCallback } from 'react';
import { fetchPerguntas, fetchProductById } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);

  // =============================================================================
  // PARTE 1: Busca e transformação de dados (código original RESTAURADO)
  // =============================================================================
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const perguntas = await fetchPerguntas(productId);
        const productData = await fetchProductById(productId);

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

        // Pergunta fake para tamanhos
        if (productData?.Tamanhos?.length > 0) {
          const tamanhosPergunta = {
            id: 'tamanhos',
            description: 'Escolha um tamanho',
            type: 1, // observação tipo radio
            required: true,
            minOptions: 1,
            maxOptions: 1,
            selectedCount: 0,
            produtos: [],
            options: [],
            observacao: productData.Tamanhos.map(tamanho => ({
              Id: tamanho.Id,
              Nome: tamanho.Nome,
              PrecoDeVenda: tamanho.PrecoDeVenda,
              selected: false
            }))
          };
          transformedData.unshift(tamanhosPergunta);
        }

        // Pergunta para as partes do produto (sabores)
        if (productData?.PartesProduto?.length > 0 && productData.QuantidadePartes > 0) {
          const partesPergunta = {
            id: 'partes-produto',
            description: `Escolha ${productData.QuantidadePartes} sabores`,
            type: 2,
            required: true,
            minOptions: productData.QuantidadePartes,
            maxOptions: productData.QuantidadePartes,
            selectedCount: 0,
            produtos: productData.PartesProduto.map(parte => ({
              Id: parte.Id,
              Nome: parte.Nome,
              PrecoDeVenda: parte.PrecoDeVenda,
              count: 0,
              QtdMaximaPermitida: 1
            })),
            options: [],
            observacao: [],
            PrecoPeloMaiorValor: productData.PrecoPeloMaiorValor
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

  // =============================================================================
  // PARTE 2: Funções de atualização de estado (lógica otimizada MANTIDA)
  // =============================================================================
  const handleIncrement = useCallback((id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => {
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

  const handleDecrement = useCallback((id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => {
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

  // =============================================================================
  // PARTE 3: Funções auxiliares e retorno do hook (otimizadas com useCallback)
  // =============================================================================
  const calcularPrecoAdicionais = useCallback(() => {
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
  }, [additionalStates]);

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