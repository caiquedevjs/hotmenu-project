/* eslint-disable no-unused-vars */
import React from 'react';
import { FaCreditCard, FaClock, FaInfoCircle } from "react-icons/fa";
import '../infos_icons_component/infos_icons_styles.css';
import Modal_credit_component from '../modal_credit_component/modal_credit';
import Modal_hours_component from '../modal_hours_component/modal_hours_component';
import Modal_infos_component from '../modal_infos_component/modal_info_component';
import { States_hover } from './states_hover'; // Importe corrigido
import { Size_device } from './size_device'; // Importe corrigido

const Infos_icons_component = () => {
    const { isCreditCardHovered, setIsCreditCardHovered, isClockHovered, setIsClockHovered, isInfoHovered, setIsInfoHovered } = States_hover();
    const { windowWidth, iconSize } = Size_device();
  
    return (
        <div className='infos_icons_component'>
            <Modal_credit_component/>
            <Modal_hours_component/>
            <Modal_infos_component/>

            <div className='infos_icons_conteiner_class'>
                <FaCreditCard 
                    style={{ width: iconSize, height: iconSize, color: isCreditCardHovered ? 'black' : '#fa6b18', marginTop: '10px', cursor: 'pointer', transition: 'color 0.5s ease' }} 
                    onMouseEnter={() => setIsCreditCardHovered(true)} 
                    onMouseLeave={() => setIsCreditCardHovered(false)} 
                    data-bs-toggle="modal" data-bs-target="#credit-modal"
                />
                <FaClock 
                    style={{ width: iconSize, height: iconSize, color: isClockHovered ? 'black' : '#fa6b18', marginTop: '10px', cursor: 'pointer', transition: 'color 0.5s ease' }} 
                    onMouseEnter={() => setIsClockHovered(true)} 
                    onMouseLeave={() => setIsClockHovered(false)} 
                    data-bs-toggle="modal" data-bs-target="#funcionamento-modal"
                />
                <FaInfoCircle
                    id='info_icon_id'
                    style={{ width: iconSize, height: iconSize, color: isInfoHovered ? 'black' : '#fa6b18', marginTop: '10px', cursor: 'pointer', transition: 'color 0.5s ease' }} 
                    onMouseEnter={() => setIsInfoHovered(true)} 
                    onMouseLeave={() => setIsInfoHovered(false)} 
                    data-bs-toggle="modal" data-bs-target="#info-modal"
                />
            </div>
        </div>
    );
};

export default Infos_icons_component;
