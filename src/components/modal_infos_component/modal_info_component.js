/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import './modal_info.css';

const Modal_infos_component = () =>{
    // <---------- Modal de Informações ---------->
    return(
        <div class="modal fade" id="info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h3 id='info_text'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{'color': '#ce2929'}}>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                            </svg>
                            informações</h3>
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