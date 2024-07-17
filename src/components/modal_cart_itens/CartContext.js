import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, additionalStates, totalPrice, quantity) => {
    const existingItem = cartItems.find(item => item.product.Id === product.Id && JSON.stringify(item.additionalStates) === JSON.stringify(additionalStates));

    if (existingItem) {
      // Se o produto já existe, atualiza a quantidade e o preço total
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
      // Se o produto não existe, adiciona como um novo item
      setCartItems(prevItems => [
        ...prevItems,
        { product, additionalStates, totalPrice, quantity }
      ]);
    }
  };

  const totalCartPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, totalCartPrice }}>
      {children}
    </CartContext.Provider>
  );
};
