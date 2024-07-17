import React from "react";
import { TfiAlarmClock } from "react-icons/tfi";
import { FcAlarmClock } from "react-icons/fc";

const Modal_hours_component = () => {
    // Obter o dia da semana atual (0 para Domingo, 1 para Segunda-feira, ..., 6 para Sábado)
    const currentDay = new Date().getDay();

    // Array com os dias da semana e seus respectivos horários
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
                        <h3 id='info_text'>Horários</h3>
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
