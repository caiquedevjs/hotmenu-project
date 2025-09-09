import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './selector_category.css';

const CategoryItem = ({ category, firstProduct, onCategoryClick }) => {
  const hasImage = firstProduct && firstProduct.Foto;

  if (!hasImage) {
    // --- Bloco do SKELETON ---
    return (
      <div className="category" key={category.Id}>
        <div className="category-item" onClick={() => onCategoryClick(category.Id)}>
          
          {/* 1. O Skeleton usa a classe da imagem */}
          <Skeleton className="category-image" circle={true} />
          
          <h4 className="category-title" >{category.Nome}</h4>

        </div>
      </div>
    );
  }

  // --- Bloco da IMAGEM REAL ---
  return (
    <div className="category" key={category.Id}>
      <div className="category-item" onClick={() => onCategoryClick(category.Id)}>
        
        {/* 1. A Imagem real usa sua classe */}
        <img
          src={`https://hotmenu.com.br/arquivos/${firstProduct.Foto}`}
          alt={category.Nome}
          className="category-image"
          loading="lazy"
        />
        <h4 className="category-title-img">{category.Nome}</h4>

      </div>
    </div>
  );
};

export default React.memo(CategoryItem);