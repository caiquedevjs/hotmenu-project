import React, { useState } from 'react';
import '../modal_products_component/modal_products_styles.css';
import useAdditionalState from './additionHandler';
import { Product_state } from '../grid_products_component/grid_products_component';

const Modal_product_component = ({ id, product, onClose }) => {
  // Encontrar o produto correto com base no ID recebido
  const selectedProduct = Product_state.products.find(p => p.id === product.id);

  // Utilizar o hook useAdditionalState passando a categoria do produto
  const { totalAdditional, additionalStates, handleIncrement, handleDecrement } = useAdditionalState(product.category);

  // Função para formatar o preço no formato 'R$ 30,00' -> 30.00
  const formatPrice = (price) => {
    return parseFloat(price.replace('R$ ', '').replace(',', '.'));
  };

  // Calcular o preço total do produto com base nos adicionais selecionados
  const calculateTotalPrice = () => {
    const productPrice = formatPrice(selectedProduct.price); // Converter o preço para número
    const additionalCost = totalAdditional * 2.50; // Custo adicional é multiplicado pelo total de adicionais
    return (productPrice + additionalCost).toFixed(2); // Somar e formatar o resultado para duas casas decimais
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">{product.title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className='product-img-options'>
              <img src={product.img} alt={product.title} className="img-fluid mb-3" />
            </div>
            <p>{product.description}</p>
            <h5><strong>Preço:</strong> R$ {calculateTotalPrice()}</h5>
            
            <div className='options-container'>
              <div className='options-container-head'>
                <h5>{product.category === 'pizza' ? 'Tamanho da pizza' : 'Adicionais'}</h5>
                <h6><span id='add'>{totalAdditional}</span>/{product.category === 'pizza' ? '1' : '10'}</h6>
              </div>
            </div>

            {additionalStates.map(additional => (
              <div key={additional.id} className='options-description-container'>
                <div className='options-additions'>
                  <p>{additional.description} - <span id='additional-value'>{additional.price}</span></p>
                </div>
                <div className='options-icons-plus-dash'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16" id='btn-plus' onClick={() => handleIncrement(additional.id)}>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                  </svg>
                  <span id='additional-value-increment'>{additional.count}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-square-fill" viewBox="0 0 16 16" id='btn-dash' onClick={() => handleDecrement(additional.id)}>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className='options-suggestion'>
              <h5>Alguma sugestão?</h5>
              <textarea className='suggestion-input' placeholder='alguma sugestão?'></textarea>
            </div>

            <button className='options-btn-add'>Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  );
};

export default Modal_product_component;
