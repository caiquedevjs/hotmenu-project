import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { fetchProducts, fetchEstabelecimentoData } from '../service/productService';
import './modal_search_component.css';

// Funções helpers de data e estoque (definidas fora do componente para melhor performance)
const DAY_MAP = { 0: { flag: "Domingo", ini: "DomingoIni", fim: "DomingoFim" }, 1: { flag: "Segunda", ini: "SegundaIni", fim: "SegundaFim" }, 2: { flag: "Terca",   ini: "TercaIni",   fim: "TercaFim"   }, 3: { flag: "Quarta",  ini: "QuartaIni",  fim: "QuartaFim"  }, 4: { flag: "Quinta",  ini: "QuintaIni",  fim: "QuintaFim"  }, 5: { flag: "Sexta",   ini: "SextaIni",   fim: "SextaFim"   }, 6: { flag: "Sabado",  ini: "SabadoIni",  fim: "SabadoFim"  }, };
const minutesOfDay = (dateStr) => { if (!dateStr) return null; const d = new Date(dateStr); if (isNaN(d)) return null; return d.getHours() * 60 + d.getMinutes(); };
const isProductAvailableNow = (product) => { const now = new Date(); const dow = now.getDay(); const { flag, ini, fim } = DAY_MAP[dow]; if (!product?.[flag]) return false; const startMin = minutesOfDay(product?.[ini]); const endMin   = minutesOfDay(product?.[fim]); if (startMin === null || endMin === null) return true; const nowMin = now.getHours() * 60 + now.getMinutes(); if (endMin < startMin) { return nowMin >= startMin || nowMin <= endMin; } return nowMin >= startMin && nowMin <= endMin; };
const hasStock = (product) => { if (!product?.ControlarEstoque) return true; const qty = typeof product?.EstoqueAtual === "number" ? product.EstoqueAtual : 0; return qty > 0; };


const ModalBusca = ({ show, handleClose, onProductSelect }) => {
    const { storeName } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [color, setColor] = useState("");
    const [products, setProducts] = useState([]);
    const [showUnavailableModal, setShowUnavailableModal] = useState(false);

    useEffect(() => {
        const fetchDataEstabelecimento = async () => {
            try {
                const data = await fetchEstabelecimentoData(storeName);
                if (data && data.CorPadrao) {
                    setColor(data.CorPadrao);
                }
            } catch (error) {
                console.error('Erro na busca do estabelecimento: ', error);
            }
        };
        if (storeName) fetchDataEstabelecimento();
    }, [storeName]);

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const data = await fetchProducts(storeName);
                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };
        if (storeName) fetchProductsData();
    }, [storeName]);
    
    useEffect(() => {
        if (!show) {
            setTimeout(() => setSearchTerm(''), 300);
        }
    }, [show]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.Nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductClick = (product) => {
        // Validação idêntica à do Grid_component
        if (!isProductAvailableNow(product) || !hasStock(product)) {
            setShowUnavailableModal(true);
            return;
        }
        
        // Se o produto estiver disponível, o fluxo normal continua
        onProductSelect(product);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>O que deseja procurar? 🍔🍟</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id='body_search_conteiner_id'>
                    <input
                        type='text'
                        placeholder='Digite o nome do produto...'
                        id='input_search_id'
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoFocus
                    />
                </div>

                <div className="container text-center" id='grid_products_id'>
                    <div className="row">
                        {searchTerm ? (
                            filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div className="col-6 col-md-4 mb-4" key={product.Id}>
                                        <div className="product-container">
                                            <p className="product-name" style={{ color: color }}>
                                                {product.Nome}
                                            </p>
                                            <img
                                                src={`https://hotmenu.com.br/arquivos/${product.Foto}`}
                                                alt={product.Nome}
                                                className={`img_category ${!isProductAvailableNow(product) || !hasStock(product) ? 'unavailable' : ''}`}
                                                onClick={() => handleProductClick(product)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (<p>Produto não encontrado</p>)
                        ) : (<p>Digite um termo para buscar...</p>)}
                    </div>
                </div>
            </Modal.Body>

            {/* Modal de aviso para produto indisponível */}
            {showUnavailableModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 id='info_text'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ color: color }}>
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                                    </svg>
                                </h3>
                                <button type="button" className="btn-close" onClick={() => setShowUnavailableModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Este produto está indisponível no momento. 😞</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ModalBusca;