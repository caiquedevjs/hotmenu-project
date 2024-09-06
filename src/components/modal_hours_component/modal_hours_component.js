import React, { useState, useEffect } from 'react';
import { FcAlarmClock } from 'react-icons/fc';
import './modal_hours.css';
import { fetchHorarioFuncionamento, fetchEstabelecimentoData } from '../service/productService'; // Ajuste o caminho conforme necessário

const Modal_hours_component = () => {
  const [hoursData, setHoursData] = useState({ status: '', horarios: [] });
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHorarioFuncionamento();
      if (data && data.horarios) {
        setHoursData(data);
      }
    };

    fetchData();
  }, []);

 

  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData();
        if (data && data.CorPadrao) {
          setEstabelecimento(data);
          setColor(data.CorPadrao);
        } else {
          setError('Nenhum dado recebido da API');
        }
      } catch (error) {
        setError('Erro ao buscar dados do estabelecimento');
        console.error('Erro na busca: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataEstabelecimento();
  }, []);


  // Obter o dia da semana atual (0 para Domingo, 1 para Segunda-feira, ..., 6 para Sábado)
  const currentDay = new Date().getDay() + 1; // Adiciona 1 para alinhar com o formato da API

  return (
    <div className="modal fade" id="funcionamento-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 id='info_text'>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-alarm-fill" viewBox="0 0 16 16" style={{ color: color }}>
                <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5m2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.04 8.04 0 0 0 .86 5.387M11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.04 8.04 0 0 0-3.527-3.527" />
              </svg>
              Horários
            </h3>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {hoursData.horarios.length > 0 ? (
              hoursData.horarios.map((horario) => (
                <div key={horario.DiaDaSemana}>
                  <p style={{ color: horario.DiaDaSemana === currentDay ? color : 'black' }}>
                    {/* Renderizar o ícone apenas para o dia atual */}
                    {horario.DiaDaSemana === currentDay && <FcAlarmClock style={{ marginRight: 5 }} />}
                    {horario.DiaDaSemanaDesc} - {horario.HoraIni} às {horario.HoraFim}
                  </p>
                  <hr />
                </div>
              ))
            ) : (
              <p>Carregando horários...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal_hours_component;
