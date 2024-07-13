import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../header_component/header_styles.css';
import { FaSearch,FaShoppingCart } from "react-icons/fa";





const Header_component = () =>{

    // <-------logica de mudança de estado hover dos icones do header------->
 const [isCartfoHovered, setIsCartHovered] = useState(false);
 const [isSearchfoHovered, setISearchHovered] = useState(false);


// <-------logica para botão de scroll para o topo da pagina------->
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
  <FaSearch style={{ width: '20px', height: '20px',  color: isSearchfoHovered ? 'black' : '#fa6b18', marginTop : '10px', cursor : 'pointer', transition: 'color 0.5s ease' }} data-bs-toggle="modal" data-bs-target="#modal_search_id"
  onMouseEnter={() => setISearchHovered(true)} 
  onMouseLeave={() => setISearchHovered(false)}/>
          
  <FaShoppingCart  style={{ width: '20px', height: '20px', color: isCartfoHovered ? 'black' : '#fa6b18', marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease' }} 
   onMouseEnter={() => setIsCartHovered(true)} 
  onMouseLeave={() => setIsCartHovered(false)}   data-bs-toggle="modal" data-bs-target="#modal_shoppingCart_id" />
  {/*<label id='amount_order'>1</label> */}             
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