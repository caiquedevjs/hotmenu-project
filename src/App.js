/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import './App.css';
import Header_component from './components/header_component/header';
import Infos_component from './components/infos_component/infos';
import Infos_icons_component from './components/infos_icons_component/infos_icons';
import Status_moment_component from './components/status_moment_component/status_moment';
import Selector_category_component from './components/selector_category_component/selector_category';
import Category_component from './components/category_component/category';
import ModalBusca from './components/modal_search_component/modal_search_component';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { fetchEstabelecimentoData } from './components/service/productService';


function App() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData();
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
  }, []);

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
     <PrimeReactProvider>
     <Header_component/>
      <Status_moment_component/>
      <Infos_component/>
      <Infos_icons_component/>
      <Category_component/>
      <Selector_category_component/>
      <ModalBusca/>
      
     </PrimeReactProvider>
      
     
      

    

      {/* Botão de rolagem para o topo */}
      <button className={`scroll-to-top ${showScrollButton ? 'show' : ''}`} onClick={scrollToTop} style={{backgroundColor: color}}>
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
