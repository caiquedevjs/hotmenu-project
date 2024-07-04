import React, { useState, useEffect } from 'react';
import './App.css';
import Header_component from './components/header_component/header';
import Infos_component from './components/infos_component/infos';
import Infos_icons_component from './components/infos_icons_component/infos_icons';
import Status_moment_component from './components/status_moment_component/status_moment';
import Selector_category_component from './components/selector_category_component/selector_category';
import Category_component from './components/category_component/category';
import ModalBusca from './components/modal_search_component/modal_search_component';

function App() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="App">
      <Header_component />
      <Status_moment_component />
      <Infos_component />
      <Infos_icons_component />
      <Category_component />
      <Selector_category_component />
     
      <ModalBusca/>
      

    

      {/* Botão de rolagem para o topo */}
      <button className={`scroll-to-top ${showScrollButton ? 'show' : ''}`} onClick={scrollToTop}>
        &#8593;
      </button>

      <footer>
        <div className='conteiner_hotmenu_logo'>
          <img src="logo-removebg-preview.png" alt="..." />
        </div>
        <label>© Copyright 2024 Hotmenu. Todos os direitos reservados.</label>
      </footer>
    </div>
  );
}

export default App;
