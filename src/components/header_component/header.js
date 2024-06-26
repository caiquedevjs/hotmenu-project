import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../header_component/header_styles.css';
import { FaSearch,FaShoppingCart } from "react-icons/fa";




// componente header
const Header_component = () =>{
    // logica de mudança de estado hover dos icones do header
 const [isCartfoHovered, setIsCartHovered] = useState(false);
 const [isSearchfoHovered, setISearchHovered] = useState(false);


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


        {/* estrutura do modal de bsuca*/}
        
        <div class="modal fade" id="modal_search_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id='body_search_conteiner_id'>
                    <input type='text' placeholder='O que deseja procurar?' id='input_search_id'></input>
                    <FaSearch  id='modal_search_icon_id' style={{ width: '20px', height: '20px', color: '#fa6b18', marginTop : '10px', cursor : 'pointer' }}/>
                </div>
                <div class="container text-center" id='grid_category_id'>
                    <div class="row">
                        <div class="col">
                            <div id='img_category_conteiner'>
                              <a href='#hamburger'>
                              <img src='hambuger-1.png' id='img_category' data-bs-dismiss="modal"/>
                              </a>
                                <p id='text_category_id'>hambuger</p>
                            </div>
                        </div>
                        <div class="col">
                                <div id='img_category_conteiner'>
                                  <a href='#pizza'>
                                  <img src='pizza-1.png' id='img_category'data-bs-dismiss="modal"/>
                                  </a>
                                    <p id='text_category_id'>Pizza</p>
                                </div>
                        </div>
                        <div class="col">
                            <div id='img_category_conteiner'>
                              <a href='#pastel'>
                              <img src='pasteis.png' id='img_category' data-bs-dismiss="modal"/>
                              </a>
                                <p id='text_category_id'>Pastel</p>
                            </div>
                        </div>
                        <div class="col">
                            <div id='img_category_conteiner'>
                              <a href='#bebida'>
                              <img src='fanta-laranja.png' id='img_category' data-bs-dismiss="modal" />
                              </a>
                                <p id='text_category_id'>Bebidas</p>
                            </div>
                        </div>    
                 </div>
                </div>
            </div>
            </div>
        </div>
        </div>



        {/* estrutura do modal de sacola de compras*/}
        <div class="modal fade" id="modal_shoppingCart_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Carrinho de compra</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div className='itens-shopping-conteiner'>
                  <div className='itens-img-conteiner'>
                  <img src='hambuger-1.png' className='iten-img'/>
                  <div className='itens-description-conteiner'>
                    <p> Double big melt</p>
                  </div>
                  </div>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16" id='dash-iten'>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
                </svg>
                </div>
            </div>
            <div class="modal-footer">
                
                <button type="button" class="btn btn-primary">Finalizar compra</button>
            </div>
            </div>
        </div>
        </div>
            <div className='conteiner_hotmenu_logo'>
            <img src="logo-removebg-preview.png" alt="..."></img>
            </div>
            <header className='header_class'>
                  {/* estrutura dos icons do header*/}
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
                  <div className={isIconsFixed ? 'icons_header_conteiner_class fixed' : 'icons_header_conteiner_class'}>
                <FaSearch style={{ width: '20px', height: '20px',  color: isSearchfoHovered ? 'black' : '#fa6b18', marginTop : '10px', cursor : 'pointer', transition: 'color 0.5s ease' }} data-bs-toggle="modal" data-bs-target="#modal_search_id"
                 onMouseEnter={() => setISearchHovered(true)} 
                 onMouseLeave={() => setISearchHovered(false)}/>
          
                 <FaShoppingCart  style={{ width: '20px', height: '20px', color: isCartfoHovered ? 'black' : '#fa6b18', marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease' }} 
                    onMouseEnter={() => setIsCartHovered(true)} 
                    onMouseLeave={() => setIsCartHovered(false)}   data-bs-toggle="modal" data-bs-target="#modal_shoppingCart_id" />
                    <label id='amount_order'>1</label>
                 
                </div>
                <div className='logo_conteiner_class'>
                <img src="attachment_71444173.png" class="img-fluid" alt="Logo"/>
                </div>
                <h1 id='title_logo'>Pizzaria dos Amigos</h1>
                


                
            </header>
    </div>
    )
}
export default Header_component;