import React from 'react';
import useAdditionalState from './additionHandler';
import '../modal_products_component/PerguntasComponent.css';

const PerguntasComponent = ({ productId }) => {
  const { additionalStates, handleIncrement, handleDecrement } = useAdditionalState(productId);
  console.log('Dados das perguntas:', additionalStates);

  return (
    <div>
      {additionalStates.map(additional => (
        <div key={additional.id} className='options-description-container'>
          <div className='options-additions'>
            <p>{additional.description}</p>
          </div>

          {/* Renderiza opções de observações como botões de rádio se for do tipo 1 */}
          {additional.type === 1 && additional.observacao.length > 0 && (
            <div className='observacoes'>
              {additional.observacao.map(obs => (
                <label key={obs.Id}>
                  <input 
                    type="radio" 
                    name={`observacao_${additional.id}`} // Agrupa os botões de rádio
                    onChange={() => {
                      handleIncrement(obs.Id); // Adiciona a observação selecionada
                    }} 
                  />
                  {obs.Nome}
                </label>
              ))}
            </div>
          )}

          {/* Renderiza opções de complemento */}
          {additional.options.length > 0 && (
            <div className='options-container'>
              {additional.options.map(option => (
                <div className='options-icon'>
                    <div className='option-text'> <p>{option.name} - R$ {option.price.toFixed(2).replace('.', ',')}</p></div>
                
                <div className='options-icons-plus-dash'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleIncrement(option.id)}
                    disabled={option.count === option.QtdMaximaPermitida}
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                  </svg>
                  <span>{option.count}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-dash-circle-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleDecrement(option.id)}
                    disabled={option.count === 0}
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                  </svg>
                </div>
              </div>
              
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PerguntasComponent;
