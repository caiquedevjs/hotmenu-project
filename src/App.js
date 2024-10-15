import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para pegar o nome do estabelecimento na URL
import './App.css';
import Header_component from './components/header_component/header';
import Infos_component from './components/infos_component/infos';
import Infos_icons_component from './components/infos_icons_component/infos_icons';
import Status_moment_component from './components/status_moment_component/status_moment';
import Selector_category_component from './components/selector_category_component/selector_category';
import Category_component from './components/category_component/category';
import ModalBusca from './components/modal_search_component/modal_search_component';
import { PrimeReactProvider } from 'primereact/api';
import { fetchProducts, fetchCategories, fetchHorarioFuncionamento, fetchFormaPagamentos, fetchEstabelecimentoData } from './components/service/productService';

function App() {
  const { storeName } = useParams(); // Captura o nome do estabelecimento da URL

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [horario, setHorario] = useState({});
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts(storeName);
        const categoriesData = await fetchCategories(storeName);
        const horarioData = await fetchHorarioFuncionamento(storeName);
        const formasPagamentoData = await fetchFormaPagamentos(storeName);
        const estabelecimentoData = await fetchEstabelecimentoData(storeName);

        setProducts(productsData);
        setCategories(categoriesData);
        setHorario(horarioData);
        setFormasPagamento(formasPagamentoData);
        setEstabelecimento(estabelecimentoData);

        if (estabelecimentoData && estabelecimentoData.CorPadrao) {
          setColor(estabelecimentoData.CorPadrao);
        }
      } catch (error) {
        setError('Erro ao carregar dados');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (storeName) {
      fetchData();
    }
  }, [storeName]); // Toda vez que o nome do estabelecimento mudar na URL, a função é chamada novamente

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
        <Header_component />
        <Status_moment_component />
        <Infos_component />
        <Infos_icons_component />
        <Category_component />
        <Selector_category_component />
        <ModalBusca />
      </PrimeReactProvider>

      {/* Botão de rolagem para o topo */}
      <button className={`scroll-to-top ${showScrollButton ? 'show' : ''}`} onClick={scrollToTop} style={{ backgroundColor: color }}>
        &#8593;
      </button>

      {/* Mostrar erro, se houver */}
      {error && <div className="error-message">{error}</div>}

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
