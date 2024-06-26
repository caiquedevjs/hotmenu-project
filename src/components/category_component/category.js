import React from 'react';
import '../category_component/category_styles.css';
import '../category_component/modal_product_styles.css';

import Grid_component from '../Grid_component/Grid_component';

const Category_component = () => {
  return (
    <div className='category_component'>
      
      
      <div id='category_conteniner'>
        {/* Categoria Hamburger */}
        <div id='category_label_title'>
          <h4 className='category_title' id='hamburger'>Hamburger</h4>
        </div>
        <Grid_component category='hamburger' />

        {/* Categoria Pizza */}
        <div id='category_label_title'>
          <h4 className='category_title' id='pizza'>Pizza</h4>
        </div>
        <Grid_component category='pizza' />
        

        {/* Categoria Pastel */}
        <div id='category_label_title'>
          <h4 className='category_title' id='pastel'>Pastel</h4>
        </div>
        <Grid_component category='pastel' />

         {/* Categoria Bebida */}
         <div id='category_label_title'>
          <h4 className='category_title' id='bebida'>Bebidas</h4>
        </div>
        <Grid_component category='bebida' />
      </div>
    </div>
  );
};

export default Category_component;
