/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../service/productService';
import './Grid_component.css';
import Modal_product_component from '../modal_products_component/modal_products_component';
import ModalCartItems from '../modal_cart_itens/modal_cart_itens';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const Grid_component = ({ categoryId, categoryName }) => {
  // Estados dos produtos, carrinho de itens
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [maxLength, setMaxLength] = useState(60);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productsData = await fetchProducts(); // Busca todos os produtos
        const filteredProducts = productsData.filter(product => product.CategoriaId === categoryId);
        setProducts(filteredProducts);
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

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  // Função para adicionar ao carrinho
  const onAddToCart = (cartItem) => {
    setCartItems([...cartItems, cartItem]);
    console.log('Item adicionado ao carrinho:', cartItem);
  };

  // Função para dividir o array de produtos em subarrays de 2 produtos
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

  // Divide os produtos em linhas de 2 colunas
  const productsChunks = chunkArray(products, 2);

  // Função para truncar o texto
  const truncateText = (text) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div className="container text-center">
      <ModalCartItems cartItems={cartItems} onClose={handleCloseCart} isOpen={isCartOpen} />
      
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag-fill" viewBox="0 0 16 16">
                              <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                            </svg> R${product.PrecoDeVenda}
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

      {/* Renderização dos modais dinâmico */}
      {products.map((product, index) => (
        <Modal_product_component
          key={`modal-${index}`}
          id={`product-modal-${product.Id}`}
          product={product}
          onClose={() => setSelectedProduct(null)}
          categoryName={categoryName}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default Grid_component;
