import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, additionalStates, totalPrice, quantity) => {
    const existingItem = cartItems.find(item => item.product.Id === product.Id && JSON.stringify(item.additionalStates) === JSON.stringify(additionalStates));

       // <---------- Se o produto já existe, atualiza a quantidade e o preço total ---------->
                        
    if (existingItem) {           
      const updatedItems = cartItems.map(item => {
        if (item.product.Id === product.Id && JSON.stringify(item.additionalStates) === JSON.stringify(additionalStates)) {
          return {
            ...item,
            quantity: item.quantity + quantity,
            totalPrice: item.totalPrice + totalPrice
          };
        }
        return item;
      });
      setCartItems(updatedItems);
    } else {
      // <---------- Se o produto não existe, adiciona como um novo item ---------->
      //              Logica de verificação do produto com o mesmo ID, descrição e adicionais.
      setCartItems(prevItems => [
        ...prevItems,
        { product, additionalStates, totalPrice, quantity }
      ]);
    }
  };

  const removeFromCart = (index) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1); // <---------- Remove o item no índice especificado ---------->                                        
    setCartItems(updatedItems);    //             logica de remorção do produto pelo Index do arrey do carrinho de compras. 
  };

  const totalCartPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalCartPrice }}>
      {children}
    </CartContext.Provider>
  );
};
