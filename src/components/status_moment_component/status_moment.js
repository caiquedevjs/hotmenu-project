import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importando useParams para pegar o nome da URL
import '../status_moment_component/status_moment_styles.css';
import { fetchHorarioFuncionamento } from '../service/productService';

const StatusMomentComponent = () => {
    const { storeName } = useParams(); // Captura o nome do estabelecimento da URL
    const [horarios, setHorarios] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchAndSetHorarios = async () => {
            try {
                const data = await fetchHorarioFuncionamento(storeName); // Passando storeName para a função de fetch
                setHorarios(data.horarios); // Supondo que a resposta tenha um campo 'horarios'
                updateStatus(data.horarios);
            } catch (error) {
                console.error('Erro ao buscar e definir horários', error);
            }
        };

        fetchAndSetHorarios();
    }, [storeName]); // Adicionamos storeName como dependência para refazer a chamada sempre que a URL mudar

    // Atualiza o status com base nos horários de funcionamento
    const updateStatus = (horarios) => {
        const currentHour = new Date().getHours();
        const currentDay = new Date().getDay() + 1; // getDay() retorna 0 para Domingo, 1 para Segunda, etc.

        const hojeHorario = horarios.find(h => h.DiaDaSemana === currentDay);
        if (hojeHorario) {
            const [horaIni] = hojeHorario.HoraIni.split(':').map(Number);
            const [horaFim] = hojeHorario.HoraFim.split(':').map(Number);

            // Ajustar o horário de fechamento que é '00:00' para o próximo dia
            const isOpenNow = (horaFim === 0 ? currentHour >= horaIni : (currentHour >= horaIni && currentHour < horaFim));
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

export default StatusMomentComponent;
