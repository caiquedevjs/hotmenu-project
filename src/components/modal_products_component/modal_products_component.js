import React from 'react';
import '../modal_products_component/modal_products_styles.css';
import useAdditionalState from './additionHandler';

const Modal_product_component = ({ id, product, onClose, addToCart, categoryName }) => {
  // Estados do banco de adicionais
  const { totalAdditional, additionalStates, handleIncrement, handleDecrement } = useAdditionalState(categoryName);

  // Função para formatar o texto do preço do produto em valor numérico
  const formatPrice = (price) => {
    if (typeof price !== 'string') {
      return 0;
    }
    return parseFloat(price.replace('R$ ', '').replace(',', '.')) || 0;
  };

  // Função para calcular o valor total do produto com adicionais
  const calculateTotalPrice = () => {
    if (!product) {
      return "0.00"; // Retorna um valor padrão caso o produto não esteja definido
    }

    const productPrice = formatPrice(product.PrecoDeVenda);

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

  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    if (!product) {
      return; // Não faz nada se o produto não estiver definido
    }

    const newItem = {
      id: product.Id,
      title: product.Nome,
      price: calculateTotalPrice(),
      img: `https://hotmenu.com.br/arquivos/${product.Foto}`,
      description: product.Descricao,
      quantity: 1 // Quantidade padrão, pode ser ajustada conforme necessário
    };

    addToCart(newItem);
    onClose(); // Fecha o modal após adicionar ao carrinho
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
              <img src={`https://hotmenu.com.br/arquivos/${product.Foto}`} alt={product.Nome} className="img-fluid mb-3" id='product-img-modal' />
            </div>
            <p>{product.Descricao}</p>
            <h5><strong>Preço:</strong> R$ {product.PrecoDeVenda}</h5>

            <div className='options-container'>
              <div className='options-container-head'>
                <h5>{categoryName === 'pizza' ? 'Tamanho da pizza' : 'Adicionais'}</h5>
              </div>
            </div>

            {additionalStates.map(additional => (
              <div key={additional.id} className='options-description-container'>
                <div className='options-additions'>
                  <p>{additional.description} - R$ {additional.price}</p>
                </div>
                <div className='options-icons-plus-dash'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16" id='btn-plus' onClick={() => handleIncrement(additional.id)}>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                  </svg>
                  <span>{additional.count}</span>
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
