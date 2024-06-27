import { useState } from 'react';

const useAdditionalState = (category) => {
  const [totalAdditional, setTotalAdditional] = useState(0);

  const additionalOptions = {
    hamburger: [
      { id: 1, count: 0, description: 'Queijo', price: 'R$ 2,50' },
      { id: 2, count: 0, description: 'Bacon', price: 'R$ 2,50' },
      { id: 3, count: 0, description: 'Bacon', price: 'R$ 2,50' },
      { id: 4, count: 0, description: 'Bacon', price: 'R$ 2,50' },
      // Adicione mais opções específicas para hambúrguer aqui
    ],
    pizza: [
      { id: 1, count: 0, description: 'Pequena', price: 'R$ 3,00' },
      { id: 2, count: 0, description: 'Media', price: 'R$ 3,00' },
      { id: 3, count: 0, description: 'Grande', price: 'R$ 3,00' },
      { id: 4, count: 0, description: 'Grande', price: 'R$ 3,00' },
      // Adicione mais opções específicas para pizza aqui
    ],
    pastel:  [
      { id: 1, count: 0, description: 'Queijo', price: 'R$ 2,50' },
      { id: 2, count: 0, description: 'Bacon', price: 'R$ 2,50' },
      { id: 3, count: 0, description: 'Bacon', price: 'R$ 2,50' },
      { id: 4, count: 0, description: 'Bacon', price: 'R$ 2,50' },
      // Adicione mais opções específicas para hambúrguer aqui
    ],
    // Adicione mais categorias e opções aqui se necessário
  };

  const [additionalStates, setAdditionalStates] = useState(additionalOptions[category] || []);

  const handleIncrement = (id) => {
    const index = additionalStates.findIndex(state => state.id === id);
    if (index !== -1) {
      const updatedStates = [...additionalStates];
      const additionalLimit = category === 'pizza' ? 1 : 3;

      if (updatedStates[index].count < additionalLimit && totalAdditional < 10) {
        updatedStates[index] = { ...updatedStates[index], count: updatedStates[index].count + 1 };
        setAdditionalStates(updatedStates);
        setTotalAdditional(totalAdditional + 1);
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
