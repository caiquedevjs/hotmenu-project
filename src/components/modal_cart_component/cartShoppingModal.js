/* eslint-disable jsx-a11y/anchor-is-valid */

// <------- import hooks and context------->
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../modal_cart_itens/CartContext'



// <------- import css------->
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import '../header_component/modal_cart_itens.css'


import 'react-toastify/dist/ReactToastify.css';

// <------- import react icons, assets, toaltip and toast ------->
import { FaSearch,FaShoppingCart } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";
import { Tooltip } from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import SoundMessage from '../../assets/sounds/message.wav';
import InputMask from 'react-input-mask';
import { Nav, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

// <------- import utils------->
import { fetchFormaPagamentos,fetchEstabelecimentoData } from '../service/productService';
import  useHover  from '../../utils/headerHoverHandlers';
import useScrollToTopButton from '../../utils/scrollHandler';
import truncateText from '../../utils/truncateText';





const Header_component = () =>{

 // <------ constantes utils ------->
  const cartHover = useHover();
  const searchHover = useHover();
  const comprarButtonHover = useHover();
  const cupomButtonHover = useHover();
  const finalizarButtonHover = useHover();
  const cancelarButtonHover = useHover();
  const { isIconsFixed} = useScrollToTopButton();
  const truncate_Text = (text) => truncateText(text, 40)

// <------- contexto do carrinho ------->
const { cartItems, totalCartPrice, removeFromCart, isOpen} = useContext(CartContext);
const { storeName } = useParams();

// <------ estados ------->
const [formasPorTipo, setFormasPorTipo] = useState({});
const [formasSemTipo, setFormasSemTipo] = useState({});
const [estabelecimento, setEstabelecimento] = useState(null);
const [deliveryOptions, setDeliveryOptions] = useState({ pickup: false, home: false, mesa: false})
const [pagamentoOptions, setPagamentoOptions] = useState({pagamentoOnline : false, pagamentoNaRetirada : null})
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [color, setColor] = useState('');
const [logoMarca, setLogoMarca] = useState('');
const [fotoCard, setFotoCard] = useState('');
const [fotoCard2,setFotoCard2] = useState('');
const [fotoCard3, setFotoCard3] = useState('');
const [fotoCard4, setFotoCard4] = useState('');
const [fotoCard5, setFotoCard5] = useState('');
const [pixKey, setPixKey] = useState(``);
const [FreteFixo,setFreteFixo] = useState('');
const [Fretefuncao, setFreteFuncao] = useState('');
const [descontoAplicado, setDescontoAplicado] = useState(0);
const [valorTroco, setValorTroco] = useState(0);
const [cupom, setCupom] = useState('');
const [celular, setCelular] = useState('');
const [estebelecimentoId, setEstabelecimentoId] = useState('');
const [mensagem, setMensagem] = useState('');
const [fontSize, setFontSize] = useState('16px'); // Tamanho de fonte padrão
const [activeTab, setActiveTab] = useState('pickup');
const [activeTabCard, setActiveTabCard] = useState('pagamentoOnline ');







// <------ estados do formulario, valor total do pedido------->  
const [valorTotalPedido, setValorTotalPedido] = useState();
const [valorVendaMinima, setValorVendaMinima] = useState(0);
const [list, setList] = useState([]);
const [nome, setNome] = useState('');
const [telefone, setTelefone] = useState('');
const [endereco, setEndereco] = useState('');
const [complemento, setComplemento] = useState('');
const [bairro, setBairro] = useState('');
const [cep, setCep] = useState('');
const [cartao, setCartao] = useState('');
const [titular, setTitular] = useState('');
const [vencimento, setVencimento] = useState('');
const [cvc, setCvc] = useState('');
const [mesa, setMesa] = useState('');
const [selectedOption, setSelectedOption] = useState('');
const [isFormValid, setIsFormValid] = useState(false);
const [isValid, setIsValid] = useState(true);
const [errorCard, setErrorCard] = useState('');
const [checkedOptions, setCheckedOptions] = useState({});
const [showCupomModal, setShowCupomModal] = useState(false);
const [showFinalizarModal, setShowFinalizarModal] = useState(false);


// <---------- Notificações ---------->
const sound = new Audio(SoundMessage)
const notify = () => toast.success(`Olá ${nome} 👋, seu pedido foi feito com sucesso! 🍔🍟 `,{theme: 'dark'});
const notify02 = () => toast.success('Você receberá o status do pedido pelo WhatsApp. ⏱️ ', {theme: 'dark'});



 
// <------ função para redimensionar o texto fretis gratis em relação a tela ------>
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 360) {
        setFontSize('9px');
      } else if (window.innerWidth <= 768) {
        setFontSize('11px');
      } else {
        setFontSize('13px');
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



//---------------------------------------------------------------------------------------------------------------------------------------------------------


  // <------ renderização das formas de pagamentos ------->
 
  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetchFormaPagamentos(storeName);
              if (response && response.FormasDePagamento) {
                  const formasByTipo = {};
                  const formasSemTipo = {};
                  response.FormasDePagamento.forEach((curr) => {
                      if (curr.Tipo) {
                          if (!formasByTipo[curr.Tipo]) {
                              formasByTipo[curr.Tipo] = [];
                          }
                          formasByTipo[curr.Tipo].push(curr);
                      } else {
                          if (!formasSemTipo[curr.Nome]) {
                              formasSemTipo[curr.Nome] = [];
                          }
                          formasSemTipo[curr.Nome].push(curr);
                      }
                  });
                  setFormasPorTipo(formasByTipo);
                  setFormasSemTipo(formasSemTipo);
              }
          } catch (error) {
              console.error('Erro ao buscar formas de pagamento:', error);
          }
      };

      fetchData();
  }, [storeName]);
 

useEffect(() => {
  const fetchDataEstabelecimento = async () => {
    try {
      const response = await fetchEstabelecimentoData(storeName);
      console.log('Resposta da API:', response); // Verifique se os dados estão completos
      if (response) {
        // Confirme se os campos realmente existem
        console.log('Logomarca:', response.Logomarca);
        console.log('Nome:', response.Nome);
        setEstabelecimento(response);
        setColor(response.CorPadrao);
        setLogoMarca(response.Logomarca);
        setFotoCard(response.FotoCard1);
        setFotoCard2(response.FotoCard2);
        setFotoCard3(response.FotoCard3);
        setFotoCard4(response.FotoCard4);
        setFotoCard5(response.FotoCard5);
        setEstabelecimentoId(response.Id);
        setCelular(response.TelContato);
        setFreteFixo(response.ValorFreteFixo);
        setFreteFuncao(response.FreteFixo); 
        setPagamentoOptions({
          pagamentoOnline: response.PgtoOnLine,
          pagamentoNaRetirada : response.PgtoRetiradaLocal
        });
        setDeliveryOptions({
          pickup: response.RetiradaNaLoja,
          home: response.Delivery,
          mesa : response.Mesa
        });
        setPixKey(response.ChavePix);
        setValorVendaMinima(response.LimiteVendaMinima);
      } else {
        setError('Nenhum dado recebido da API');
      }
    } catch (error) {
      setError('Erro ao buscar dados do estabelecimento');
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  if (storeName) {
    fetchDataEstabelecimento();
  }
}, [storeName]);



  // <---------- Função para formatar o preço ---------->
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

 
 


const handleCloseModal = () => {
  setShowFinalizarModal(false);
  document.body.classList.remove('modal-open'); // Remove a classe que impede o scroll
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.remove(); // Remove o backdrop manualmente
  }
};


// <---------- Função para calcular o preço com frete  ---------->
const totalPriceWithFrete = () => {
  const cartTotal = parseFloat(totalCartPrice().replace(',', '.'));
  let totalComDesconto = cartTotal;

  // Aplicar desconto, se houver
  if (descontoAplicado > 0) {
    const descontoValor = totalComDesconto * (descontoAplicado / 100);
    totalComDesconto -= descontoValor;
  }

  // Calcular o frete
  if (estabelecimento) {
    if (estabelecimento.PromocaoFreteGratis && cartTotal >= estabelecimento.ValorFreteGratisAcimaDe) {
      return totalComDesconto.toFixed(2).replace('.', ','); 
    } else if (estabelecimento.FreteFixo) {
      const totalComFrete = totalComDesconto + estabelecimento.ValorFreteFixo;
      return totalComFrete.toFixed(2).replace('.', ','); 
    }
  }
  return totalComDesconto.toFixed(2).replace('.', ','); 
};





// <------ função para adicionar os itens do carrinho a lista de pedido ------->
const handleAddPedido =() =>{
  if(totalCartPrice() < valorVendaMinima){
    toast.error(`Valor minimo para compra: ${valorVendaMinima}`);
   }
   else{
    setList(cartItems);
    setValorTotalPedido(totalPriceWithFrete())
    sound.play()
   }
}







    return (
  
 <div className='CartSHoppingModal-cconteiner'>
  


  
  

{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}




    {/* Modal carrinho de compras */}
    <div className="modal fade" id="modal_shoppingCart_id"  data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"> 
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-bag-fill" viewBox="0 0 16 16" style={{ color: color }}>
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
                </svg>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <div class="overflow-y-auto">
            <div className="modal-body" id='modal-body-cartItens'>
              {cartItems.length === 0 ? (
                <p id='span-carrinho-vazio'>Seu carrinho está vazio. 😞</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className='product-img-cart-item'>
                      <img src={`https://hotmenu.com.br/arquivos/${item.product.Foto}`} alt={item.product.Nome} className="cart-item-img" />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16" id='remove-item-cart' onClick={() => removeFromCart(index)}>
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                      
                    </div>
                    <div className="cart-item-details">
                      <p className='text-cart-name'>{item.quantity}x {item.product.Nome}</p>
                      <p className='text-cart-description'>
                      {item.additionalStates.map((additional, additionalIndex) => (
                        <p key={additionalIndex} className='text-cart-description'>
                          {additional.observacao.map(obs => (
                            obs.selected ? (
                              <span key={obs.Id}>{obs.Nome}, </span>
                            ) : null
                          ))}
                          {additional.options.map(option => (
                            option.count > 0 ? (
                              <span key={option.id}>{option.count}x {truncateText(option.name)}, </span>
                            ) : null
                          ))}
                          {additional.produtos.map(produto => (
                            produto.count > 0 ? (
                              <span key={produto.Id}>{produto.count}x {truncateText(produto.Nome)}, </span>
                            ) : null
                          ))}
                        </p>
                      ))}
                      </p>
                      <p className='text-cart-price'><strong>Preço:</strong> R$ {formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
            <div className="modal-footer" id='add-footer'>
             <Tooltip id='tooltip-cupom-btn'/>
              <div id='mdfCart'>
                <div className='modal-footer-conteiner'>
                  <div className='prices-labels'>
                    <p className='Total-price-cart'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag-fill" viewBox="0 0 16 16">
                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                  </svg>
                      Subtotal:</p>
                    <p className='Total-price-cart'>
                    <img width="16" height="16" src="https://img.icons8.com/ios-filled/50/delivery--v1.png" alt="delivery--v1"/>
                      Taxa de entrega
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-question-circle-fill tax-info-icon" viewBox="0 0 16 16"
                        data-tooltip-id="tooltip-taxa-entrega-info"
                        data-tooltip-content="Sujeito alteração do estabelecimento."
                        data-tooltip-place="right"
                        data-tooltip-offset="5">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.419-.932-1.045-.932-.592 0-1.037.375-1.037.927 0 .545.44.927 1.048.927" />
                      </svg>
                      <Tooltip id="tooltip-taxa-entrega-info" />
                    </p>
                    <strong><p className='Total-price-cart'>
                    <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/average-2.png" alt="average-2"/>
                      Total:</p></strong>
                  </div>
                  <div className='prices-conteiner'>
                    <p className='Total-price-cart'>R$ {totalCartPrice()}</p>
                    {estabelecimento && estabelecimento.PromocaoFreteGratis && parseFloat(totalCartPrice().replace(',', '.')) >= estabelecimento.ValorFreteGratisAcimaDe ? (
                       <p  className='freeGratis_class' style={{ color: 'red' ,'fontSize': fontSize}}>
                          Frete grátis 
                        </p> ) :(
                      <p className='Total-price-cart' style={{'color' : '#228B22'}}>
                      {estabelecimento && estabelecimento.FreteFixo ? `R$ ${estabelecimento.ValorFreteFixo.toFixed(2).replace('.', ',')}` : 'consultar'}
                      </p>
                    )}
                     {descontoAplicado > 0 && (
                                <p className='Total-price-cart'>
                                    Desconto de: {descontoAplicado}% 
                                </p>
                            )}
                    <strong><p className='Total-price-cart'>R$ {totalPriceWithFrete()}</p></strong>
                  </div>
                </div>
                <hr></hr>
                <div className='btn-card'>
                <button
                  className="btn-compra"
                  disabled={cartItems.length === 0 || parseFloat(totalCartPrice().replace(',', '.')) < valorVendaMinima} // Verifica se o carrinho está vazio ou o valor é menor que o mínimo
                  data-bs-toggle={cartItems.length > 0 && parseFloat(totalCartPrice().replace(',', '.')) >= valorVendaMinima ? 'modal' : undefined} // Verifica se o total atende ao valor mínimo
                  data-bs-target={cartItems.length > 0 && parseFloat(totalCartPrice().replace(',', '.')) >= valorVendaMinima ? '#modal-finalizar-compra' : undefined} // Modal aberto somente se o total for maior que o mínimo
                  onClick={handleAddPedido}
                  data-tooltip-id="carrinho-vazio-id"
                  data-tooltip-content={
                    cartItems.length === 0 
                      ? "Adicione um produto para finalizar a compra." 
                      : parseFloat(totalCartPrice().replace(',', '.')) < valorVendaMinima 
                      ? `O valor mínimo para compra é: R$ ${valorVendaMinima.toFixed(2).replace('.', ',')}` 
                      : ""
                  } 
                  data-tooltip-place="top-start"
                  style={{
                    backgroundColor: comprarButtonHover.isHovered ? '#332D2D' : color, 
                    cursor: cartItems.length > 0 && parseFloat(totalCartPrice().replace(',', '.')) >= valorVendaMinima ? 'pointer' : 'not-allowed'
                  }}
                  onMouseEnter={comprarButtonHover.handleMouseEnter}
                  onMouseLeave={comprarButtonHover.handleMouseLeave}
                >
                  Finalizar Compra
                </button>
                <Tooltip id='carrinho-vazio-id'></Tooltip>
                 <button  data-bs-toggle="modal" data-bs-target="#modal_cupom_desconto"  className='btn-cupom'
              data-tooltip-id="tooltip-cupom-btn"
             data-tooltip-content="adicione o seu cupom aqui."
             data-tooltip-place="top-start"
             style={{backgroundColor : cupomButtonHover.isHovered ? '#332D2D' : color}}
             onMouseEnter={cupomButtonHover.handleMouseEnter}
             onMouseLeave={cupomButtonHover.handleMouseLeave}>Adicionar cupom
              </button>
                </div>
               </div>
            </div>
          </div>
        </div>
      </div>


{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}




  </div>
    )
}
export default Header_component;