import { useState, useEffect, useCallback } from 'react';
import { fetchPerguntas, fetchProductById } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const perguntas = await fetchPerguntas(productId);
        const fetchedProductData = await fetchProductById(productId);

        setProductData(fetchedProductData);

        const transformedData = perguntas.map(pergunta => {
          const isTamanhoPergunta = pergunta.Produto?.some(p => p.TamanhoProdutoId);

          if (isTamanhoPergunta) {
            return {
              id: `tamanhos-${pergunta.PerguntaId}`,
              description: 'Escolha um tamanho',
              type: 1,
              required: pergunta.RespostaObrigatoria,
              minOptions: 1,
              maxOptions: 1,
              selectedCount: 0,
              produtos: [],
              options: [],
              observacao: pergunta.Produto.map(tamanho => ({
                Id: tamanho.Id,
                Nome: tamanho.Nome,
                PrecoDeVenda: tamanho.PrecoPromo ?? tamanho.PrecoDeVenda,
                selected: false
              }))
            };
          }
          
          return {
            id: pergunta.PerguntaId,
            description: pergunta.Texto,
            type: pergunta.Tipo,
            required: pergunta.RespostaObrigatoria,
            minOptions: pergunta.QtdOpcoesResPostaMin,
            maxOptions: pergunta.QtdOpcoesResPostaMax,
            options: pergunta.Complemento.map(complemento => ({
              id: complemento.Id,
              name: complemento.Nome,
              price: fetchedProductData.EhCombo ? 0 : (complemento.PrecoPromo ?? complemento.PrecoVenda),
              count: 0,
              QtdMaximaPermitida: complemento.QtdMaximaPermitida || null
            })),
            selectedCount: 0,
            produtos: pergunta.Produto.map(produto => ({
              Id: produto.Id,
              Nome: produto.Nome,
              Descricao: produto.Descricao,
              PrecoDeVenda: fetchedProductData.EhCombo ? 0 : (produto.PrecoPromo ?? produto.PrecoDeVenda),
              count: 0,
              selected: false, 
              QtdMaximaPermitida: produto.QtdMaximaPermitida || null
            })),
            observacao: pergunta.Observacao || [],
            PrecoPeloMaiorValor: pergunta.Produto.some(p => p.PrecoPeloMaiorValor === true)
          };
        });

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
              PrecoDeVenda: tamanho.PrecoPromo ?? tamanho.PrecoDeVenda,
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
              PrecoDeVenda: parte.PrecoPromo ?? parte.PrecoDeVenda,
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

  const handleIncrement = useCallback((id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => {
      const additionalIndex = prevState.findIndex(add => add.id === perguntaId);
      if (additionalIndex === -1) return prevState;

      const additional = prevState[additionalIndex];
      const newState = [...prevState];

      if (additional.type === 1 || additional.type === 3) {
        const sourceArray = additional.type === 1 ? additional.observacao : additional.produtos;
        const item = sourceArray.find(i => i.Id === id);

        if (!item || item.selected) {
          return prevState;
        }

        const updatedArray = sourceArray.map(i => ({
          ...i,
          selected: i.Id === id,
          count: i.Id === id ? 1 : 0,
        }));

        const updatedAdditional = {
          ...additional,
          selectedCount: 1
        };

        if (additional.type === 1) {
          updatedAdditional.observacao = updatedArray;
        } else {
          updatedAdditional.produtos = updatedArray;
        }

        newState[additionalIndex] = updatedAdditional;
        return newState;
      }

      const targetArray = isProduto ? additional.produtos : additional.options;
      const itemIndex = targetArray.findIndex(item => (isProduto ? item.Id : item.id) === id);
      if (itemIndex === -1) return prevState;

      const itemToIncrement = targetArray[itemIndex];
      const maxOptions = additional.maxOptions === 0 ? Infinity : additional.maxOptions;
      const maxPermitida = itemToIncrement.QtdMaximaPermitida === 0 ? Infinity : (itemToIncrement.QtdMaximaPermitida ?? maxOptions);

      if (additional.selectedCount < maxOptions && itemToIncrement.count < maxPermitida) {
        const newTargetArray = [...targetArray];
        newTargetArray[itemIndex] = { ...itemToIncrement, count: itemToIncrement.count + 1 };
        
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

      if (additional.type === 1 || additional.type === 3) {
        return prevState;
      }
      
      const newState = [...prevState];
      const targetArray = isProduto ? additional.produtos : additional.options;
      const itemIndex = targetArray.findIndex(item => (isProduto ? item.Id : item.id) === id);
      if (itemIndex === -1) return prevState;

      const item = targetArray[itemIndex];
      if (item.count > 0) {
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

  const getSelectedTamanho = useCallback(() => {
    const tamanhoPergunta = additionalStates.find(item => item.id.toString().startsWith('tamanhos-'));
    if (!tamanhoPergunta || !tamanhoPergunta.observacao) return null;
    return tamanhoPergunta.observacao.find(obs => obs.selected) || null;
  }, [additionalStates]);
  
  const calcularPrecoAdicionais = useCallback(() => {
    if (productData && productData.EhCombo) {
      return 0;
    }

    let total = 0;
    additionalStates.forEach(additional => {
      if (additional.id === 'partes-produto' || additional.PrecoPeloMaiorValor) {
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
  }, [additionalStates, productData]);

  const calcularPrecoTotal = useCallback(() => {
    if (!productData) {
      return 0;
    }

    if (productData.EhCombo) { 
      return productData.PrecoPromo ?? productData.PrecoDeVenda ?? 0;
    }

    const tamanhoSelecionado = getSelectedTamanho();
    const precoBase = tamanhoSelecionado
      ? tamanhoSelecionado.PrecoDeVenda
      : (productData.PrecoPromo ?? productData.PrecoDeVenda ?? 0);

    let precoAdicionais = 0;
    additionalStates.forEach(additional => {
      if (additional.id.toString().startsWith('tamanhos-')) {
        return; 
      }

      if (additional.id === 'partes-produto' || additional.PrecoPeloMaiorValor) {
        const precoPeloMaiorValor = additional.PrecoPeloMaiorValor ?? false;
        if (precoPeloMaiorValor) {
          const precosSelecionados = additional.produtos.filter(prod => prod.count > 0).map(prod => prod.PrecoDeVenda);
          if (precosSelecionados.length > 0) {
            precoAdicionais += Math.max(...precosSelecionados);
          }
        } else {
          precoAdicionais += additional.produtos.reduce((acc, prod) => acc + prod.PrecoDeVenda * prod.count, 0);
        }
      } else {
        if (additional.produtos && additional.produtos.length > 0) {
          precoAdicionais += additional.produtos.reduce((acc, prod) => acc + prod.PrecoDeVenda * prod.count, 0);
        } else if (additional.options && additional.options.length > 0) {
          precoAdicionais += additional.options.reduce((acc, opt) => acc + opt.price * opt.count, 0);
        }
      }
    });

    return precoBase + precoAdicionais;
  }, [additionalStates, productData, getSelectedTamanho]);
  
  const totalAdditional = useCallback(() => {
    return additionalStates.reduce((total, additional) => total + additional.selectedCount, 0);
  }, [additionalStates]);

  return {
    productData,
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement,
    getSelectedTamanho,
    calcularPrecoAdicionais,
    calcularPrecoTotal,
  };
};

export default useAdditionalState;