import React from 'react';
import { FaSearch} from "react-icons/fa";
const ModalBusca = ({ categories }) => {
  return (
    <div className="modal fade" id="modal_search_id" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div id='body_search_conteiner_id'>
              <input type='text' placeholder='O que deseja procurar?' id='input_search_id' />
              
              <FaSearch id='modal_search_icon_id' style={{ width: '20px', height: '20px', color: '#fa6b18', marginTop: '10px', cursor: 'pointer' }} /> 
            </div>
            <div className="container text-center" id='grid_category_id'>
              <div className="row">
                {categories && categories.length > 0 && (
                  categories.map((category, index) => (
                    <div className="col" key={index}>
                      <div id='img_category_conteiner'>
                        <a href={`#category-${category.Id}`} className="category-link">
                        <p id='text_category_id' data-bs-dismiss="modal" aria-label="Close">{category.Nome}</p>
                        </a>
                        
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBusca;
