/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton'; // 1. IMPORTAÇÃO ADICIONADA
import 'react-loading-skeleton/dist/skeleton.css'; // 2. IMPORTAÇÃO ADICIONADA
import { fetchProducts, fetchEstabelecimentoData } from '../service/productService';
import './Grid_component.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { useParams } from 'react-router-dom';

// A importação do seu componente continua a mesma
import Modal_product_component from '../modal_products_component/modal_products_component';

// Funções helpers de data e estoque (sem alteração)
const DAY_MAP = { 0: { flag: "Domingo", ini: "DomingoIni", fim: "DomingoFim" }, 1: { flag: "Segunda", ini: "SegundaIni", fim: "SegundaFim" }, 2: { flag: "Terca",   ini: "TercaIni",   fim: "TercaFim"   }, 3: { flag: "Quarta",  ini: "QuartaIni",  fim: "QuartaFim"  }, 4: { flag: "Quinta",  ini: "QuintaIni",  fim: "QuintaFim"  }, 5: { flag: "Sexta",   ini: "SextaIni",   fim: "SextaFim"   }, 6: { flag: "Sabado",  ini: "SabadoIni",  fim: "SabadoFim"  }, };
const minutesOfDay = (dateStr) => { if (!dateStr) return null; const d = new Date(dateStr); if (isNaN(d)) return null; return d.getHours() * 60 + d.getMinutes(); };
const isProductAvailableNow = (product) => { const now = new Date(); const dow = now.getDay(); const { flag, ini, fim } = DAY_MAP[dow]; if (!product?.[flag]) return false; const startMin = minutesOfDay(product?.[ini]); const endMin   = minutesOfDay(product?.[fim]); if (startMin === null || endMin === null) return true; const nowMin = now.getHours() * 60 + now.getMinutes(); if (endMin < startMin) { return nowMin >= startMin || nowMin <= endMin; } return nowMin >= startMin && nowMin <= endMin; };
const hasStock = (product) => { if (!product?.ControlarEstoque) return true; const qty = typeof product?.EstoqueAtual === "number" ? product.EstoqueAtual : 0; return qty > 0; };

const Grid_component = ({ categoryId, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [maxLength, setMaxLength] = useState(60);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const { storeName } = useParams();

  useEffect(() => {
    // Busca de dados do estabelecimento
    const fetchDataEstabelecimento = async () => { try { const data = await fetchEstabelecimentoData(storeName); if (data && data.CorPadrao) { setEstabelecimento(data); setColor(data.CorPadrao); } else { setError('Nenhum dado recebido da API'); } } catch (error) { setError('Erro ao buscar dados do estabelecimento'); console.error('Erro na busca: ', error); } finally { setLoading(false); } };
    fetchDataEstabelecimento();
  }, [storeName]);
  
  useEffect(() => {
    // Busca dos produtos
    const fetchAllProducts = async () => { try { const productsData = await fetchProducts(storeName); const filteredProducts = productsData.filter(p => p.CategoriaId === categoryId).filter(p => isProductAvailableNow(p)); setProducts(filteredProducts); } catch (error) { console.error('Erro ao buscar os produtos:', error); } };
    fetchAllProducts();
  }, [categoryId, storeName]);

  const openProductDetails = (product) => {
    if (!isProductAvailableNow(product) || !hasStock(product)) {
      setShowUnavailableModal(true);
      return;
    }
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const closeProductDetails = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };
  
  // Funções helpers de layout
  const chunkArray = (arr, chunkSize) => { let index = 0; const arrayLength = arr.length; let tempArray = []; for (index = 0; index < arrayLength; index += chunkSize) { const chunk = arr.slice(index, index + chunkSize); tempArray.push(chunk); } return tempArray; };
  const productsChunks = chunkArray(products, 2);
  const truncateText = (text) => { if (!text) return ''; if (text.length <= maxLength) return text; return `${text.substring(0, maxLength)}...`; };
  const formatPrice = (price) => { if (typeof price !== 'number') return '0,00'; return price.toFixed(2).replace('.', ','); };

  return (
    <div className="container text-center">
      {productsChunks.map((row, rowIndex) => (
        <div key={rowIndex} className="row g-2 mb-2">
          {row.map((product, index) => (
            <div key={index} className="col-sm-12 col-md-6">
              <div className="container-sm">
                <div id='card_container' onClick={() => openProductDetails(product)} style={{ cursor: 'pointer' }}>
                  <div id='text_category'>
                    <div className='product-description'>
                      <p id='product-title'>{product.Nome}</p>
                      <p className='product-description-title'>{truncateText(product.Descricao)}</p>
                      <div className='conteiner-price'><strong><p className='product-description-price'>
                        {!hasStock(product) ? (<span style={{ color: 'red' }}>Indisponível</span>) : product.EhDivisivel ? (<span>por sabor</span>) : product.PartesProduto !== null ? (<span>por tamanho</span>) : (<><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag-fill" viewBox="0 0 16 16" style={{ color: color }}><path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>{' '}R${formatPrice(product.PrecoDeVenda)}</>)}
                      </p></strong></div>
                    </div>

                    {/* --- 3. ATUALIZAÇÃO APLICADA AQUI --- */}
                    {(product && product.Foto) ? (
                      <img 
                        src={`https://hotmenu.com.br/arquivos/${product.Foto}`} 
                        className='product-img' 
                        alt={product.Nome} 
                      />
                    ) : (
                      <Skeleton className='product-img' />
                    )}
                    {/* --- FIM DA ATUALIZAÇÃO --- */}

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Renderização do componente de detalhes */}
      <Modal_product_component
        show={showDetails}
        handleClose={closeProductDetails}
        product={selectedProduct}
      />

      {/* Modal de produto indisponível */}
      {showUnavailableModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
           <div className="modal-dialog">
             <div className="modal-content">
               <div className="modal-header">
                 <h3 id='info_text'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ color: color }}><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/></svg></h3>
                 <button type="button" className="btn-close" onClick={() => setShowUnavailableModal(false)}></button>
               </div>
               <div className="modal-body"><p>Este produto está indisponível no momento. 😞</p></div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default Grid_component;