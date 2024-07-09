import React from 'react';
import './selector_category.css';

const SelectorCategoryComponent = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null; // <-----------Retorna null ou algum componente de carregamento se não houver categorias ainda----------->
  }

  return (
    <div className='selector_category_component'>
      <div className="dropdown">
        <button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Categorias
        </button>
        <ul className="dropdown-menu">
          {categories.map((category, index) => (
            <li key={index}><a className="dropdown-item" href={`#category-${category.Id}`}>{category.Nome}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectorCategoryComponent;
