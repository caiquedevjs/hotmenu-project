import React from 'react';
import '../modal_products_component/modal_products_styles.css'

const Modal_product_component = ({ id, product, onClose }) => {
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
            
            <p><strong>Preço:</strong> {product.price}</p>
            {/* Outros detalhes do produto, se necessário */}
            <div className='options-conteiner'>
            <div className='options-conteiner-head'>
                <h5>Adicionais</h5>
               </div>
              <h6>0/10</h6>
            </div>
            <div className='opitions-description-conteiner'>
              <div className='options-adtions'>
                <p>adicional - <span id='adtional-value'>R$2,50</span></p>
              </div>
              <div className='opitions-icons-plus-dash'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16" id='btn-plus'>
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16" id='btn-dash'>
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
              </svg>
              </div>
            </div>
            <div className='options-sugestion'>
              <h5>Alguma sugestão?</h5>
            <textarea className='sugestion-input' placeholder='alguma sugestão?'></textarea>
            </div>
            <button className='options-btn-add'> adicionar ao carrinho</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Modal_product_component;
