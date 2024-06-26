import React from 'react';
import '../modal_products_component/modal_products_styles.css'
import {useAdditionalState} from './additionHandler'
const Modal_product_component = ({ id, product, onClose }) => {

  // importação da logica de incrementar adicionais 
  const { additionalState, handleIncrement, handleDecrement } = useAdditionalState();
  

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
            <h5><strong>Preço:</strong> {product.price}</h5>
            
            
            <div className='options-container'>
              <div className='options-container-head'>
                <h5>Adicionais</h5>
                <h6><span id='add'>{additionalState}</span>/10</h6>
              </div>
             
            </div>

            <div className='options-description-container'>
              <div className='options-additions'>
                <p>adicional - <span id='additional-value'>R$2,50</span></p>
              </div>
              <div className='options-icons-plus-dash'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16" id='btn-plus' onClick={handleIncrement}>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-square-fill" viewBox="0 0 16 16" id='btn-dash' onClick={handleDecrement}>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
                </svg>
              </div>
            </div>
            <div className='options-description-container'>
              <div className='options-additions'>
                <p>adicional - <span id='additional-value'>R$2,50</span></p>
              </div>
              <div className='options-icons-plus-dash'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16" id='btn-plus' onClick={handleIncrement}>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-square-fill" viewBox="0 0 16 16" id='btn-dash' onClick={handleDecrement}>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
                </svg>
              </div>
            </div>
            <div className='options-description-container'>
              <div className='options-additions'>
                <p>adicional - <span id='additional-value'>R$2,50</span></p>
              </div>
              <div className='options-icons-plus-dash'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16" id='btn-plus' onClick={handleIncrement}>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-square-fill" viewBox="0 0 16 16" id='btn-dash' onClick={handleDecrement}>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
                </svg>
              </div>
            </div>

            <div className='options-suggestion'>
              <h5>Alguma sugestão?</h5>
              <textarea className='suggestion-input' placeholder='alguma sugestão?'></textarea>
            </div>

            <button className='options-btn-add'> adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal_product_component;
