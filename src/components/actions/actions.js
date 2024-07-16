export const addToCart = (product) => {
    return {
      type: 'ADD_TO_CART',
      payload: product
    };
  };
  
  export const removeFromCart = (itemId) => {
    return {
      type: 'REMOVE_FROM_CART',
      payload: itemId
    };
  };
  