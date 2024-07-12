/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../service/productService';
import './Grid_component.css';
import Modal_product_component from '../modal_products_component/modal_products_component';
import ModalCartItems from '../modal_cart_itens/modal_cart_itens';

const Grid_component = ({ categoryId,categoryName}) => {

  
  // <------- estados dos produtos, carrinho de itens ------->
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const addToCart = (newItem) => {
    setCartItems([...cartItems, newItem]);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  // <-------Função para dividir o array de produtos em subarrays de 2 produtos------->
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

  // <-------Divide os produtos em linhas de 2 colunas------->
  const productsChunks = chunkArray(products, 2);

  
   // <-------Defina o número máximo de caracteres desejado na descrição do produto no grid------->
   const maxLength = 90;

   // <-------Função para truncar o texto------->
   const truncateText = (text) => {
     if (text.length <= maxLength) {
       return text;
     }
     return `${text.substring(0, maxLength)}...`;
   };

  return (
    <div className="container text-center">
      <ModalCartItems cartItems={cartItems} onClose={handleCloseCart} />

      {productsChunks.map((row, rowIndex) => (
        <div key={rowIndex} className="row g-2 mb-2">
          {row.map((product, index) => (
            <div key={index} className="col-sm-12 col-md-6">
              <div className="container-sm">
                <div id='card_container'>
                  <div id='text_category'>
                    <div className='product-conteiner'>
                      <div className='product-description'>
                        <p data-bs-toggle="modal" data-bs-target={`#product-modal-${product.Id}`} onClick={() => openModal(product)} id='product-title'>{product.Nome}</p>
                        <p className='product-description-title'>{truncateText(product.Descricao)}</p>
                        <strong><p className='product-description-price'> R${product.PrecoDeVenda}</p></strong> 
                      </div>
                      <img src={`https://hotmenu.com.br/arquivos/${product.Foto}`}className='product-img' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* <-------Renderização dos modais dinâmico-------> */}
      {products.map((product, index) => (
        <Modal_product_component
          key={`modal-${index}`}
          id={`product-modal-${product.Id}`}
          product={product}
          addToCart={addToCart}
          onClose={() => setSelectedProduct(null)}
          categoryName={categoryName}
        />
      ))}
    </div>
  );
};

export default Grid_component;
