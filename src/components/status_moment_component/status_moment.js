import React from 'react';
import '../status_moment_component/status_moment_styles.css';

const Status_moment_component = () => {
    // Obter a hora atual
    const currentHour = new Date().getHours();

    // Definir o horário de funcionamento (por exemplo, das 9h às 18h)
    const openingHour = 19;
    const closingHour = 0;

    // Verificar se está dentro do horário de funcionamento
    const isOpen = currentHour >= openingHour && currentHour < closingHour;

    // Determinar as classes CSS dinamicamente com base no estado de isOpen
    const getStatusClasses = () => {
        if (isOpen) {
            return 'status_moment_component status_open';
        } else {
            return 'status_moment_component status_closed';
        }
    };

    return (
        <div className="status_moment_center">
            <div className={getStatusClasses()}>
                <div className='status_moment_component_container_class'>
                    <h3>{isOpen ? 'Aberto' : 'Fechado'}</h3>
                </div>
            </div>
        </div>
    );
};

export default Status_moment_component;
