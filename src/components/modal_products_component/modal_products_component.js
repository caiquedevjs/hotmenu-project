import React from "react";

const Modal_product_component = () =>{
    return (
      <div class="modal fade" id="product-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
          <div class="modal-header">
            <div id='product_title'><h4>
              Double big Melt
              </h4>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div id='product_modal_conteiner'>
              <div id='product_modal_img_conteiner'>
              </div>
              <div id='product_modal_questions'>
                <div id='product_modal_questions_header'>
                  <idv id="product_modal_questions_header_text_conteiner">
                     <img src="hambuger-1.png" class="img-thumbnail" alt="..."/>
                  </idv>
                  <div id='product_modal_description'>
                    150g de blend de carne, queijo, pão australiano, molho melt, cebola caramelizada
                  </div>
                  <div id='product_modal_questions_amount_conteiner'>
                    <div id='product_modal_questions_amount_title'>
                      <h4>Adicionais:</h4>
                      <h6>Escolha até 3 opções</h6>
                    </div>
                    <div id='product_modal_questions_amount'>
                      <p id='value'>0/3</p>
                      <div id='obrigatorio'><p>Obrigatorio</p></div>
                      
                    </div>
                  </div>
                  <div id='product_modal_options_conteiner'>
                  <div id='product_modal_options'>
                    <p>Tomate (R$2,50)<br></br>Max: 2un</p>
                  </div>
                  <div id='product_modal_options_icons'>
                  <button className='plus_buttom_options_product'><h5>+</h5></button>
                  <h5>0</h5>
                  <button><h5>-</h5></button>
                  </div>
                  </div>
                  <div id='product_modal_complemention_con'></div>
                </div>
              </div>
            </div>
          <div id='info_img_conteiner'>
              </div>
          </div>
          </div>
      </div>
      </div>
    )
};
export default Modal_product_component;