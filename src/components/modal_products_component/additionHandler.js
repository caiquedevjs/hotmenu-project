import { useState, useEffect } from 'react';
import { fetchPerguntas } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const perguntas = await fetchPerguntas(productId);
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

        setAdditionalStates(transformedData);
      } catch (error) {
        console.error('Erro ao buscar adicionais:', error);
      }
    };

    if (productId) {
      fetchAdditionalData();
    }
  }, [productId]);

  const handleIncrement = (id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState => prevState.map(additional => {
      if (additional.id === perguntaId) {
        if (additional.type === 1) {
          const item = additional.observacao.find(obs => obs.Id === id);
          if (item) {
            const updatedObservacoes = additional.observacao.map(obs => ({
              ...obs,
              selected: obs.Id === id
            }));
            return {
              ...additional,
              observacao: updatedObservacoes,
              selectedCount: 1
            };
          }
        } else {
          const item = isProduto
            ? additional.produtos.find(produto => produto.Id === id)
            : additional.options.find(option => option.id === id);

          if (item) {
            const totalSelected = additional.selectedCount + 1;
            const maxAllowed = item.QtdMaximaPermitida || additional.maxOptions;

            if (item.count < maxAllowed && totalSelected <= additional.maxOptions) {
              if (isProduto) {
                const updatedProdutos = additional.produtos.map(prod => ({
                  ...prod,
                  count: prod.Id === id ? 1 : 0
                }));
                return {
                  ...additional,
                  produtos: updatedProdutos,
                  selectedCount: 1
                };
              } else {
                return {
                  ...additional,
                  options: additional.options.map(it =>
                    it.id === id ? { ...it, count: it.count + 1 } : it
                  ),
                  selectedCount: totalSelected
                };
              }
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
        const item = isProduto
          ? additional.produtos.find(produto => produto.Id === id)
          : additional.options.find(option => option.id === id);

        if (item) {
          const totalSelected = additional.selectedCount - 1;

          if (item.count > 0) {
            return {
              ...additional,
              [isProduto ? 'produtos' : 'options']: additional[isProduto ? 'produtos' : 'options'].map(it =>
                it.id === id ? { ...it, count: it.count - 1 } : it
              ),
              selectedCount: totalSelected
            };
          }
        }
      }
      return additional;
    }));
  };

  const totalAdditional = () => {
    return additionalStates.reduce((total, additional) => total + additional.selectedCount, 0);
  };

  return {
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement
  };
};

export default useAdditionalState;
