import React, { useState, useEffect } from 'react';
import { fetchProducts,fetchEstabelecimentoData } from '../service/productService';
import './Grid_component.css';
import Modal_product_component from '../modal_products_component/modal_products_component';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const Grid_component = ({ categoryId, categoryName }) => {
  // <---------- Variaveis de estados ---------->
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [maxLength, setMaxLength] = useState(60);
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
    const fetchAllProducts = async () => {
      try {
        const productsData = await fetchProducts(); // Busca todos os produtos
        const filteredProducts = productsData.filter(product => product.CategoriaId === categoryId);
        setProducts(filteredProducts);

        // Verificar a URL após carregar os produtos
        const hash = window.location.hash.substring(1);
        if (hash) {
          const productId = hash.split('-')[2]; // Obtém o ID do produto do hash
          const product = filteredProducts.find(p => p.Id === parseInt(productId, 10));
          if (product) {
            setSelectedProduct(product);
            setTimeout(() => {
              const modalElement = document.getElementById(hash);
              if (modalElement) {
                modalElement.style.display = 'block'; // Exibe o modal
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };

    fetchAllProducts();
  }, [categoryId]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setMaxLength(isMobile ? 38 : 60);
    };

    handleResize(); // Inicializa o estado com o valor correto
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const openModal = (product) => {
    setSelectedProduct(product);
    window.history.pushState(null, '', `/#product-modal-${product.Id}`);
  };

  // <----------  Função para dividir o array de produtos em subarrays de 2 produtos ---------->
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

  // <---------- Divide os produtos em linhas de 2 colunas ---------- >
  const productsChunks = chunkArray(products, 2);

  // <---------- Função para truncar o texto ---------->
  const truncateText = (text) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  // <---------- Função para formatar o preço ---------->
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ','); // Formata o preço para ter duas casas decimais e substitui o ponto por vírgula (opcional)
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
                      <p data-bs-toggle="modal" data-bs-target={`#product-modal-${product.Id}`} onClick={() => openModal(product)} id='product-title'>{product.Nome}</p>
                      <p className='product-description-title'>{truncateText(product.Descricao)}</p>
                      <div className='conteiner-price'>
                        <strong>
                          <p className='product-description-price'
                            data-tooltip-id="tooltip-preço-venda"
                            data-tooltip-content="preço de venda"
                            data-tooltip-place="top">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag-fill" viewBox="0 0 16 16" style={{color : color}}>
                              <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                            </svg> R${formatPrice(product.PrecoDeVenda)}
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

      {/* <---------- Renderização dos modais dinâmico ----------> */}
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

      {/* Renderiza o modal do produto selecionado */}
      {selectedProduct && (
        <Modal_product_component
          id={`product-modal-${selectedProduct.Id}`}
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            window.history.pushState(null, '', '/');
          }}
          categoryName={categoryName}
        />
      )}
    </div>
  );
};

export default Grid_component;
