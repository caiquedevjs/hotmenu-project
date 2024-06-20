import React, { useState, useEffect } from 'react';
import { IoArrowUpCircleSharp } from "react-icons/io5";

const FixedButton = () => {
  const [visible, setVisible] = useState(true); // Define o estado inicial do botão como visível
  const [top, setTop] = useState(0); // Define o estado inicial da posição do botão como 0

  // Função para mostrar o botão
  const showButton = () => {
    setVisible(true);
  };

  // Função para esconder o botão
  const hideButton = () => {
    setVisible(false);
  };

  // Função para rolar para o topo da página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Efeito para atualizar a posição do botão no DOM
  useEffect(() => {
    if (visible) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  // Função para lidar com o evento de rolagem
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    if (scrollTop > 200) {
      showButton();
    } else {
      hideButton();
    }

    setTop(scrollTop);
  };

  return (

    <div className='flexbox'>
      <div className={`fixed-button ${visible ? 'show' : 'hide'}`} style={{ top: top }}>
      <IoArrowUpCircleSharp onClick={scrollToTop} style={{width : '40px', height : '40px', color : '#e71f1f', cursor : 'pointer', display : 'flex',justifyContent : 'right'}}/>
      
    </div>
    </div>
    
  );
};

export default FixedButton;
