import React, { useState, useEffect, useContext } from 'react';
import '../modal_products_component/modal_products_styles.css';
import useAdditionalState from './additionHandler';
import { CartContext } from '../modal_cart_itens/CartContext';

const Modal_product_component = ({ id, product, onClose, categoryName }) => {
  const { totalAdditional, additionalStates, handleIncrement, handleDecrement } = useAdditionalState(categoryName);
  const { addToCart } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.PrecoDeVenda) {
      setTotalPrice(parseFloat(product.PrecoDeVenda));
    }
  }, [product]);

  const calculateTotalPrice = () => {
    if (!product || !product.PrecoDeVenda) {
      return "0.00";
    }

    let totalPrice = parseFloat(product.PrecoDeVenda);

    additionalStates.forEach(additional => {
      totalPrice += additional.count * parseFloat(additional.price);
    });

    totalPrice *= quantity;
    return totalPrice.toFixed(2);
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotalPrice();
    addToCart(product, additionalStates, parseFloat(totalPrice), quantity);
    onClose();
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">{product.Nome}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className='product-img-options'>
              <img src={`https://hotmenu.com.br/arquivos/${product.Foto}`} alt={product.Nome} id='product-img-modal' />
            </div>
            <p id='pruduct-description-p'>{product.Descricao}</p>
            <h5><strong>Preço:</strong> R$ {product.PrecoDeVenda}</h5>

            <div className='options-container'>
              <div className='options-container-head'>
                <h5>Adicionais</h5>
                <h5>{totalAdditional()}/10</h5>
              </div>
            </div>

            {additionalStates.map(additional => (
              <div key={additional.id} className='options-description-container'>
                <div className='options-additions'>
                  <p>{additional.description} - R$ {additional.price}</p>
                </div>
                <div className='options-icons-plus-dash'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16" id='btn-plus' onClick={() => handleIncrement(additional.id)} disabled={additional.count === 3 || totalAdditional() === 10}>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                  </svg>
                  <span>{additional.count}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-square-fill" viewBox="0 0 16 16" id='btn-dash' onClick={() => handleDecrement(additional.id)} disabled={additional.count === 0}>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className='options-suggestion'>
            <h5>Alguma sugestão?</h5>
            <textarea className='suggestion-input' placeholder='alguma sugestão?'></textarea>
          </div>
          <h5><strong>Preço Total:</strong> R$ {calculateTotalPrice()}</h5>
          <div className="quantity-control">
            <button className="btn-decrement" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
            <span>{quantity}</span>
            <button className="btn-increment" onClick={() => setQuantity(prev => prev + 1)}>+</button>
          </div>
          <button className='options-btn-add' onClick={handleAddToCart}>Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  );
};

export default Modal_product_component;
