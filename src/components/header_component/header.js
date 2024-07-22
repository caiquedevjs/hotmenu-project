import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../header_component/header_styles.css';
import './modal_cart_itens.css';
import './modal_cupom_desconto.css';
import './modal_finalizar_pedido.css';
import { FaSearch,FaShoppingCart } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { CartContext } from '../modal_cart_itens/CartContext';




const Header_component = () =>{
  // <------- estado do carrinho ------->
  const { cartItems, totalCartPrice, removeFromCart } = useContext(CartContext);

  // <------- imprimir o arrey de produto do estado do carrinho ------->
  useEffect(()=>{
    console.log(cartItems)
  })
  

    // <------- logica de mudança de estado hover dos icones do header ------->
 const [isCartfoHovered, setIsCartHovered] = useState(false);
 const [isSearchfoHovered, setISearchHovered] = useState(false);


// <------- logica para botão de scroll para o topo da pagina ------->
 const [isIconsFixed, setIsIconsFixed] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 0) {
      setIsIconsFixed(true);
    } else {
      setIsIconsFixed(false);
    }
  };
  // <---------- Função para formatar o preço ---------->
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ','); // Formata o preço para ter duas casas decimais e substitui o ponto por vírgula (opcional)
  };



    // <---------- Função para truncar o texto ---------->
    const [maxLength, setMaxLength] = useState(60);
    const truncateText = (text) => {
      if (text.length <= maxLength) {
        return text;
      }
      return `${text.substring(0, maxLength)}...`;
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
  <FaSearch style={{ width: '20px', height: '20px',  color: isSearchfoHovered ? 'black' : '#ce2929', marginTop : '10px', cursor : 'pointer', transition: 'color 0.5s ease' }} data-bs-toggle="modal" data-bs-target="#modal_search_id"
  onMouseEnter={() => setISearchHovered(true)} 
  onMouseLeave={() => setISearchHovered(false)}/>
          
  <FaShoppingCart  style={{ width: '20px', height: '20px', color: isCartfoHovered ? 'black' : '#ce2929', marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease' }} 
   onMouseEnter={() => setIsCartHovered(true)} 
  onMouseLeave={() => setIsCartHovered(false)}   data-bs-toggle="modal" data-bs-target="#modal_shoppingCart_id" />
  {/*<label id='amount_order'>1</label> */}             
  </div>
  <div className='logo_conteiner_class'>
  <img src="attachment_71444173.png" class="img-fluid" alt="Logo"/>
  </div>
  <h1 id='title_logo'>Pizzaria dos Amigos</h1>
  <h6 className='estabelecimento-description'>Pizzas tradicionais e de qualidade!</h6>      
  </header>



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
                      <p className='text-cart-description'>{truncateText(item.product.Descricao)}</p>
                      <p className='text-cart-price'><strong>Preço:</strong> R$ {formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>

            
            <div className="modal-footer">
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
                <div className='btn-card'>
                <button className="btn-compra" data-bs-toggle="modal" data-bs-target="#modal-finalizar-compra">
                  Finalizar Compra
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-ticket-perforated-fill" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#modal_cupom_desconto" style={{'color': '#ce2929'}} id='icon-cupom-btn'>
              <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4-1v1h1v-1zm1 3v-1H4v1zm7 0v-1h-1v1zm-1-2h1v-1h-1zm-6 3H4v1h1zm7 1v-1h-1v1zm-7 1H4v1h1zm7 1v-1h-1v1zm-8 1v1h1v-1zm7 1h1v-1h-1z"/>
              </svg>  
                </div>
               </div>
            </div>
          </div>
        </div>
      </div>

              {/* <------------ Modal carrinho de cupom de desconto ------------>*/}
      <div class="modal fade" id="modal_cupom_desconto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modal-header-title"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-ticket-perforated-fill" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#modal_cupom_desconto" style={{'color': '#ce2929'}}>
    <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4-1v1h1v-1zm1 3v-1H4v1zm7 0v-1h-1v1zm-1-2h1v-1h-1zm-6 3H4v1h1zm7 1v-1h-1v1zm-7 1H4v1h1zm7 1v-1h-1v1zm-8 1v1h1v-1zm7 1h1v-1h-1z"/>
  </svg> Cupom
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

    
{/* <-------- Modal de finalizar compra -------> */}
<div class="modal fade" id="modal-finalizar-compra" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{'color': '#ce2929'}}>
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
    </svg>
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        

      <form class="row g-3">
  <div class="col-md-6">
    <label for="inputEmail4" className="form-label">Nome</label>
    <input type="text" class="form-control" id="inputNomel4"/>
  </div>
  <div class="col-md-6">
    <label for="inputPassword4" class="form-label">Telefone</label>
    <input type="text" class="form-control" id="inputTelefone4"/>
  </div>
  <div class="col-12">
    <label for="inputAddress" class="form-label">Endereço</label>
    <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St"/>
  </div>
  <div class="col-12">
    <label for="inputAddress2" class="form-label">Complemento</label>
    <input type="text" class="form-control" id="inputComplemento" placeholder="Apartment, studio, or floor"/>
  </div>
  <div class="col-md-6">
    <label for="inputCity" class="form-label">City</label>
    <input type="text" class="form-control" id="inputCity"/>
  </div>
  
  <div class="col-md-2">
    <label for="inputZip" class="form-label">Cep</label>
    <input type="text" class="form-control" id="inputCep"/>
  </div>
</form>











      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Finalizar pedido</button>
        <button type="button" class="btn btn-primary">Excluir pedido</button>
      </div>
    </div>
  </div>
</div>         

  </div>
    )
}
export default Header_component;