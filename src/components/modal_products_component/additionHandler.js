import { useState, useEffect } from 'react';
import { fetchPerguntas, fetchProductById } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);

useEffect(() => {
  const fetchAdditionalData = async () => {
    try {
      const perguntas = await fetchPerguntas(productId);
      const productData = await fetchProductById(productId); // nova função abaixo

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

      // 👇 Insere os tamanhos como uma "pergunta fake"
      if (productData?.Tamanhos?.length > 0) {
        const tamanhosPergunta = {
          id: 'tamanhos', // ID fictício
          description: 'Escolha um tamanho',
          type: 1, // assume que é tipo observação (radio)
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

        transformedData.unshift(tamanhosPergunta); // coloca no topo
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
  const handleIncrement = (id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => prevState.map(additional => {
      if (additional.id === perguntaId) {
        if (isProduto) {
          const item = additional.produtos.find(produto => produto.Id === id);
          if (item) {
            const maxAllowed = item.QtdMaximaPermitida || additional.maxOptions;
            if (item.count < maxAllowed && additional.selectedCount < additional.maxOptions) {
              return {
                ...additional,
                produtos: additional.produtos.map(prod =>
                  prod.Id === id ? { ...prod, count: prod.count + 1 } : prod
                ),
                selectedCount: additional.selectedCount + 1
              };
            }
          }
        } else if (additional.type === 1) {
          // Lógica para observações
          const item = additional.observacao.find(obs => obs.Id === id);
          if (item) {
            const updatedObservacoes = additional.observacao.map(obs => ({
              ...obs,
              selected: obs.Id === id
            }));
            return {
              ...additional,
              observacao: updatedObservacoes,
              selectedCount: Math.min(additional.maxOptions, additional.selectedCount + 1)
            };
          }
        } else {
          const item = additional.options.find(option => option.id === id);
          if (item) {
            const maxAllowed = additional.maxOptions;
            if (item.count < maxAllowed && additional.selectedCount < maxAllowed) {
              return {
                ...additional,
                options: additional.options.map(it =>
                  it.id === id ? { ...it, count: it.count + 1 } : it
                ),
                selectedCount: additional.selectedCount + 1
              };
            }
          }
        }
      }
      return additional;
    }));
  };

  const handleDecrement = (id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => prevState.map(additional => {
      if (additional.id === perguntaId) {
        if (isProduto) {
          const item = additional.produtos.find(produto => produto.Id === id);
          if (item && item.count > 0) {
            return {
              ...additional,
              produtos: additional.produtos.map(prod =>
                prod.Id === id ? { ...prod, count: prod.count - 1 } : prod
              ),
              selectedCount: Math.max(0, additional.selectedCount - 1)
            };
          }
        } else if (additional.type === 1) {
          // Lógica para observações
          const item = additional.observacao.find(obs => obs.Id === id);
          if (item && item.selected) {
            const updatedObservacoes = additional.observacao.map(obs => ({
              ...obs,
              selected: obs.Id === id ? false : obs.selected
            }));
            return {
              ...additional,
              observacao: updatedObservacoes,
              selectedCount: Math.max(0, additional.selectedCount - 1)
            };
          }
        } else {
          const item = additional.options.find(option => option.id === id);
          if (item && item.count > 0) {
            return {
              ...additional,
              options: additional.options.map(it =>
                it.id === id ? { ...it, count: it.count - 1 } : it
              ),
              selectedCount: Math.max(0, additional.selectedCount - 1)
            };
          }
        }
      }
      return additional;
    }));
  };

  const getSelectedTamanho = () => {
  const tamanhoPergunta = additionalStates.find(item => item.id === 'tamanhos');
  if (!tamanhoPergunta || !tamanhoPergunta.observacao) return null;
  const selecionado = tamanhoPergunta.observacao.find(obs => obs.selected);
  return selecionado || null;
};


  const totalAdditional = () => {
    return additionalStates.reduce((total, additional) => total + additional.selectedCount, 0);
  };

  return {
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement,
    getSelectedTamanho,
  };
};

export default useAdditionalState;
