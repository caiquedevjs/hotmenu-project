import { useState, useEffect } from 'react';

const useAdditionalState = (categoryName) => {
  const [additionalStates, setAdditionalStates] = useState([]);

  useEffect(() => {
    if (categoryName === 'PIZZA ') {
      setAdditionalStates([
        { id: 1, description: 'Pequena', price: 25.00, count: 0 },
        { id: 2, description: 'Média', price: 35.00, count: 0 },
        { id: 3, description: 'Grande', price: 45.00, count: 0 },
        { id: 4, description: 'Família', price: 60.00, count: 0 }
      ]);
    } else if (categoryName === 'BURGUERS') {
      setAdditionalStates([
        { id: 1, description: 'Queijo', price: 2.50, count: 0 },
        { id: 2, description: 'Ovos', price: 2.50, count: 0 },
        { id: 3, description: 'Presunto', price: 2.50, count: 0 },
        { id: 4, description: 'Cebola', price: 2.50, count: 0 }
      ]);
    } else if (categoryName === 'MARMITARIA') {
      setAdditionalStates([
        { id: 1, description: 'Marmita Pequena', price: 15.00, count: 0 },
        { id: 2, description: 'Marmita Média', price: 20.00, count: 0 },
        { id: 3, description: 'Marmita Grande', price: 25.00, count: 0 }
      ]);
    } else if (categoryName === 'AÇAI ') {
      setAdditionalStates([
        { id: 1, description: '500ml', price: 10.00, count: 0 },
        { id: 2, description: '700ml', price: 15.00, count: 0 },
        { id: 3, description: '1 litro', price: 20.00, count: 0 }
      ]);
    } else if (categoryName === 'PORÇÕES') {
      setAdditionalStates([
        { id: 1, description: 'Fritas', price: 12.00, count: 0 },
        { id: 2, description: 'Onion Rings', price: 10.00, count: 0 },
        { id: 3, description: 'Frango à Passarinho', price: 15.00, count: 0 }
      ]);
    } else if (categoryName === 'SALGADOS ') {
      setAdditionalStates([
        { id: 1, description: 'Coxinha', price: 3.00, count: 0 },
        { id: 2, description: 'Pastel', price: 2.50, count: 0 },
        { id: 3, description: 'Empada', price: 3.50, count: 0 }
      ]);
    } else if (categoryName === 'SUSHI') {
      setAdditionalStates([
        { id: 1, description: 'Sushi de Salmão', price: 3.00, count: 0 },
        { id: 2, description: 'Sushi de Atum', price: 3.50, count: 0 },
        { id: 3, description: 'Sashimi de Peixe Branco', price: 4.00, count: 0 }
      ]);
    } else if (categoryName === 'BEBIDAS') {
      setAdditionalStates([
        { id: 1, description: 'Refrigerante Lata', price: 5.00, count: 0 },
        { id: 2, description: 'Suco Natural', price: 6.00, count: 0 },
        { id: 3, description: 'Água Mineral', price: 3.00, count: 0 }
      ]);
    }
    // Adicione mais lógica para outras categorias conforme necessário
  }, [categoryName]);

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

  // Função para calcular o total de adicionais selecionados
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
