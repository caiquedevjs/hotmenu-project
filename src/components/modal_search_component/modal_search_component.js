import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchEstabelecimentoData } from '../service/productService';
import './modal_search_component.css';
import Modal_product_component from '../modal_products_component/modal_products_component';
import { useParams } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

const ModalBusca = ({ categories = [], onProductSelect }) => {
  const { storeName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [color, setColor] = useState("");
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false); // Estado para controlar o modal de produto indisponível
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData(storeName);
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
  }, [storeName]);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const data = await fetchProducts(storeName);
        setProducts(data);
      } catch (error) {
        setError('Erro ao buscar produtos');
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProductsData();
  }, [storeName]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.Nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedCategoryId(product.CategoriaId);

    // Verifica se o produto está disponível ou não
    if (product.EstoqueAtual > 0) {
      setSelectedProduct(product);
    } else {
      setShowUnavailableModal(true); // Exibe o modal de produto indisponível
    }
  };

  const handleSearchIconClick = () => {
    if (filteredProducts.length > 0) {
      handleProductClick(filteredProducts[0]);
    } else {
      console.log('Nenhum produto encontrado para buscar');
    }
  };

  return (
    <div>
      <div className="modal fade" id="modal_search_id" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div id='body_search_conteiner_id'>
                <input
                  type='text'
                  placeholder='O que deseja procurar?'
                  id='input_search_id'
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FaSearch
                  id='modal_search_icon_id'
                  onClick={handleSearchIconClick}
                  style={{ width: '20px', height: '20px', color: color, marginTop: '10px', cursor: 'pointer' }}
                />
              </div>

              <div className="container text-center" id='grid_products_id'>
                <div className="row">
                  {searchTerm ? (
                    filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <div className="col-6 col-md-4 mb-4" key={index}>
                          <div className="product-container">
                            <p className="product-name" style={{ color: color }} 
                               data-bs-toggle={product.EstoqueAtual > 0 ? 'modal' : ''}
                               data-bs-target={product.EstoqueAtual > 0 ? `#product-modal-${product.Id}` : ''}
                               onClick={() => handleProductClick(product)}>
                               {product.Nome}
                            </p>
                              
                            
                            <img
                              src={`https://hotmenu.com.br/arquivos/${product.Foto}`}
                              alt={product.Nome}
                              className="img_category"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Produto não encontrado</p>
                    )
                  ) : (
                    <p>Digite um termo para buscar...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Renderização dos modais dinâmico */}
      {products.map((product, index) => (
        product.EstoqueAtual > 0 ? (
          <Modal_product_component
            key={`modal-${index}`}
            id={`product-modal-${product.Id}`}
            product={product}
            onClose={() => setSelectedProduct(null)}
            categoryName={categories.find(cat => cat.Id === product.CategoriaId)?.Nome}
          />
        ) : null
      ))}

      {/* Modal para Produto Indisponível */}
      {showUnavailableModal && (
        <div className="modal fade show" id="unavailable-modal" tabIndex="-1" aria-labelledby="unavailable-modalLabel" aria-hidden="true" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 id='info_text'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ color: color }}>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                  </svg>
                </h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowUnavailableModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Este produto está indisponível no momento. 😞</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalBusca;
