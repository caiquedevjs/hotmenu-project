import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../header_component/header_styles.css';
import './modal_cart_itens.css';
import './modal_cupom_desconto.css';
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



   {/* <------------ Modal carrinho de compras ------------>*/}
   <div className="modal fade" id="modal_shoppingCart_id" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Carrinho de compras</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body" id='modal-body-cartItens'>
            {cartItems.length === 0 ? (
                <p id='span-carrinho-vazio'>Seu carrinho está vazio</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className='product-img-cart-item'>
                    <img src={`https://hotmenu.com.br/arquivos/${item.product.Foto}`} alt={item.product.Nome} className="cart-item-img" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-dash-circle-fill" viewBox="0 0 16 16" id='remove-item-cart' onClick={() => removeFromCart(index)}>
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                    </svg>
                    </div>
                    <div className="cart-item-details">
                      <p className='text-cart-name'>{item.quantity}x {item.product.Nome}</p>
                      <p className='text-cart-description'>{item.product.Descricao}</p>
                      <p className='text-cart-price'><strong>Preço:</strong> R$ {item.totalPrice}</p>
                    </div>
                  </div>
                  
                ))
              )}
            </div>
            <div className="modal-footer">
              <div className='modal-footer-conteiner'>
                <p className='Total-price-cart'> <strong>Preço total: R$</strong> {totalCartPrice()}</p>
                <div className='cart-btn-conteiner'>
                  <button type="button" className="btn-compra">Finalizar compra</button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-ticket-perforated-fill" viewBox="0 0 16 16" id='ticket-icons' data-tooltip-id="tooltip-cupom-desconto"
                    data-tooltip-content="cumpom de desconto"
                    data-tooltip-place="right"
                    data-tooltip-offset="5"
                    data-bs-toggle="modal" data-bs-target="#modal_cupom_desconto"
                  >
                    <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4-1v1h1v-1zm1 3v-1H4v1zm7 0v-1h-1v1zm-1-2h1v-1h-1zm-6 3H4v1h1zm7 1v-1h-1v1zm-7 1H4v1h1zm7 1v-1h-1v1zm-8 1v1h1v-1zm7 1h1v-1h-1z" />
                  </svg>
                </div>
              </div>
              <Tooltip id='tooltip-cupom-desconto' />
            </div>
          </div>
        </div>
      </div>

              {/* <------------ Modal carrinho de cupom de desconto ------------>*/}
      <div class="modal fade" id="modal_cupom_desconto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id='modal-body-cupom-desconto'>
            <input className='cupom-desconto-input' placeholder='digite seu cupom'
             data-tooltip-id="tooltip-bsucar-cupom"
             data-tooltip-content="busque um cupom para ultilizar"
             data-tooltip-place="right"
             data-tooltip-offset="5"></input> 
            <button className='btn-buscar-cupom'>buscar</button>
            <Tooltip id='tooltip-bsucar-cupom'></Tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}
export default Header_component;