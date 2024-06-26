// utils.js

import { useState } from 'react';

export const useAdditionalState = () => {
  const [additionalState, setAdditionalState] = useState(0);

  const handleIncrement = () => {
    if (additionalState < 10) {
      setAdditionalState(additionalState + 1);
    }
  };

  const handleDecrement = () => {
    if (additionalState > 0) {
      setAdditionalState(additionalState - 1);
    }
  };

  return {
    additionalState,
    handleIncrement,
    handleDecrement,
  };
};
