/* eslint-disable react/jsx-pascal-case */
// Arquivo: App.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

// Importação dos seus componentes
import Header_component from './components/header_component/header';
import Status_moment_component from './components/status_moment_component/status_moment';
import Infos_component from './components/infos_component/infos';
import Infos_icons_component from './components/infos_icons_component/infos_icons';
import Selector_category_component from './components/selector_category_component/selector_category';
import Category_component from './components/category_component/category';
import ModalBusca from './components/modal_search_component/modal_search_component';
// Precisamos do Offcanvas aqui também
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

    // ✅ === ESTADOS PARA MODAIS E OFFCANVAS ===
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    useEffect(() => {
        // Seu useEffect para buscar todos os dados continua o mesmo
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
        // Seu useEffect para o botão de scroll continua o mesmo
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // ✅ === FUNÇÕES DE CONTROLE ===

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
        handleOpenOffcanvas(product);
    };

    return (
        <div className="App">
            <PrimeReactProvider>
                {/* ✅ Passando a função e a cor para o Header */}
                <Header_component onSearchClick={handleOpenSearch}/>
                <Status_moment_component />
                <Infos_component />
                <Infos_icons_component />
                {/* O seu Category_component provavelmente precisará de 'onProductClick={handleOpenOffcanvas}' */}
                <Category_component categories={categories} products={products} onProductClick={handleOpenOffcanvas} />
                <Selector_category_component />
                
                {/* ✅ Passando as props de controle para o ModalBusca */}
                <ModalBusca
                    show={showSearchModal}
                    handleClose={handleCloseSearch}
                    onProductSelect={handleProductSelectedFromSearch}
                />
                
                {/* ✅ Renderização do Offcanvas controlada aqui */}
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
                    <img src="/logo-removebg-preview.png" alt="..." /> {/* Use / no início para caminhos da pasta public */}
                </div>
                <label>© Copyright 2024 Hotmenu. Todos os direitos reservados.</label>
            </footer>
        </div>
    );
}

export default App;