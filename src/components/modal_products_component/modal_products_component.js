import React, { useState, useEffect, useContext } from 'react';
import '../modal_products_component/modal_products_styles.css';
import useAdditionalState from './additionHandler';
import { CartContext } from '../modal_cart_itens/CartContext';
import { fetchEstabelecimentoData } from '../service/productService';
import '../modal_products_component/PerguntasComponent.css';
import { Tooltip } from 'react-tooltip';
import { useParams } from 'react-router-dom'; // Importando useParams para capturar o nome do estabelecimento

const Modal_product_component = ({ id, product, onClose }) => {
  const { totalAdditional, additionalStates, handleIncrement, handleDecrement, getSelectedTamanho  } = useAdditionalState(product.Id);
  const { addToCart } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Captura o nome do estabelecimento da URL
  const { storeName } = useParams();

  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData(storeName); // Passa o nome do estabelecimento para a função
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
  }, [storeName]); // Dependência de storeName para refazer a busca ao mudar o nome do estabelecimento

  useEffect(() => {
    if (product && product.PrecoDeVenda) {
      setTotalPrice(parseFloat(product.PrecoDeVenda));
    }
  }, [product]);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [additionalStates, quantity]);

 const calculateTotalPrice = () => {
  const selectedTamanho = getSelectedTamanho();
  let basePrice = selectedTamanho
    ? parseFloat(selectedTamanho.PrecoDeVenda)
    : parseFloat(product.PrecoDeVenda);

  let totalPrice = basePrice;

  additionalStates.forEach(additional => {
    additional.options.forEach(option => {
      if (option.count > 0) {
        totalPrice += option.count * parseFloat(option.price);
      }
    });

    additional.produtos.forEach(produto => {
      if (produto.count > 0) {
        if (!(product.EhCombo && additional.required)) {
          totalPrice += produto.count * parseFloat(produto.PrecoDeVenda);
        }
      }
    });
  });

  totalPrice *= quantity;
  return totalPrice.toFixed(2);
};
  const validateRequiredAdditions = () => {
    const allRequiredMet = additionalStates.every(additional => {
      if (additional.required) {
        return additional.selectedCount >= additional.minOptions;
      }
      return true;
    });

    setIsButtonDisabled(!allRequiredMet);
  };

  useEffect(() => {
    validateRequiredAdditions();
  }, [additionalStates]);

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  const handleAddToCart = () => {
    if (!isButtonDisabled) {
      const totalPrice = calculateTotalPrice();
      addToCart(product, additionalStates, parseFloat(totalPrice), quantity, suggestion);
      onClose();
    }
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
            <h5><strong>Preço:</strong> R$ {formatPrice(product.PrecoDeVenda)}</h5>

            <div className="perguntas-container">
              {additionalStates.map(additional => (
                <div key={additional.id} className="pergunta-card">
                  <div className="pergunta-header">
                    <div className='pergunta-title-conteiner'>
                      <h3 className="pergunta-title">{additional.description}</h3>
                      <p className='max-option-text'>{`Escolha até ${additional.maxOptions} opções.`}</p>
                    </div>
                    
                    <span className="pergunta-info">
                      {additional.selectedCount} / {additional.maxOptions} 
                      {additional.required ? " (Obrigatório)" : " (Opcional)"}
                    </span>
                  </div>

                  {/* Renderiza opções de observações como botões de rádio se for do tipo 1 */}
                  {additional.type === 1 && additional.observacao.length > 0 && (
                    <div className='observacoes'>
                        {additional.observacao.map(obs => (
                        <label key={obs.Id} className="observacao-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <input 
                              type="radio" 
                              name={`observacao_${additional.id}`} 
                              onChange={() => handleIncrement(obs.Id, additional.id)} 
                              checked={obs.selected || false}
                            />
                            <span style={{ marginLeft: '8px' }}>{obs.Nome}</span>
                          </div>
                          <div>
                            R$ {obs.PrecoDeVenda ? obs.PrecoDeVenda.toFixed(2).replace('.', ',') : '0,00'}
                          </div>
                        </label>
                      ))}

                    </div>
                  )}

                  {/* Renderiza opções de complemento */}
                  
{additional.options.length > 0 && (
  <div className='options-container'>
    {additional.options.map(option => (
      <div className='option-item' key={option.id}>
        <div className='option-info'>
          <p className="option-name">{option.name}</p>
          <p className="option-price">
            R$ {option.PrecoPromo ? option.PrecoPromo.toFixed(2).replace('.', ',') : option.price.toFixed(2).replace('.', ',')}
          </p>
        </div>

        <div className='options-icons'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-plus-circle-fill"
            viewBox="0 0 16 16"
            onClick={() => handleIncrement(option.id, additional.id)} // Passando o id da pergunta
            disabled={option.count === option.QtdMaximaPermitida}
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
          </svg>
          <span className="option-count">{option.count}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-dash-circle-fill"
            viewBox="0 0 16 16"
            onClick={() => handleDecrement(option.id, additional.id)} // Passando o id da pergunta
            disabled={option.count === 0}
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
          </svg>
        </div>
      </div>
    ))}
  </div>
)}

                  
                  {/* Renderiza produtos com incremento e decremento */}
                  {additional.produtos && additional.produtos.length > 0 && (
                    <div className='options-container'>
                      {additional.produtos.map(produto => (
                        <div className='option-item' key={produto.Id}>
                          <div className='option-info'>
                            <p className="option-name">{produto.Nome}</p>
                            <p className="option-price">
                              R$ {produto.PrecoDeVenda.toFixed(2).replace('.', ',')}
                            </p>
                          </div>

                          <div className='options-icons'>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-plus-circle-fill"
                              viewBox="0 0 16 16"
                              onClick={() => handleIncrement(produto.Id, additional.id, true)} 
                              disabled={produto.count === produto.QtdMaximaPermitida}
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                            </svg>
                            <span className="option-count">{produto.count || 0}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-dash-circle-fill"
                              viewBox="0 0 16 16"
                              onClick={() => handleDecrement(produto.Id, additional.id, true)} 
                              disabled={produto.count === 0}
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='options-suggestion'>
            <h5>Alguma sugestão?</h5>
            <textarea
              className='suggestion-input'
              placeholder='alguma sugestão? 😋'
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
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
          <button className='options-btn-add' data-bs-dismiss="modal" aria-label="Close" 
          style={{ backgroundColor : color}} 
          onClick={handleAddToCart}  
          disabled={isButtonDisabled}
          data-tooltip-id="adicione-ao-carrinho-id"
          data-tooltip-content={
            isButtonDisabled
              ? "Selecione todas as opções obrigatórias"
              : "Adicionar ao carrinho"
          } 
          data-tooltip-place="top-start"
          >Adicionar ao carrinho</button>
           <Tooltip id='adicione-ao-carrinho-id'></Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Modal_product_component;
