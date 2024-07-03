// ShoppingCart.jsx
import React from 'react';
import '../modal_cart_itens/shoppingCart_styles.css';

const ShoppingCart = ({ items }) => {
  return (
    <div className='itens-shopping-conteiner'>
      {items.map(item => (
        <div key={item.id} className='itens-img-conteiner'>
          <div className='product-cart-description'>
          <img src={item.img} alt={item.title} className='img-product-cart' />
          <div className='itens-description-conteiner'>
            <p>{item.title}</p>
            <p>Preço: R$ {item.price}</p>
            <p>Quantidade: {item.quantity}</p>
          </div>
          </div>
          <div className='btn-conteiner'>
          <button className='btn-dash-product-cart'>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-dash-square-fill" viewBox="0 0 16 16" id='dash-iten'>
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
          </svg>
          </button>
          </div>
         
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;
