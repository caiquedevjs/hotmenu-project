import React, { useState, useEffect } from 'react';
import './category_styles.css';
import Grid_component from '../Grid_component/Grid_component';
import { fetchCategories, fetchEstabelecimentoData, fetchProducts } from '../service/productService';
import SelectorCategoryComponent from '../selector_category_component/selector_category';
import ModalBusca from '../modal_search_component/modal_search_component';
import { useParams } from 'react-router-dom';

const Category_component = () => {
  const { storeName } = useParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // Estado para produtos
  const [isLoading, setIsLoading] = useState(true);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await fetchCategories(storeName);
        const filteredCategories = fetchedCategories
          .filter(category => !category.Removido)
          .sort((a, b) => a.Ordem - b.Ordem);
        setCategories(filteredCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        setIsLoading(false);
      }
    };

    if(storeName) {
      fetchCategoriesData();
    }
  }, [storeName]);

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

  // Novo useEffect para buscar produtos
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const fetchedProducts = await fetchProducts(storeName); // Função para buscar produtos
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    if (storeName) {
      fetchProductsData();
    }
  }, [storeName]);

  if (isLoading) {
    return (
      <div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='category_component'>
      {categories.length > 0 && <SelectorCategoryComponent categories={categories} products={products} />}
      <div id='category_container'>
        {categories.map((category, index) => (
          <div key={index}>
            <div id='category_label_title'>
              <h4 className='category_title' id={`category-${category.Id}`} style={{ backgroundColor: color }}>{category.Nome}</h4>
            </div>
            <Grid_component categoryId={category.Id} categoryName={category.Nome} />
          </div>
        ))}
      </div>
      <ModalBusca categories={categories} />
    </div>
  );
};

export default Category_component;
