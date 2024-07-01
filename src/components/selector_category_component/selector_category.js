import React from 'react';
import '../selector_category_component/selector_category.css';


// componente de seleção de categorias
const SelectorCategoryComponent = () => {
   
   
    return (
        <div className='selector_category_component'>
            <div class="dropdown">
  <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> Categorias
    
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#hamburger">hamburger</a></li>
    <li><a class="dropdown-item" href="#pizza">pizza</a></li>
    <li><a class="dropdown-item" href="#pastel">pastel</a></li>
    <li><a class="dropdown-item" href="#bebida">bebida</a></li>
  </ul>
</div>
        </div>
    )
}

export default SelectorCategoryComponent;
