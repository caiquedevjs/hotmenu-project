import React from 'react';
import '../selector_category_component/selector_category.css';

const handleSelectChange = (event) => {
    const selectedSection = event.target.value;
    if (selectedSection) {
      // Scroll suave até a seção selecionada
      document.getElementById(selectedSection).scrollIntoView({ behavior: 'smooth' });
    }
  };
  
// componente de seleção de categorias
const SelectorCategoryComponent = () => {
    const selectStyle = {
        width: '5%', 
        border : 'none',
       backgroundColor : 'white'
       
    };
   
    return (
        <div className='selector_category_component'>
            <div className='flex_box'>
            <div className='flexbox_conteiner_class'>
                <h3 id='select_title'>Categorias</h3>
                <select className="form-select" aria-label="Default select example" style={selectStyle} onChange={handleSelectChange}>
                    <option selected id='selected_id'>Categorias</option>
                    <option value="promoções">Promoções</option>
                    <option value="hamburger">Hamburger</option>
                    <option value="pizza">Pizza</option>
                    <option value="pastel">Pastel</option>
                    <option value="3">Bebidas</option>
                </select>
            </div>
            </div>
        </div>
    )
}

export default SelectorCategoryComponent;
