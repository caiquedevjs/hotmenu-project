
// <------- import hooks and context------->
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../modal_cart_itens/CartContext';

// <------- import css------->
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../header_component/header_styles.css';
import './modal_cart_itens.css';
import './modal_cupom_desconto.css';
import './modal_finalizar_pedido.css';
import 'react-toastify/dist/ReactToastify.css';

// <------- import react icons, assets, toaltip and toast ------->
import { FaSearch,FaShoppingCart } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";
import { Tooltip } from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import SoundMessage from '../../assets/sounds/message.wav';
import InputMask from 'react-input-mask';

// <------- import utils------->
import { fetchFormaPagamentos } from '../service/productService';
import { transformFormasDePagamento } from '../../utils/dataTransformationsFormasPagamentos';
import  useHover  from '../../utils/headerHoverHandlers';
import useScrollToTopButton from '../../utils/scrollHandler';
import truncateText from '../../utils/truncateText';






const Header_component = () =>{

 // <------ constantes utils ------->
  const cartHover = useHover();
  const searchHover = useHover();
  const { isIconsFixed} = useScrollToTopButton();
  const truncate_Text = (text) => truncateText(text, 40)

// <------ estados modos de pagamentos: pix, dinheiro------->
const [pixKey, setPixKey] = useState(`BOL-${Math.random().toString(36).substring(2, 15)}`);
const [valorTroco, setValorTroco] = useState(0);
const [boleto, setBoleto] = useState(null);

 // <------ função para gerar boleto ------->
 const generateBoleto = () => {

  // <------ obejto boleto ------->
  const novoBoleto = {
    chavePIX: pixKey,
    valor: valorTroco,
    codigoBoleto: `BOL-${Math.random().toString(36).substring(2, 15)}`, // Simulação de código de boleto
    dataGeracao: new Date().toLocaleDateString(),
  };
  if (selectedOption === 'Boleto') {
    // Exibe o código do boleto em um alerta
    alert(`Código do Boleto: ${novoBoleto.codigoBoleto}`);
    setBoleto(novoBoleto);
  } else {
    // A verificação é feita apenas se a opção selecionada não for "Boleto"
    if (!pixKey || valorTroco <= 0) {
      alert('Preencha todos os campos corretamente.');
      return;
    }
  }
};



//---------------------------------------------------------------------------------------------------------------------------------------------------------


  // <------ renderização das formas de pagamentos ------->
  const [formas, setFormas] = useState([]);
  const [formasPorTipo, setFormasPorTipo] = useState({});
  const [formasSemTipo, setFormasSemTipo] = useState({});

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetchFormaPagamentos();
              if (response && response.FormasDePagamento) {
                  // Organize formas by tipo and handle formas without tipo
                  const formasByTipo = {};
                  const formasSemTipo = {};
                  response.FormasDePagamento.forEach((curr) => {
                      if (curr.Tipo) {
                          if (!formasByTipo[curr.Tipo]) {
                              formasByTipo[curr.Tipo] = [];
                          }
                          formasByTipo[curr.Tipo].push(curr);
                      } else {
                          // Ensure each key in formasSemTipo is an array
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
  }, []);
  const renderFormas = (tipo) => {
    if (!formasPorTipo[tipo]) return null;
    return (
        <div className="payment-grid">
            {formasPorTipo[tipo].map((forma) => (
                <div key={forma.Id} className="payment-item">
                    <img src={`https://hotmenu.com.br/assets/images/FormaPagamento/${forma.Imagem}`} alt={forma.Nome} />
                </div>
            ))}
        </div>
    );
};
const renderFormasSemTipo = (nome) => {
    const formas = formasSemTipo[nome];
    if (!formas || !Array.isArray(formas)) return null;
    return (
        <div className="payment-grid">
            {formas.map((forma) => (
                <div key={forma.Id} className="payment-item">
                    <img src={`https://hotmenu.com.br/assets/images/FormaPagamento/${forma.Imagem}`} alt={forma.Nome} /> 
                </div>
            ))}
        </div>
    );
};
// ---------------------------------------------------------------------------------------------------------------------------------------------------------






  // <------- estado do carrinho ------->
  const { cartItems, totalCartPrice, removeFromCart } = useContext(CartContext);


  // <------- imprimir o arrey de produto do estado do carrinho ------->
  useEffect(()=>{
    console.log(cartItems)
  })
  

  // <---------- Função para formatar o preço ---------->
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ','); // Formata o preço para ter duas casas decimais e substitui o ponto por vírgula (opcional)
  };

// <---------- Função para copiar chave pix ---------->
  const CopyButton = () => {
    const copyToClipboard = () => {
        const field = document.getElementById('inputPixKey');
        field.select();
        document.execCommand('copy');
    };

    return (
        <button 
            type="button" 
            onClick={copyToClipboard} 
            className="btn-copy"
            aria-label="Copiar código Pix"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
            </svg>
        </button>
    );
};




   
    // <---------- função para deixar os campos de endereço visivel ---------->
    const [showAddressFields, setShowAddressFields] = useState(false);
    const handleDeliveryOption = (option) => {
      if (option === 'home') {
        setShowAddressFields(true);
      } else {
        setShowAddressFields(false);
      }
    };

   // <------ estados do formulario, valor total do pedido------->  
  const [valorTotalPedido, setValorTotalPedido] = useState();
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
  const [accountNumber, setAccountNumber] = useState('');
  const [agency, setAgency] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  //<------ função para validar os campos do formulario ------->
  const validateForm = () => {
    if (
      nome &&
      telefone &&
      (showAddressFields ? endereco && complemento && bairro && cep : true) &&
      cartao &&
      titular &&
      vencimento &&
      cvc
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

// <------ effect para disprar a validação dos campos do formulario ------->
  useEffect(() => {
    validateForm();
  }, [nome, telefone, endereco, complemento, bairro, cep, cartao, titular, vencimento, cvc]);

// <------ função para adicionar os itens do carrinho a lista de pedido ------->
const handleAddPedido =() =>{
    setList(cartItems);
    setValorTotalPedido(totalCartPrice())
    sound.play()
}

// <---------- Notificações ---------->
const sound = new Audio(SoundMessage)
 const notify = () => toast.success(`Olá ${nome} 👋, seu pedido foi feito com sucesso! 🍔🍟 `,{theme: 'dark'});
 const notify02 = () => toast.success('Você receberá o status do pedido pelo WhatsApp. ⏱️ ', {theme: 'dark'});

//<------ função para finalizar a lista de pedido ------->
const handleFinalizarPedido = () => {
  if (isFormValid) {
    if (list.length > 0) {
      notify();
      notify02();
      setValorTotalPedido()
      setList([]);
      setNome('');
      setTelefone('');
      setBairro('');
      setEndereco('');
      setComplemento('');
      setCep('');
      setCartao('');
      setTitular('');
      setVencimento('');
      setCvc('');
    } else {
      toast.error("Não há pedidos para finalizar", {theme: 'dark'});
      sound.play();
    }
  } else {
    toast.error("Por favor, preencha todos os campos obrigatórios.", {theme: 'dark'}
    );
    sound.play();
  }
};
// <------ função para remover o pedido da lista de pedido ------->
  const hendlerRemovePedido = () => {
    setList([])
    setValorTotalPedido()
    toast.success("Pedido excluido com sucesso. 😞",  {theme: 'dark'})
    sound.play()
  };


//<------ função para capitar o valor da escolha da forma de pagamento------->
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  
    return (
 <div className='Header-component'>
  <header className='header_class'>
   {/* <-------estrutura dos icons do carrossel de banners-------> */}
  <div id="carouselExampleFade" class="carousel slide carousel-fade" >
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="dfdgg.jpg" class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src="10604251.jpg" class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src="11713789.jpg" class="d-block w-100" alt="..."/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
 {/* <-------estrutura dos icons do header-------> */}
 <div className={isIconsFixed ? 'icons_header_conteiner_class fixed' : 'icons_header_conteiner_class'}>
  <FaSearch onMouseEnter={cartHover.handleMouseEnter}
        onMouseLeave={cartHover.handleMouseLeave}
        style={{ color: cartHover.isHovered ? 'black' : '#ce2929', marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease',  marginLeft: '10px',  }} data-bs-toggle="modal" data-bs-target="#modal_search_id"/>
        {cartItems.length === 0 ? (
          <div className='amount_order_conteiner'>
          <FaShoppingCart onMouseEnter={searchHover.handleMouseEnter}
             onMouseLeave={searchHover.handleMouseLeave}
             style={{ color: searchHover.isHovered ? 'black' : '#ce2929', marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease', }}  data-bs-toggle="modal" data-bs-target="#modal_shoppingCart_id" />
              </div>   
        ) :(
          <div className='amount_order_conteiner'>
     <label id='amount_order'>1</label> 
     <FaShoppingCart onMouseEnter={searchHover.handleMouseEnter}
        onMouseLeave={searchHover.handleMouseLeave}
        style={{ color: searchHover.isHovered ? 'black' : '#ce2929', marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease', width : '35px' }}  data-bs-toggle="modal" data-bs-target="#modal_shoppingCart_id" />
         </div>   
        )}
  </div>
  <div className='logo_conteiner_class'>
  <img src="attachment_71444173.png" class="img-fluid" alt="Logo"/>
  </div>
  <h1 id='title_logo'>Pizzaria dos Amigos</h1>
  <h6 className='estabelecimento-description'>Pizzas tradicionais e de qualidade!</h6>      
  </header>

{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}




    {/* Modal carrinho de compras */}
    <div className="modal fade" id="modal_shoppingCart_id" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-bag-fill" viewBox="0 0 16 16" style={{ color: '#ce2929' }}>
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
                </svg>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="overflow-y-auto">
            <div className="modal-body" id='modal-body-cartItens'>
              {cartItems.length === 0 ? (
                <p id='span-carrinho-vazio'>Seu carrinho está vazio 😞</p>
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
                      <p className='text-cart-description'>{truncate_Text(item.product.Descricao)}</p>
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
                    <p className='Total-price-cart' style={{'color' : '#228B22'}}>R$ 0,00</p>
                    <strong><p className='Total-price-cart'>R$ {totalCartPrice()}</p></strong>
                  </div>
                </div>
                <hr></hr>
                <div className='btn-card'>
                <button className="btn-compra"  disabled={cartItems.length === 0} data-bs-toggle={cartItems.length > 0 ? 'modal' : undefined} data-bs-target={cartItems.length > 0 ? '#modal-finalizar-compra' : undefined} 
                onClick={ handleAddPedido } 
                data-tooltip-id="carrinho-vazio-id"
                data-tooltip-content= "Adicione um produto pra finalizar a compra."
                data-tooltip-place="top-start"
                >
                  Finalizar Compra
                </button>
                <Tooltip id='carrinho-vazio-id'></Tooltip>
                 <button  data-bs-toggle="modal" data-bs-target="#modal_cupom_desconto"  className='btn-cupom'
              data-tooltip-id="tooltip-cupom-btn"
             data-tooltip-content="adicione o seu cupom aqui."
             data-tooltip-place="top-start">Adicionar cupom</button>
                </div>
               </div>
            </div>
          </div>
        </div>
      </div>

{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}



              {/* <------------ Modal carrinho de cupom de desconto ------------>*/}
      <div class="modal fade" id="modal_cupom_desconto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modal-header-title">
            <RiDiscountPercentFill  id='cupom-icon-modal-title'/>
           Cupom
        </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id='modal-body-cupom-desconto'>
          <Tooltip id='tooltip-bsucar-cupom'></Tooltip>
            <input className='cupom-desconto-input' placeholder='digite seu cupom'
             data-tooltip-id="tooltip-bsucar-cupom"
             data-tooltip-content="busque um cupom para ultilizar"
             data-tooltip-place="top-start"
             ></input> 
            <button className='btn-buscar-cupom'>buscar</button>
          </div>
        </div>
      </div>
    </div>

{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}



{/* <-------- Modal de finalizar compra -------> */}
<div className="modal fade" id="modal-finalizar-compra" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fs-5" id='info_text'>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ color: '#ce2929' }}>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
              </svg>
              Resumo
            </h3>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
          <div className='cart-finalize-list'>
                <div class="overflow-y-auto">
                {list.map((item, index) => (
                  <div key={index} className="finalize-item">
                    <img src={`https://hotmenu.com.br/arquivos/${item.product.Foto}`} alt={item.product.Nome} className="cart-item-img" />
                    <p className='pedido-desccao'>{item.product.Nome}<br></br>Quantidade: {item.quantity}</p>
                  </div>
                ))}
              </div>
                </div>
                <div className='total-valor-pedido'>
                <p className='total-valor-pedido-p'>Valor total: <span className='total-valor-pedido-span'>R$ {valorTotalPedido}</span></p>
              </div>
                <form className="row g-3">
                  <div className='user--inputs-conteine'>
                  <div className="col-md-6">
                <label htmlFor="inputNome4" className="form-label-credit-usuario">Nome</label>
                <input type="text" className="form-control" id="inputNome4" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputTelefone4" className="form-label-credit-usuario">Telefone</label>
                <input type="text" className="form-control" id="inputTelefone4" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>
                  </div>
              <div className="dropdown-center">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="deliveryOptions" data-bs-toggle="dropdown" aria-expanded="false">
                  Formas de entrega
                </button>
                <ul className="dropdown-menu" aria-labelledby="deliveryOptions">
                  <li><a className="dropdown-item" href="#" onClick={() => handleDeliveryOption('pickup')}>Retirar no estabelecimento</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => handleDeliveryOption('home')}>Receber em casa</a></li>
                </ul>
              </div>
              {showAddressFields && (
                <>
                  <div className="col-12">
                    <label htmlFor="inputAddress" className="form-label-credit-usuario">Endereço</label>
                    <input type="text" className="form-control" id="inputAddress" placeholder=" Av. Luís Viana Filho, 6462 - Paralela" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label htmlFor="inputComplemento" className="form-label-credit-usuario">Complemento</label>
                    <input type="text" className="form-control" id="inputComplemento" placeholder="Wall Street Empresarial" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label-credit-usuario">Bairro</label>
                    <input type="text" className="form-control" id="inputCity" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="inputZip" className="form-label-credit-usuario">Cep</label>
                    <input type="text" className="form-control" id="inputZip" value={cep} onChange={(e) => setCep(e.target.value)} />
                  </div>
                </>
              )}
              <div className='card-credit-form'>
    <h4 className='pay-title-form'>Pagamento</h4>
    <div className='conteiner-check'>
    {Object.keys(formasPorTipo).map((tipo) => (
      
        <div key={tipo} className="form-check">
            <input
                className="form-check-input"
                type="radio"
                name="paymentOption"
                id={`${tipo}Option`}
                value={tipo}
                checked={selectedOption === tipo.toLowerCase()}
                onChange={handleOptionChange}
            />
            <label className="form-label-check" htmlFor={`${tipo}Option`}>
                {tipo}
            </label>
        </div>
        
    ))}
    </div>
    <div className='conteiner-check'>
    {Object.keys(formasSemTipo).map((tipo) => (
      
        <div key={tipo} className="form-check">
            <input
                className="form-check-input"
                type="radio"
                name="paymentOption"
                id={`${tipo}Option`}
                value={tipo}
                checked={selectedOption === tipo.toLowerCase()}
                onChange={handleOptionChange}
            />
            <label className="form-label-check" htmlFor={`${tipo}Option`}>
                {tipo}
            </label>
        </div>
        
        
    ))}
    </div>
    
    <div className="payment-icons">
        {selectedOption && renderFormas(selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1))}
        {selectedOption && renderFormasSemTipo(selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1))}
    </div> <hr></hr>
    {selectedOption === 'Débito' || selectedOption === 'Crédito' || selectedOption === 'Vale Refeição'  || selectedOption === 'PicPay' ? (
        <div className='titular-card-pay-container'>
        <div className="row">
            <div className="col-md-6">
                <label htmlFor="inputCardNumber">Número do cartão</label>
                <InputMask 
                   
                    className="form-control" 
                    id="inputCardNumber" 
                    mask="9999 9999 9999 9999"
                    value={cartao} 
                    onChange={(e) => setCartao(e.target.value)} 
                >
                   {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputCardNumber" />}
                   </InputMask>
            </div>
            <div className="col-md-6">
                <label htmlFor="inputCardHolder">Nome do titular</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="inputCardHolder" 
                    value={titular} 
                    onChange={(e) => setTitular(e.target.value)} 
                />
            </div>
        </div>
        <div className='card-date-container'>
    <div className="row">
        <div className="card-date-container_grid">
        <div className=" col-sm-6">
        <label htmlFor="inputExpiryDate">Data de vencimento</label>
              <InputMask
                mask="99/99"
                value={vencimento}
                onChange={(e) => setVencimento(e.target.value)}
              >
                {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputExpiryDate" />}
              </InputMask>
            </div>
            <div className=" col-sm-6">
            <label htmlFor="inputCVC">CVC</label>
              <InputMask
                mask="999"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              >
                {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputCVC" />}
              </InputMask>
        </div>
        </div>
        
    </div>
</div>
    </div>
    ) : null}
{selectedOption === 'Pix' ? (
    <div className='titular-card-pay-conteiner'>
        <div className="input-container">
          <div>
            <label htmlFor="inputPixKey" className='labelChavePix'>Chave Pix</label>
            <input 
                type="text" 
                className="form-control" 
                id="inputPixKey"
                readOnly
                value={pixKey}
            /></div>
            <CopyButton />
        </div>
    </div>
) : null}
    {selectedOption === 'Boleto' ? (
        <div className='titular-card-pay-conteiner'>
            <div className="col-md-4">
                
                <button 
                    type="button" 
                    className="btn-gerar-boleto" 
                    onClick={generateBoleto}
                >
                    Gerar Boleto
                </button>
            </div>
        </div>
    ) : null}
    {selectedOption === 'Dinheiro' ? (
        <div className='titular-card-pay-conteiner'>
            <div className="col-md-4">
                <label htmlFor="inputChangeValue" className='labelValorTroco'>Valor para troco</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="inputChangeValue" 
                    value={valorTroco} 
                    onChange={(e) => setValorTroco(e.target.value)} 
                />
            </div>
        </div>
    ) : null}
{selectedOption === 'Transferência'  ? (
        <div className='titular-card-pay-container'>
        
        <div className='card-date-container'>
    <div className="row">
        <div className="card-date-container_grid">
        <div className=" col-sm-6">
        <label htmlFor="inputAccountNumber">Número da conta</label>
              <InputMask
                mask="99999 9"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              >
                {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputAccountNumber" />}
              </InputMask>
            </div>
            <div className=" col-sm-6">
            <label htmlFor="inputAgency">Agência</label>
              <InputMask
                mask="9999 9"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
              >
                {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputAgency" />}
              </InputMask>
        </div>
        <button className="btn-fazer-transferencia">Trasnferir</button>
        </div>
    </div>
</div>
    </div>
    ) : null}
</div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button type="button"  id='finalizar-pedido-btn'  onClick={handleFinalizarPedido} >Finalizar pedido</button>
            <ToastContainer />
            <button type="button" id='excluir-pedido-btn' onClick={hendlerRemovePedido}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}
export default Header_component;