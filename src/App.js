import React, { useState, useEffect } from 'react';
import './App.css';
import Header_component from './components/header_component/header';
import Infos_component from './components/infos_component/infos';
import Infos_icons_component from './components/infos_icons_component/infos_icons';
import Status_moment_component from './components/status_moment_component/status_moment';
import Selector_category_component from './components/selector_category_component/selector_category';
import Category_component from './components/category_component/category';

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

  // Adicionar um listener de scroll para atualizar a visibilidade do botão
  useEffect(() => {
    const handleScroll = () => {
      // Calcula a altura do viewport
      const windowHeight = window.innerHeight;

      // Verifica a posição do scroll atual
      if (window.pageYOffset > windowHeight / 2) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    // Adiciona o listener de scroll ao carregar o componente
    window.addEventListener('scroll', handleScroll);

    // Remove o listener de scroll ao desmontar o componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <Header_component />
      <Status_moment_component />
      <Infos_component />
      <Infos_icons_component />
      <Selector_category_component />
      <Category_component />

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
