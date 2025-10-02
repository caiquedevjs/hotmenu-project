// Arquivo: TextoTruncadoComModal.js

import React, { useState } from 'react';
import './TextoTruncadoComModal.css'; // Manteremos este arquivo para o estilo do botão "Ver mais"

const TextoTruncadoComModal = ({ texto, maxCaracteres = 120, color }) => {
  const [modalAberto, setModalAberto] = useState(false);

  // Se o texto não precisar de modal, renderiza normalmente
  if (!texto || texto.length <= maxCaracteres) {
    return <h6 className='estabelecimento-description'>{texto || ''}</h6>;
  }

  // Lógica para cortar o texto
  const textoTruncado = `${texto.substring(0, maxCaracteres)}... `;

  return (
    <>
      {/* O texto truncado com o botão para abrir o modal */}
      <h6 className='estabelecimento-description'>
        {textoTruncado}
        <button onClick={() => setModalAberto(true)} className="ver-mais-btn">
          Ver mais
        </button>
      </h6>

      {/* RENDERIZAÇÃO CONDICIONAL DO MODAL COM ESTILO BOOTSTRAP */}
      {modalAberto && (
        <>
          {/* Backdrop (fundo escuro) */}
          <div className="modal-backdrop fade show"></div>

          {/* A estrutura do modal foi copiada do seu Modal_infos_component */}
          <div 
            className="modal fade show" 
            style={{ display: 'block' }} 
            tabIndex="-1" 
            onClick={() => setModalAberto(false)} // Fecha ao clicar fora
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}> {/* Impede de fechar ao clicar dentro */}
              <div className="modal-content">
                <div className="modal-header">
                  <h3 id='info_text'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ color: color || '#0d6efd' }}>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                    </svg>
                    Descrição Completa
                  </h3>
                  <button type="button" className="btn-close" onClick={() => setModalAberto(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{texto}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TextoTruncadoComModal;