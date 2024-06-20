import React from "react";
 const Modal_hours_component = ()=>{
    return(
        <div class="modal fade" id="funcionamento-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                    
                        <h3 id='info_text'>Horarios</h3>
                        
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                       <p id='hour_text'>Domingo - 19:00 às 00:00</p>
                       <hr></hr>
                       <p id='hour_text'>Segunda - 19:00 às 00:00</p>
                       <hr></hr>
                       <p id='hour_text'>Terça - 19:00 às 00:00</p>
                       <hr></hr>
                       <p id='hour_text'>Quarta - 19:00 às 00:00</p>
                       <hr></hr>
                       <p id='hour_text'>Quinta - 19:00 às 00:00</p>
                       <hr></hr>
                       <p id='hour_text'>Sexta - 19:00 às 00:00</p>
                       <hr></hr>
                       <p id='hour_text'>Sabado - 19:00 às 00:00</p>
                       <hr></hr>
                    </div>
                    </div>
                </div>
                </div>

    )
 };
  export default Modal_hours_component;