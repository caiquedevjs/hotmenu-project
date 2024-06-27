import { useState } from 'react';

const useAdditionalState = (category) => {
  const [totalAdditional, setTotalAdditional] = useState(0);

  const additionalOptions = {
    hamburger: [
      { id: 1, count: 0, description: 'Queijo', price: 2.50 },
      { id: 2, count: 0, description: 'ovos', price: 2.50 },
      { id: 3, count: 0, description: 'presunto', price: 2.50 },
      { id: 4, count: 0, description: 'cebola', price: 2.50 },
      // Mais opções de hambúrguer
    ],
    pizza: [
      { id: 1, count: 0, description: 'Pequena', price: 25.00 },
      { id: 2, count: 0, description: 'Média', price: 35.00 },
      { id: 3, count: 0, description: 'Grande', price: 45.00 },
      { id: 4, count: 0, description: 'Familia', price: 60.00 },
      // Mais opções de pizza
    ],
    pastel: [
      { id: 1, count: 0, description: 'Queijo', price: 2.50 },
      { id: 2, count: 0, description: 'Frango', price: 3.00 },
      // Mais opções de pastel
    ],
  };

  const [additionalStates, setAdditionalStates] = useState(additionalOptions[category] || []);

  // Definir limite de adicionais conforme a categoria
  const additionalLimit = category === 'pizza' ? 1 : 3;

  const handleIncrement = (id) => {
    const index = additionalStates.findIndex(state => state.id === id);
    if (index !== -1) {
      const updatedStates = [...additionalStates];

      // Verificar se já atingiu o limite máximo para adicionar mais
      if (updatedStates[index].count < additionalLimit) {
        if ((category !== 'pizza' &&  totalAdditional < 10) || (category === 'pizza' && totalAdditional < 1)) {
          updatedStates[index] = { ...updatedStates[index], count: updatedStates[index].count + 1 };
          setAdditionalStates(updatedStates);
          setTotalAdditional(totalAdditional + 1);
        }
      }
    }
  };

  const handleDecrement = (id) => {
    const index = additionalStates.findIndex(state => state.id === id);
    if (index !== -1 && additionalStates[index].count > 0) {
      const updatedStates = [...additionalStates];
      updatedStates[index] = { ...updatedStates[index], count: updatedStates[index].count - 1 };
      setAdditionalStates(updatedStates);
      setTotalAdditional(totalAdditional - 1);
    }
  };

  return {
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement,
  };
};

export default useAdditionalState;
