import React from "react";

const Modal_credit_component = () =>{

    return(
        <div class="modal fade" id="credit-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h3 id='info_text'>Pagamentos</h3>
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
                        </div>
                    </div>
                    </div>
                </div>
                </div>

    )
}
export default Modal_credit_component;