import React, { useEffect, useState } from 'react';
import { fetchEstabelecimentoData } from '../service/productService';
import useHover from '../../utils/headerHoverHandlers';
import './selector_category.css';
import { useParams } from 'react-router-dom';
import ModalProductComponent from '../modal_products_component/modal_products_component';

const SelectorCategoryComponent = ({ categories, products }) => {
  const { storeName } = useParams();
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const categoriaHover = useHover();

  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData(storeName);
        if (data && data.CorPadrao) {
          setEstabelecimento(data);
          setColor(data.CorPadrao);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do estabelecimento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataEstabelecimento();
  }, [storeName]);

  const handleProductClick = (product) => {
    if (!product.ControlarEstoque || product.EstoqueAtual > 0) {
      setSelectedProduct(product);
      window.history.pushState(null, '', `/#product-modal-${product.Id}`);
    } else {
      setShowUnavailableModal(true);
    }
  };

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  if (!categories || categories.length === 0) {
    return <p>Sem categorias disponíveis.</p>;
  }

  return (
    <div className='selector_category_component'>
      <div className="category-scroll-container">
        {categories.map((category) => {
          const firstProduct = products.find(product => product.CategoriaId === category.Id);
          return (
            <div className="category" key={category.Id}>
              {firstProduct ? (
                <div className="category-item" onClick={() => handleProductClick(firstProduct)}>
                  <img
                    src={`https://hotmenu.com.br/arquivos/${firstProduct.Foto}`}
                    alt={firstProduct.Nome}
                    className="category-image"
                  />
                  <h4>{category.Nome}</h4>
                </div>
              ) : (
                <p>Sem produtos disponíveis</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal para o Produto Selecionado */}
      {selectedProduct && (
        <ModalProductComponent
          id={`product-modal-${selectedProduct.Id}`}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          categoryName={selectedProduct.CategoriaId}
        />
      )}

      {/* Modal para Produto Indisponível */}
      {showUnavailableModal && (
        <div className="modal fade show" id="unavailable-modal" tabIndex="-1" aria-labelledby="unavailable-modalLabel" aria-hidden="true" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={{ color }}>
                  {/* SVG de informação */}
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

export default SelectorCategoryComponent;
