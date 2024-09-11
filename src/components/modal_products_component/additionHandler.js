import { useState, useEffect } from 'react';
import { fetchPerguntas } from '../service/productService'; // Importe a função que busca as perguntas

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const response = await fetchPerguntas(productId);
        const perguntas = response.perguntas || []; // Acesse a propriedade 'perguntas' do objeto de resposta
        setAdditionalStates(perguntas);
      } catch (error) {
        console.error('Erro ao buscar adicionais:', error);
      }
    };

    if (productId) {
      fetchAdditionalData();
    }
  }, [productId]);

  const handleIncrement = (id) => {
    setAdditionalStates((prevState) => {
      const newState = prevState.map((additional) => {
        if (additional.id === id) {
          if (additional.count < 3 && totalAdditional() < 10) { // Verifica limites
            return { ...additional, count: additional.count + 1 };
          }
        }
        return additional;
      });
      return newState;
    });
  };

  const handleDecrement = (id) => {
    setAdditionalStates((prevState) => {
      const newState = prevState.map((additional) => {
        if (additional.id === id && additional.count > 0) {
          return { ...additional, count: additional.count - 1 };
        }
        return additional;
      });
      return newState;
    });
  };

  const totalAdditional = () => {
    let total = 0;
    additionalStates.forEach((additional) => {
      total += additional.count;
    });
    return total;
  };

  return {
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement
  };
};

export default useAdditionalState;
