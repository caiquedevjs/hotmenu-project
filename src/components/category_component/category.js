import React, { useState, useEffect } from 'react';
import './category_styles.css';
import Grid_component from '../Grid_component/Grid_component';
import { fetchCategories } from '../service/productService';

const Category_component = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await fetchCategories(); // Busca as categorias da API
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategoriesData();
  }, []);

  if (!categories || categories.length === 0) {
    return <div>A carregar...</div>;
  }

  return (
    <div className='category_component'>
      <div id='category_container'>
        {categories.map((category, index) => (
          <div key={index}>
            <div id='category_label_title'>
              <h4 className='category_title' id={`category-${category.Id}`}>{category.Nome}</h4>
            </div>
            <Grid_component categoryId={category.Id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category_component;
