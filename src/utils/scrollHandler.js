// <------- função para scrollar a pagina para o topo ------- >
import { useState, useEffect } from 'react';

const useScrollToTopButton = () => {
  const [isIconsFixed, setIsIconsFixed] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) { // Alterar o valor conforme necessário
      setIsIconsFixed(true);
    } else {
      setIsIconsFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    isIconsFixed,
    scrollToTop
  };
};

export default useScrollToTopButton;
