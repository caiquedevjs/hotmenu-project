/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import './category_styles.css';
import Grid_component from '../Grid_component/Grid_component';
import { fetchCategories } from '../service/productService';
import SelectorCategoryComponent from '../selector_category_component/selector_category';
import ModalBusca from '../modal_search_component/modal_search_component';
const Category_component = () => {


  // <------- Estados das categorias ------->
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // <------- Logica da busca por catgeorias na API ------->
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await fetchCategories(); // <------- Busca as categorias da API ------->
        setCategories(fetchedCategories);
        setIsLoading(false); // <------- Marca o carregamento como completo ------->
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        setIsLoading(false); // <------- Marca o carregamento como completo mesmo em caso de erro ------->
      }
    };

    fetchCategoriesData();
  }, []);

  if (isLoading) {
    return <div>
      <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
    </div>;
  }

  return (
    <div className='category_component'>
      {categories.length > 0 && <SelectorCategoryComponent categories={categories} />}
      <div id='category_container'>
        {categories.map((category, index) => (
          <div key={index}>
            <div id='category_label_title'>
              <h4 className='category_title' id={`category-${category.Id}`}>{category.Nome}</h4>
            </div>
            {/* <-------Renderiza o grid de categorias e passa as categoria.Id e categoria.Nome como propriedade-------> */}
            <Grid_component categoryId={category.Id} categoryName={category.Nome} />
          </div>
        ))}
      </div>
      {/* <-------Renderiza o ModalBusca e passa as categorias como propriedade-------> */}
      <ModalBusca categories={categories} /> 
    </div>
  );
};

export default Category_component;
