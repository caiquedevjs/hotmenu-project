
import React from 'react';
import ShoppingCart from './shoppingCart'; // Verifique o caminho correto do componente ShoppingCart

const ModalCartItems = ({ cartItems, onClose }) => {
  return (
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
            <button type="button" className="btn btn-primary">Finalizar compra</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCartItems;
