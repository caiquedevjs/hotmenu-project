/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Product_state } from '../grid_products_component/grid_products_component';
import Modal_product_component from '../modal_products_component/modal_products_component';
import './Grid_component.css';



const Grid_component = ({ category }) => {
  // Estado para controlar qual produto está selecionado para exibir no modal
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // Função para filtrar os produtos por categoria e dividir o array em linhas de 2 produtos
  const splitProductsIntoRows = (category) => {
    const filteredProducts = Product_state.products.filter(product => product.category === category);
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const row = filteredProducts.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  };

  // Função para abrir o modal com o produto selecionado
  const openModal = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="container text-center">
      {splitProductsIntoRows(category).map((row, rowIndex) => (
        <div key={rowIndex} className="row g-2 mb-2">
          {row.map((product, colIndex) => (
            <div key={colIndex} className="col-sm-12 col-md-6">
              <div className="container-sm">
                <div id='card_container'>
                  <div id='text_category'>
                    {/* Adicionando evento para abrir o modal com o produto clicado */}
                    <div className='product-conteiner'>
                      <div className='product-description'>
                      <h3 data-bs-toggle="modal" data-bs-target={`#product-modal-${product.id}`} onClick={() => openModal(product)} id='product-title'>{product.title}</h3>
                      <p>{product.priceDemo}</p>
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
          onClose={() => setSelectedProduct(null)} // Função para fechar o modal ao clicar fora dele
        />
      ))}
    </div>
  );
};

export default Grid_component;
