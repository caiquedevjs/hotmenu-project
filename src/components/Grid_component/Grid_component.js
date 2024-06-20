import React from 'react';
import { Product_state } from '../grid_products_component/grid_products_component';

const Grid_component = ({ category }) => {
  // Função para filtrar os produtos por categoria e dividir o array em linhas de 2 produtos
  const splitProductsIntoRows = (category) => {
    const filteredProducts = Product_state.products.filter(product => product.category === category);
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const row = filteredProducts.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  };

  return (
    <div className="container text-center">
      {splitProductsIntoRows(category).map((row, rowIndex) => (
        <div key={rowIndex} className="row g-2 mb-4 ">
          {row.map((product, colIndex) => (
            <div key={colIndex} className="col-sm-12 col-md-6">
              <div className="container-sm">
                <div id='card_conteiner'>
                  <div id='text_category'>
                    <h3>{product.title}</h3>
                    <p>{product.price}</p>
                  </div> 
                  <img src={product.img} alt={product.title} />
                </div>
              </div>
            </div>
          ))}
          
        </div>
      ))}
    </div>
  );
};

export default Grid_component;
