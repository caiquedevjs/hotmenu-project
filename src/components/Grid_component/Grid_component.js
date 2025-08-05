import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchEstabelecimentoData } from '../service/productService';
import './Grid_component.css';
import Modal_product_component from '../modal_products_component/modal_products_component';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { useParams } from 'react-router-dom'; // Importando useParams para pegar o nome da URL
import { Modal } from 'bootstrap'; // Importando a API do Bootstrap

const Grid_component = ({ categoryId, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [maxLength, setMaxLength] = useState(60);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const { storeName } = useParams(); 

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
    const fetchAllProducts = async () => {
      try {
        const productsData = await fetchProducts(storeName);
        const filteredProducts = productsData.filter(product => product.CategoriaId === categoryId);
        setProducts(filteredProducts);
  
        // Captura o hash da URL, por exemplo: #product-modal-123
        const hash = window.location.hash.substring(1); // Remove o #
        if (hash) {
          const productId = hash.split('-')[2]; // Extrai o ID do produto
          const product = filteredProducts.find(p => p.Id === parseInt(productId, 10));
          if (product && product.EstoqueAtual > 0) {
            openModal(product); // Aciona a função openModal para abrir o modal do produto
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };
  
    fetchAllProducts();
  }, [categoryId, storeName]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const productId = hash.split('-')[2];
        const product = products.find(p => p.Id === parseInt(productId, 10));
        if (product && product.EstoqueAtual > 0) {
          openModal(product);
        }
      }
    };
  
    window.addEventListener('hashchange', handleHashChange);
  
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [products]);
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setMaxLength(isMobile ? 38 : 60);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openModal = (product) => {
    if (!product.ControlarEstoque) {
      setSelectedProduct(product);
      window.history.pushState(null, '', `${storeName}/#product-modal-${product.Id}`);
  
      const modalElement = document.getElementById(`product-modal-${product.Id}`);
      const bootstrapModal = new Modal(modalElement);
      bootstrapModal.show();
    } else if (product.EstoqueAtual === 0) {
      setShowUnavailableModal(true);
    } else {
      setSelectedProduct(product);
      window.history.pushState(null, '', `${storeName}/#product-modal-${product.Id}`);
  
      const modalElement = document.getElementById(`product-modal-${product.Id}`);
      const bootstrapModal = new Modal(modalElement);
      bootstrapModal.show();
    }
  };
  
  const chunkArray = (arr, chunkSize) => {
    let index = 0;
    const arrayLength = arr.length;
    let tempArray = [];

    for (index = 0; index < arrayLength; index += chunkSize) {
      const chunk = arr.slice(index, index + chunkSize);
      tempArray.push(chunk);
    }

    return tempArray;
  };

  const productsChunks = chunkArray(products, 2);

  const truncateText = (text) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  const closeUnavailableModal = () => {
    setShowUnavailableModal(false);
  };

  return (
    <div className="container text-center">
      {productsChunks.map((row, rowIndex) => (
        <div key={rowIndex} className="row g-2 mb-2">
          {row.map((product, index) => (
            <div key={index} className="col-sm-12 col-md-6">
              <div className="container-sm">
                <div id='card_container'>
                  <div id='text_category'>
                    <div className='product-description'>
                      <p 
                        onClick={() => openModal(product)} 
                        id='product-title' 
                        style={product.EstoqueAtual === 0 ? { cursor: 'not-allowed' } : {}}
                      >
                        {product.Nome}
                      </p>
                      <p className='product-description-title'>{truncateText(product.Descricao)}</p>
                      <div className='conteiner-price'>
                        <strong>
                          <p 
                            className='product-description-price'
                            data-tooltip-id="tooltip-preço-venda"
                            data-tooltip-content="preço de venda"
                            data-tooltip-place="top"
                          >
                            {product.EstoqueAtual === 0 ? (
                                <span style={{ color: 'red' }}>Indisponível</span>
                              ) : product.EhDivisivel ? (
                                <span>por sabor</span>
                              ) : product.PartesProduto !== null ? (
                                <span>por tamanho</span>
                              ) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-tag-fill"
                                    viewBox="0 0 16 16"
                                    style={{ color: color }}
                                  >
                                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                  </svg> R${formatPrice(product.PrecoDeVenda)}
                                </>
                              )}

                            <Tooltip id="tooltip-preço-venda" />
                          </p>
                        </strong>
                      </div>
                    </div>
                    <img src={`https://hotmenu.com.br/arquivos/${product.Foto}`} className='product-img' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Renderiza todos os modais */}
      {products.map((product, index) => (
        <Modal_product_component
          key={`modal-${index}`}
          id={`product-modal-${product.Id}`}
          product={product}
          onClose={() => {
            setSelectedProduct(null);
            window.history.pushState(null, '', '/');
          }}
          categoryName={categoryName}
        />
      ))}

      {/* Modal para Produto Indisponível */}
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

export default Grid_component;
