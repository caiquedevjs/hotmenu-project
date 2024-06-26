import { useState } from 'react';


 export const useAdditionalState = () => {
 
  // manipulação do estado do total de adicionais 
  const [totalAdditional, setTotalAdditional] = useState(0);
//lista de objetos tipo : adicional
  const [additionalStates, setAdditionalStates] = useState([
    { id: 1, count: 0, description: 'adicional', price: 'R$ ' + 2.50 },
    { id: 2, count: 0, description: 'adicional', price: 'R$ ' + 2.50 },
    { id: 3, count: 0, description: 'adicional', price: 'R$ ' + 2.50 },
    { id: 4, count: 0, description: 'adicional', price: 'R$ ' + 2.50 },
  ]);


  const handleIncrement = (id) => {
    const index = additionalStates.findIndex(state => state.id === id);
    if (index !== -1 && additionalStates[index].count < 3 && totalAdditional < 10) {
      const updatedStates = [...additionalStates];
      updatedStates[index] = { ...updatedStates[index], count: updatedStates[index].count + 1 };
      setAdditionalStates(updatedStates);
      setTotalAdditional(totalAdditional + 1);
      
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
