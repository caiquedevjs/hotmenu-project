/* eslint-disable react/jsx-pascal-case */
// Arquivo: App.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet,HelmetProvider } from 'react-helmet-async';
import './App.css';

import { CartProvider } from './components/modal_cart_itens/CartContext';

// Importação dos seus componentes
import Header_component from './components/header_component/header';
import Status_moment_component from './components/status_moment_component/status_moment';
import Infos_component from './components/infos_component/infos';
import Infos_icons_component from './components/infos_icons_component/infos_icons';
import Selector_category_component from './components/selector_category_component/selector_category';
import Category_component from './components/category_component/category';
import ModalBusca from './components/modal_search_component/modal_search_component';
import Modal_product_component from './components/modal_products_component/modal_products_component';

import { PrimeReactProvider } from 'primereact/api';
import { fetchProducts, fetchCategories, fetchHorarioFuncionamento, fetchFormaPagamentos, fetchEstabelecimentoData } from './components/service/productService';

function App() {
    const { storeName } = useParams();

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [horario, setHorario] = useState({});
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [estabelecimento, setEstabelecimento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [color, setColor] = useState("");

    // ✅ === ESTADOS PARA MODAIS E OFFCANVAS RESTAURADOS ===
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    useEffect(() => {
        // ... seu useEffect para buscar dados (sem alterações) ...
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
    }, [storeName]);

    useEffect(() => {
        // ... seu useEffect para o botão de scroll (sem alterações) ...
        const handleScroll = () => { if (window.pageYOffset > 300) { setShowScrollButton(true); } else { setShowScrollButton(false); } };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // ✅ === FUNÇÕES DE CONTROLE RESTAURADAS ===

    // Funções para o Modal de Busca
    const handleOpenSearch = () => setShowSearchModal(true);
    const handleCloseSearch = () => setShowSearchModal(false);

    // Funções para o Offcanvas de Produto
    const handleOpenOffcanvas = (product) => {
        setSelectedProduct(product);
        setIsOffcanvasOpen(true);
    };
    const handleCloseOffcanvas = () => {
        setIsOffcanvasOpen(false);
        setTimeout(() => setSelectedProduct(null), 300);
    };

    // Função que conecta o Modal de Busca ao Offcanvas
    const handleProductSelectedFromSearch = (product) => {
        handleCloseSearch(); // Fecha o modal de busca
        handleOpenOffcanvas(product); // Abre o offcanvas do produto
    };

    return (
        <HelmetProvider>
        <CartProvider>
            <div className="App">
                 {estabelecimento && (
                        <Helmet>
                            <title>HOTMENU - {estabelecimento.Nome}</title>
                            <meta name="author" content={estabelecimento.Nome} />
                            <meta name="description" content={estabelecimento.Descricao} />
                            <meta name="url" content={`https://hotmenu.com.br/${estabelecimento.StringWIFI}`} />

                            {/* Open Graph (og) tags para redes sociais */}
                            <meta property="og:title" content={estabelecimento.Nome} />
                            <meta property="og:type" content="website" />
                            <meta property="og:url" content={`https://hotmenu.com.br/${estabelecimento.StringWIFI}`} />
                            <meta property="og:image" content={`http://hotmenu.com.br/arquivos/${estabelecimento.Logomarca}`} />
                            <meta property="og:site_name" content={`HOTMENU - ${estabelecimento.Nome}`} />
                            <meta property="og:description" content={estabelecimento.Descricao} />

                            {/* Link canônico é uma boa prática de SEO */}
                            <link rel="canonical" href={`https://hotmenu.com.br/${estabelecimento.StringWIFI}`} />
                        </Helmet>
                    )}
                <PrimeReactProvider>
                    {/* ✅ Passando a prop onSearchClick de volta para o Header */}
                    <Header_component onSearchClick={handleOpenSearch} />
                    <Status_moment_component />
                    <Infos_component />
                    <Infos_icons_component />
                    <Category_component categories={categories} products={products} onProductClick={handleOpenOffcanvas} />
                    <Selector_category_component />
                    
                    {/* ✅ Passando as props de controle de volta para o ModalBusca */}
                    {/* Nota: o seu ModalBusca precisará ser adaptado para receber estas props */}
                    <ModalBusca
                        show={showSearchModal}
                        handleClose={handleCloseSearch}
                        onProductSelect={handleProductSelectedFromSearch}
                    />
                    
                    {selectedProduct && (
                        <Modal_product_component
                            product={selectedProduct}
                            show={isOffcanvasOpen}
                            handleClose={handleCloseOffcanvas}
                        />
                    )}
                </PrimeReactProvider>

                <button className={`scroll-to-top ${showScrollButton ? 'show' : ''}`} onClick={scrollToTop} style={{ backgroundColor: color }}>
                    &#8593;
                </button>

                {error && <div className="error-message">{error}</div>}

                <footer>
                    <div className='conteiner_hotmenu_logo'>
                        <img src="/logo-removebg-preview.png" alt="..." />
                    </div>
                    <label>© Copyright 2024 Hotmenu. Todos os direitos reservados.</label>
                </footer>
            </div>
        </CartProvider>
        </HelmetProvider>
    );
}

export default App;