import React, { useState, useEffect, useContext } from 'react';
import '../modal_products_component/modal_products_styles.css';
import useAdditionalState from './additionHandler';
import { CartContext } from '../modal_cart_itens/CartContext';
import { fetchEstabelecimentoData } from '../service/productService';

const Modal_product_component = ({ id, product, onClose }) => {
  const { totalAdditional, additionalStates, handleIncrement, handleDecrement } = useAdditionalState(id);
  const { addToCart } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData();
        if (data && data.CorPadrao) {
          setEstabelecimento(data);
          setColor(data.CorPadrao);
        } else {
          setError('Nenhum dado recebido da API');
        }
      } catch (error) {
        setError('Erro ao buscar dados do estabelecimento');
        console.error('Erro na busca: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataEstabelecimento();
  }, []);

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

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotalPrice();
    addToCart(product, additionalStates, parseFloat(totalPrice), quantity);
    onClose();
  };
// Logs para depuração
useEffect(() => {
  console.log('ID do Produto:', id);
  console.log('Dados do Produto:', product);
  console.log('Estados Adicionais:', additionalStates);
  console.log('Preço Total:', totalPrice);
}, [id, product, additionalStates, totalPrice]);
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
            <h5><strong>Preço:</strong> R$ {formatPrice(product.PrecoDeVenda)}</h5>

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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16" onClick={() => handleIncrement(additional.id)} disabled={additional.count === 3 || totalAdditional() === 10}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                  </svg>
                  <span>{additional.count}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16" onClick={() => handleDecrement(additional.id)} disabled={additional.count === 0}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className='options-suggestion'>
            <h5>Alguma sugestão?</h5>
            <textarea className='suggestion-input' placeholder='alguma sugestão?'></textarea>
          </div>
          <div className='control-price-total'>
            <div className="quantity-control" style={{border : `2px solid ${color}`}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
              </svg>
              <span>{quantity}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16" onClick={() => setQuantity(prev => prev + 1)}>
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
              </svg>
            </div>
            <h5> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-tag-fill" viewBox="0 0 16 16" style={{'color': color}}>
              <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg><strong> Total:</strong> R$ {calculateTotalPrice()}</h5>
          </div>
          <button className='options-btn-add' data-bs-dismiss="modal" aria-label="Close" style={{ backgroundColor : color}} onClick={handleAddToCart}>Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  );
};

export default Modal_product_component;
