import React from 'react';

const CategoryItem = ({ category, firstProduct, onCategoryClick }) => {
  // Se não houver produto para a categoria, podemos optar por não renderizar nada
  if (!firstProduct) {
    return null; 
  }

  return (
    <div className="category" key={category.Id}>
      <div className="category-item" onClick={() => onCategoryClick(category.Id)}>
        <img
          src={`https://hotmenu.com.br/arquivos/${firstProduct.Foto}`}
          alt={category.Nome}
          className="category-image"
          // Adiciona lazy loading para melhorar o carregamento inicial
          loading="lazy" 
        />
        <h4 className="category-title">{category.Nome}</h4>
      </div>
    </div>
  );
};

// Envolvemos com React.memo para evitar re-renderizações desnecessárias
export default React.memo(CategoryItem);