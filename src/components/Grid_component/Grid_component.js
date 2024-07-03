/* eslint-disable react/jsx-pascal-case */
// Grid_component.jsx
import React, { useState } from 'react';
import { Product_state } from '../grid_products_component/grid_products_component';
import Modal_product_component from '../modal_products_component/modal_products_component';
import './Grid_component.css';
import ModalCartItems from '../modal_cart_itens/modal_cart_itens'; 

const Grid_component = ({ category }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // <-----Função para adicionar um novo item ao carrinho ---->
  const addToCart = (newItem) => {
    setCartItems([...cartItems, newItem]);
  };




  // <-----Função para fechar o modal do carrinho ---->
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  // <---------------Função para filtrar os produtos por categoria e dividir o array em linhas de 2 produtos --------------->
  const splitProductsIntoRows = (category) => {
    const filteredProducts = Product_state.products.filter(product => product.category === category);
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const row = filteredProducts.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  };




  // <---------------Função para abrir o modal com o produto selecionado--------------->
  const openModal = (product) => {
    setSelectedProduct(product);
  };



  // Renderiação do Componente
  return (
    <div className="container text-center">
      {/* Renderiza o ModalCartItems e passa os items do carrinho como prop */}
      <ModalCartItems cartItems={cartItems} onClose={handleCloseCart} />



      {splitProductsIntoRows(category).map((row, rowIndex) => (
        <div key={rowIndex} className="row g-2 mb-2">
          {row.map((product, colIndex) => (
            <div key={colIndex} className="col-sm-12 col-md-6">
              <div className="container-sm">
                <div id='card_container'>
                  <div id='text_category'>
                    <div className='product-conteiner'>
                      <div className='product-description'>
                        <p data-bs-toggle="modal" data-bs-target={`#product-modal-${product.id}`} onClick={() => openModal(product)} id='product-title'>{product.title}</p>
                        <p className='product-description-title'>{product.description}</p>
                        <strong><p>{product.priceDemo}</p></strong> 
                      </div>
                      <img src={product.img} alt={product.title} className='product-img' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Modais dinâmicos para cada produto */}
      {Product_state.products.map((product, index) => (
        <Modal_product_component
          key={`modal-${index}`}
          id={`product-modal-${product.id}`}
          product={product}
          addToCart={addToCart}
          onClose={() => setSelectedProduct(null)} // <----------Função para fechar o modal ao clicar fora dele
        />
      ))}
    </div>
  );
};

export default Grid_component;
