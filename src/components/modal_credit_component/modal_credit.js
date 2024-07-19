import React from "react";
import './modal_credit.css';

const Modal_credit_component = () =>{
// <---------- Modal de Formas de pgamentos ---------->
    return(
        <div class="modal fade" id="credit-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                       
                        
                        <h3 id='info_text'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-credit-card-fill" viewBox="0 0 16 16" style={{'color': '#ce2929'}}>
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1"/>
                        </svg>Pagamentos</h3>
                        
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id='img_pay_conteiner'>
                            <h3 id='pay_text'>Credito:</h3>
                        <img src="icons8-cartão-de-crédito-mastercard-48.png"/>
                        <img src="icons8-visa-48.png"/>
                        <img src="master_card_credit.svg" id="master_card"/>
                        <img src="icons8-amex-48.png"/>
                        <img src="paypal_card.svg" id="payal_card"/>
                        <h3 id='pay_text'>Debito:</h3>
                        <img src="icons8-cartão-de-crédito-mastercard-48.png"/>
                        <img src="icons8-visa-48.png"/>
                        <img src="paypal_card.svg" id="payal_card"/>
                        <img src="icons8-amex-48.png"/>
                        <img src="master_card_credit.svg" id="master_card"/>
                        <h3 id='pay_text'>Dinheiro e Pix:</h3>
                        <img src="pix-icon.png"/>
                        <img src="money-icon(1).png"/>

                        </div>
                    </div>
                    </div>
                </div>
                </div>

    )
}
export default Modal_credit_component;