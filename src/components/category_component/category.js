import React, { useState, useEffect, useMemo } from 'react';
import './category_styles.css';
import Grid_component from '../Grid_component/Grid_component';
import { fetchCategories, fetchEstabelecimentoData, fetchProducts } from '../service/productService';
import SelectorCategoryComponent from '../selector_category_component/selector_category';
import ModalBusca from '../modal_search_component/modal_search_component';
import { useParams } from 'react-router-dom';

const Category_component = () => {
  const { storeName } = useParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [color, setColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // OTIMIZAÇÃO 1: Unificar todas as buscas de dados em um único useEffect.
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Usamos Promise.all para fazer as 3 buscas em paralelo.
        const [fetchedCategories, establishmentData, fetchedProducts] = await Promise.all([
          fetchCategories(storeName),
          fetchEstabelecimentoData(storeName),
          fetchProducts(storeName)
        ]);

        // Processa e define os estados de uma só vez.
        setCategories(fetchedCategories);
        setProducts(fetchedProducts);

        if (establishmentData && establishmentData.CorPadrao) {
          setEstabelecimento(establishmentData);
          setColor(establishmentData.CorPadrao);
        } else {
          setError('Nenhum dado do estabelecimento recebido da API');
        }

      } catch (err) {
        console.error('Erro ao buscar dados da página:', err);
        setError('Erro ao carregar os dados.');
      } finally {
        setIsLoading(false);
      }
    };

    if (storeName) {
      fetchAllData();
    }
  }, [storeName]);

  // OTIMIZAÇÃO 2: Memoizar o processamento das categorias.
  // Este cálculo só será refeito se o state `categories` mudar.
  const sortedCategories = useMemo(() => {
    return categories
      .filter(category => !category.Removido)
      .sort((a, b) => a.Ordem - b.Ordem);
  }, [categories]);

  if (isLoading) {
    return (
      <div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='category_component'>
      {sortedCategories.length > 0 && <SelectorCategoryComponent categories={sortedCategories} products={products} />}
      <div id='category_container'>
        {/* Agora mapeamos as categorias já filtradas e ordenadas */}
        {sortedCategories.map(category => {
          // OTIMIZAÇÃO 3: Filtrar os produtos para cada categoria aqui no componente pai.
          const productsForCategory = products.filter(product => product.CategoriaId === category.Id);

          return (
            <div key={category.Id}>
              <div id='category_label_title'>
                <h4 className='category_title' id={`category-${category.Id}`} style={{ backgroundColor: color }}>{category.Nome}</h4>
              </div>
              {/* Passamos apenas os produtos relevantes para o Grid_component */}
              <Grid_component 
                categoryId={category.Id} 
                categoryName={category.Nome} 
                products={productsForCategory} // <-- Passando os produtos como prop
              />
            </div>
          );
        })}
      </div>
      <ModalBusca categories={sortedCategories} />
    </div>
  );
};

export default Category_component;