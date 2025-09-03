// Nome do arquivo: modal_products_component.js
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Tooltip } from 'react-tooltip';
import { useParams } from 'react-router-dom';
import useAdditionalState from './additionHandler';
import { CartContext } from '../modal_cart_itens/CartContext';
import { fetchEstabelecimentoData } from '../service/productService';
import useHover from '../../utils/headerHoverHandlers';
import './modal_products_styles.css';
import './PerguntasComponent.css';

const Modal_product_component = ({ product, show, handleClose }) => {
  const { additionalStates, handleIncrement, handleDecrement, getSelectedTamanho, calcularPrecoAdicionais } = useAdditionalState(product?.Id);
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const productHover = useHover();
  const { storeName } = useParams();

  useEffect(() => {
    setQuantity(1);
    setSuggestion("");
  }, [product]);

  useEffect(() => {
    const fetchDataEstabelecimento = async () => { if (storeName) { try { const data = await fetchEstabelecimentoData(storeName); if (data && data.CorPadrao) { setEstabelecimento(data); setColor(data.CorPadrao); } else { setError('Nenhum dado recebido da API'); } } catch (error) { setError('Erro ao buscar dados do estabelecimento'); console.error('Erro na busca: ', error); } finally { setLoading(false); } } };
    fetchDataEstabelecimento();
  }, [storeName]);

  const totalPrice = useMemo(() => { if (!product) return '0.00'; const selectedTamanho = getSelectedTamanho(); const basePrice = selectedTamanho ? parseFloat(selectedTamanho.PrecoDeVenda) : parseFloat(product.PrecoDeVenda); const adicionaisPreco = calcularPrecoAdicionais(); const total = (basePrice + adicionaisPreco) * quantity; return total.toFixed(2); }, [additionalStates, quantity, product, getSelectedTamanho, calcularPrecoAdicionais]);
  const isButtonDisabled = useMemo(() => { if (!product) return true; return !additionalStates.every(additional => { if (additional.required) { return additional.selectedCount >= additional.minOptions; } return true; }); }, [additionalStates, product]);
  const formatPrice = (price) => { if (typeof price !== 'number') return '0,00'; return price.toFixed(2).replace('.', ','); };
  
  // ✅ CORREÇÃO AQUI
  const handleAddToCart = useCallback(() => { if (!isButtonDisabled) { addToCart(product, additionalStates, parseFloat(totalPrice), quantity, suggestion); handleClose(); } }, [isButtonDisabled, product, additionalStates, totalPrice, quantity, suggestion, addToCart, handleClose]);

  if (!product) {
    return null;
  }

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{product.Nome}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column">
        {/* Conteúdo principal com rolagem */}
        <div className="flex-grow-1" style={{ overflowY: 'auto', paddingBottom: '1rem' }}>
          <div className='product-img-options'>
            <img src={`https://hotmenu.com.br/arquivos/${product.Foto}`} alt={product.Nome} id='product-img-modal' />
          </div>
          <p id='pruduct-description-p'>{product.Descricao}</p>
          <h5><strong>Preço:</strong> R$ {formatPrice(product.PrecoDeVenda)}</h5>
          <div className="perguntas-container">
            {additionalStates.map(additional => (
              <div key={additional.id} className="pergunta-card">
                <div className="pergunta-header">
                  <div className='pergunta-title-conteiner'><h3 className="pergunta-title">{additional.description}</h3><p className='max-option-text'>{`Escolha até ${additional.maxOptions} opções.`}</p></div>
                  <span className="pergunta-info">{additional.selectedCount} / {additional.maxOptions}{additional.required ? " (Obrigatório)" : " (Opcional)"}</span>
                </div>
                {/* Renderização das opções */}
                {additional.type === 1 && additional.observacao.length > 0 && ( <div className='observacoes'>{additional.observacao.map(obs => ( <label key={obs.Id} className="observacao-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><input type="radio" name={`observacao_${additional.id}`} onChange={() => handleIncrement(obs.Id, additional.id)} checked={obs.selected || false} /><span style={{ marginLeft: '8px' }}>{obs.Nome}</span></div><div>R$ {obs.PrecoDeVenda ? obs.PrecoDeVenda.toFixed(2).replace('.', ',') : '0,00'}</div></label>))}</div>)}
                {additional.options.length > 0 && ( <div className='options-container'>{additional.options.map(option => ( <div className='option-item' key={option.id}><div className='option-info'><p className="option-name">{option.name}</p><p className="option-price">R$ {option.PrecoPromo ? option.PrecoPromo.toFixed(2).replace('.', ',') : option.price.toFixed(2).replace('.', ',')}</p></div><div className='options-icons'><svg onClick={() => handleDecrement(option.id, additional.id)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/></svg><span className="option-count">{option.count}</span><svg onClick={() => handleIncrement(option.id, additional.id)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg></div></div>))}</div>)}
                {additional.produtos && additional.produtos.length > 0 && ( <div className='options-container'>{additional.produtos.map(produto => ( <div className='option-item' key={produto.Id}><div className='option-info'><p className="option-name">{produto.Nome}</p><p className="option-price">R$ {produto.PrecoDeVenda.toFixed(2).replace('.', ',')}</p></div><div className='options-icons'><svg onClick={() => handleDecrement(produto.Id, additional.id, true)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/></svg><span className="option-count">{produto.count || 0}</span><svg onClick={() => handleIncrement(produto.Id, additional.id, true)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg></div></div>))}</div>)}
              </div>
            ))}
          </div>
        </div>
        {/* Rodapé fixo */}
        <div className="offcanvas-footer mt-auto pt-3 border-top">
          <div className='options-suggestion'><h5>Alguma sugestão?</h5><textarea className='suggestion-input' placeholder='Ex: tirar a cebola, maionese à parte...' value={suggestion} onChange={(e) => setSuggestion(e.target.value)} /></div>
          <div className='control-price-total'>
            <div className="quantity-control" style={{ border: `2px solid ${color}` }}><svg onClick={() => setQuantity(prev => Math.max(1, prev - 1))} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-dash-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/></svg><span>{quantity}</span><svg onClick={() => setQuantity(prev => prev + 1)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg></div>
            <h5><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-tag-fill" viewBox="0 0 16 16" style={{'color': color}}><path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg><strong> Total:</strong> R$ {totalPrice.replace('.', ',')}</h5>
          </div>
          <button className='options-btn-add' style={{ backgroundColor: productHover.isHovered ? '#332D2D' : color, width: '100%' }} onMouseEnter={productHover.handleMouseEnter} onMouseLeave={productHover.handleMouseLeave} onClick={handleAddToCart} disabled={isButtonDisabled}>Adicionar ao carrinho</button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Modal_product_component;