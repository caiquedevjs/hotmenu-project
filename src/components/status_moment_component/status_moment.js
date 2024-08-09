import React, { useEffect, useState } from 'react';
import '../status_moment_component/status_moment_styles.css';

// Função para buscar horários de funcionamento da API
const fetchHorarioFuncionamento = async () => {
    try {
        const response = await fetch('https://hotmenu.com.br/webhook/HorarioAtendimento/hotmenu');
        if (!response.ok) {
            throw new Error('Erro ao buscar horário de funcionamento');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar horário de funcionamento', error);
        return { status: 'Erro ao carregar horários', horarios: [] }; // Valor padrão caso ocorra erro
    }
};

const Status_moment_component = () => {
    const [horarios, setHorarios] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchAndSetHorarios = async () => {
            const data = await fetchHorarioFuncionamento();
            setHorarios(data.horarios);
            updateStatus(data.horarios);
        };

        fetchAndSetHorarios();
    }, []);

    // Atualiza o status com base nos horários de funcionamento
    const updateStatus = (horarios) => {
        const currentHour = new Date().getHours();
        const currentDay = new Date().getDay() + 1; // getDay() retorna 0 para Domingo, 1 para Segunda, etc.

        const hojeHorario = horarios.find(h => h.DiaDaSemana === currentDay);
        if (hojeHorario) {
            const [horaIni] = hojeHorario.HoraIni.split(':').map(Number);
            const [horaFim] = hojeHorario.HoraFim.split(':').map(Number);

            const isOpenNow = currentHour >= horaIni && currentHour < horaFim;
            setIsOpen(isOpenNow);
        } else {
            setIsOpen(false);
        }
    };

    const getStatusClasses = () => {
        return isOpen ? 'status_moment_component status_open' : 'status_moment_component status_closed';
    };

    return (
        <div className="status_moment_center">
            <div className={getStatusClasses()}>
                <div className='status_moment_component_container_class'>
                    <h3 className='status-text'>{isOpen ? 'Aberto' : 'Fechado'}</h3>
                </div>
            </div>
        </div>
    );
};

export default Status_moment_component;
