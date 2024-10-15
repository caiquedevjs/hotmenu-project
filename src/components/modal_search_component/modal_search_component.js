import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import './modal_search_component.css';
import { fetchEstabelecimentoData, fetchProducts } from '../service/productService';
import { useParams } from 'react-router-dom'; // Importando useParams para capturar o nome do estabelecimento

const ModalBusca = ({ categories = [] }) => {
  const { storeName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [color, setColor] = useState("");
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do estabelecimento
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

  // Carregar produtos da API
  useEffect(() => {
    const fetchDataProducts = async () => {
      try {
        const data = await fetchProducts(storeName);
        setProducts(data);
      } catch (error) {
        setError('Erro ao buscar produtos');
        console.error('Erro na busca de produtos: ', error);
      }
    };

    fetchDataProducts();
  }, [storeName]);

  // Função para lidar com a mudança no termo de busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtra os produtos com base no termo de busca
  const filteredProducts = products.filter(product =>
    product.Nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para lidar com a seleção de produto e navegação para a categoria
  const handleProductClick = (product) => {
    setSelectedCategoryId(product.CategoriaId);
    // Esperar o fechamento do modal antes de rolar
    setTimeout(() => {
      const categoryElement = document.getElementById(`category-${product.CategoriaId}`);
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300); // Ajuste o tempo conforme necessário para garantir que o modal esteja fechado
  };

  // Função para lidar com o clique no ícone de busca
  const handleSearchIconClick = () => {
    if (filteredProducts.length > 0) {
      handleProductClick(filteredProducts[0]);
    } else {
      console.log('Nenhum produto encontrado para buscar');
    }
  };

  // Agrupa produtos por categoria
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.Id] = products.filter(product => product.CategoriaId === category.Id);
    return acc;
  }, {});

  return (
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

            {/* Exibir produtos filtrados ou categorias com foto do primeiro produto */}
            <div className="container text-center" id='grid_products_id'>
              <div className="row">
                {searchTerm ? (
                  filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <div className="col-6 col-md-4 mb-4" key={index}>
                        <div className="product-container">
                          <p className="product-name" style={{ color: color }}>{product.Nome}</p>
                          <img 
                            src={`https://hotmenu.com.br/arquivos/${product.Foto}`} 
                            alt={product.Nome} 
                            className="img-fluid product-image" 
                            id='product-image-id'
                            onClick={() => handleProductClick(product)} 
                            style={{ cursor: 'pointer' }} 
                            data-bs-dismiss="modal"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Produto não encontrado</p>
                  )
                ) : (
                  categories.length > 0 ? (
                    categories.map((category, catIndex) => {
                      const firstProduct = productsByCategory[category.Id]?.[0];
                      return (
                        <div key={catIndex} className="col-6 col-md-4 mb-4">
                          <div className="category-section">
                            <h4 className="category-title" style={{ color: color }}>{category.Nome}</h4>
                            {firstProduct ? (
                              <div className="product-container">
                                <img 
                                  src={`https://hotmenu.com.br/arquivos/${firstProduct.Foto}`} 
                                  alt={firstProduct.Nome} 
                                  className="img-fluid product-image" 
                                  id='product-image-id'
                                />
                              </div>
                            ) : (
                              <p>Sem produtos disponíveis</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>Não há categorias disponíveis</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBusca;
