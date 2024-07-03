import React from 'react';
import '../modal_products_component/modal_products_styles.css';
import useAdditionalState from './additionHandler';
import { Product_state } from '../grid_products_component/grid_products_component';

const Modal_product_component = ({ id, product, onClose, addToCart }) => {

  // <-------- Variavel de verificação de busca pelo id, para acionar modais dinâmicos -------->
  const selectedProduct = Product_state.products.find(p => p.id === product.id);


   // <------ estados do banco de adicionais ------>
  const { totalAdditional, additionalStates, handleIncrement, handleDecrement } = useAdditionalState(product.category);



// <--------  Função para formatar o o texto do preço do produto em valor nuerico -------->
  const formatPrice = (price) => {
    if (typeof price !== 'string') {
      return 0;
    }
    return parseFloat(price.replace('R$ ', '').replace(',', '.')) || 0;
  };



// <-------- Função para calcular o valor total do produto com adicionais -------->
  const calculateTotalPrice = () => {
    const productPrice = formatPrice(selectedProduct.price);

    if (isNaN(productPrice)) {
      return "0.00";
    }

    let additionalCost = 0;
    additionalStates.forEach(additional => {
      additionalCost += additional.count * parseFloat(additional.price);
    });

    const totalPrice = productPrice + additionalCost;
    return totalPrice.toFixed(2);
  };

  const handleAddToCart = () => {
    const newItem = {
      id: selectedProduct.id,
      title: selectedProduct.title,
      price: calculateTotalPrice(),
      img: selectedProduct.img,
      description: selectedProduct.description,
      quantity: 1 // <--------- você pode ajustar conforme necessário
    };

    addToCart(newItem);
    onClose(); // <---------- fechar modal após adicionar ao carrinho
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
              <img src={product.img} alt={product.title} className="img-fluid mb-3" id='product-img-modal' />
            </div>
            <p>{product.description}</p>
            <h5><strong>Preço:</strong> R$ {calculateTotalPrice()}</h5>

            <div className='options-container'>
              <div className='options-container-head'>
                <h5>{product.category === 'pizza' ? 'Tamanho da pizza' : 'Adicionais'}</h5>
                <h6><span id='add'>{totalAdditional}</span>/{product.category === 'pizza' ? '1 - obrigatorio' : '10 opcional'}</h6>
              </div>
            </div>

            {additionalStates.map(additional => (
              <div key={additional.id} className='options-description-container'>
                <div className='options-additions'>
                  <p>{additional.description} - R$ <span id='additional-value'>{additional.price}</span></p>
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

          <button className='options-btn-add' onClick={handleAddToCart}>Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  );
};

export default Modal_product_component;
