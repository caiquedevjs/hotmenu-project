import React from "react";
import { TfiAlarmClock } from "react-icons/tfi";
import { FcAlarmClock } from "react-icons/fc";
import './modal_hours.css';

const Modal_hours_component = () => {
    // <---------- Obter o dia da semana atual (0 para Domingo, 1 para Segunda-feira, ..., 6 para Sábado) ---------->
    const currentDay = new Date().getDay();

    //  <---------- Array com os dias da semana e seus respectivos horários ---------->
    const daysOfWeek = [
        { day: 'Domingo', hours: '19:00 às 00:00' },
        { day: 'Segunda', hours: '19:00 às 00:00' },
        { day: 'Terça', hours: '19:00 às 00:00' },
        { day: 'Quarta', hours: '19:00 às 00:00' },
        { day: 'Quinta', hours: '19:00 às 00:00' },
        { day: 'Sexta', hours: '19:00 às 00:00' },
        { day: 'Sábado', hours: '19:00 às 00:00' }
    ];

    return (
        <div className="modal fade" id="funcionamento-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 id='info_text'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-alarm-fill" viewBox="0 0 16 16" style={{'color': '#ce2929'}}>
                            <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5m2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.04 8.04 0 0 0 .86 5.387M11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.04 8.04 0 0 0-3.527-3.527"/>
                            </svg>
                            Horários</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {daysOfWeek.map((item, index) => (
                            <div key={index}>
                                <p style={{ color: currentDay === index ? '#ce2929' : 'black' }}>
                                    {/* <-----------Renderizar o ícone apenas para o dia atual-----------> */}
                                    {currentDay === index && <FcAlarmClock  style={{ marginRight: 5 }} />}
                                    {item.day} - {item.hours}
                                </p>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal_hours_component;
