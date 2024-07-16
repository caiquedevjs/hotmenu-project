
import React from 'react';
import ShoppingCart from '../modal_cart_itens/shoppingCart'; 
import './modal_cart_itens.css';
import './modal_cupom_desconto.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'



 //<------- Modal de cupom de desconto -------> 
const ModalCartItems = ({ cartItems, onClose }) => {
  return (
    <><div class="modal fade" id="modal_cupom_desconto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id='modal-body-cupom-desconto'>
            <input className='cupom-desconto-input' placeholder='digite seu cupom'
             data-tooltip-id="tooltip-bsucar-cupom"
             data-tooltip-content="busque um cupom para ultilizar"
             data-tooltip-place="right"
             data-tooltip-offset="5"></input> 
            <button className='btn-buscar-cupom'>buscar</button>
            <Tooltip id='tooltip-bsucar-cupom'></Tooltip>
          </div>
        </div>
      </div>
    </div>
    
    
    <div className="modal fade" id="modal_shoppingCart_id" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Carrinho de compras</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* <-------Renderiza o componente ShoppingCart com os itens do carrinho -------> */}
              <ShoppingCart items={cartItems} />
              
            </div>
            <div className="modal-footer">
            
            <div className='modal-footer-conteiner'>
            <strong><p className='Total-price-cart'>Preço Total:</p></strong>
            <div className='cart-btn-conteiner'>
            <button type="button" className="btn-compra">Finalizar compra</button>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-ticket-perforated-fill" viewBox="0 0 16 16" className='ticket-icons' data-tooltip-id="tooltip-cupom-desconto"
                data-tooltip-content="cumpom de desconto"
                data-tooltip-place="right"
                data-tooltip-offset="5"
                data-bs-toggle="modal" data-bs-target="#modal_cupom_desconto"
              >
                <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4-1v1h1v-1zm1 3v-1H4v1zm7 0v-1h-1v1zm-1-2h1v-1h-1zm-6 3H4v1h1zm7 1v-1h-1v1zm-7 1H4v1h1zm7 1v-1h-1v1zm-8 1v1h1v-1zm7 1h1v-1h-1z" />
              </svg>
            </div>
            
            </div>
              
              <Tooltip id='tooltip-cupom-desconto' />
            </div>
          </div>
        </div>
      </div></>
  );
};

export default ModalCartItems;
