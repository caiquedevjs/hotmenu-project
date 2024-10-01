import { useState, useEffect } from 'react';
import { fetchPerguntas } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const perguntas = await fetchPerguntas(productId);
        
        const transformedData = perguntas.map(pergunta => {
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
              price: complemento.PrecoVenda,
              count: 0,
              QtdMaximaPermitida: complemento.QtdMaximaPermitida || null
            })),
            selectedCount: 0,
            observacao: pergunta.Observacao || [],
            produtos: pergunta.Produto || [] // Adicionando a propriedade Produto
          };
        });

        setAdditionalStates(transformedData);
      } catch (error) {
        console.error('Erro ao buscar adicionais:', error);
      }
    };

    if (productId) {
      fetchAdditionalData();
    }
  }, [productId]);

  const handleIncrement = (id) => {
    setAdditionalStates(prevState => {
      return prevState.map(additional => {
        const option = additional.options.find(option => option.id === id);
        if (option) {
          const totalSelected = additional.selectedCount + 1;
          const maxAllowed = option.QtdMaximaPermitida || additional.maxOptions;

          if (option.count < maxAllowed && totalSelected <= additional.maxOptions) {
            return {
              ...additional,
              options: additional.options.map(opt => 
                opt.id === id ? { ...opt, count: opt.count + 1 } : opt
              ),
              selectedCount: totalSelected
            };
          }
        }
        return additional;
      });
    });
  };

  const handleDecrement = (id) => {
    setAdditionalStates(prevState => {
      return prevState.map(additional => {
        const option = additional.options.find(option => option.id === id);
        if (option) {
          const totalSelected = additional.selectedCount - 1;

          if (option.count > 0) {
            return {
              ...additional,
              options: additional.options.map(opt => 
                opt.id === id ? { ...opt, count: opt.count - 1 } : opt
              ),
              selectedCount: totalSelected
            };
          }
        }
        return additional;
      });
    });
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
