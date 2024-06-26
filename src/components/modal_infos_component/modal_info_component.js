import React from 'react';

const Modal_infos_component = () =>{
    return(
        <div class="modal fade" id="info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h3 id='info_text'>informações</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <div id='info_img_conteiner'>
                        <img src="attachment_71444173.png" id='logo_info' class="img-thumbnail" alt="info logo"/>
                        <p id='info_endreco'>Avenida Caminho de Areia- Roma, cep : 0000000</p>
                        <div id='info_social_icons'>
                        <img src="instagram-icone-icon.png" id='logo_social_icons_png'/>
                        <img src="whatsapp.png" id='logo_social_icons_png'/>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
    )
};
 
export default Modal_infos_component;