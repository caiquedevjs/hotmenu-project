// <------- função para scrollar a pagina para o topo ------- >
export const handleScroll = (setIsIconsFixed) => {
    const scrollTop = window.scrollY;
    if (scrollTop > 0) {
      setIsIconsFixed(true);
    } else {
      setIsIconsFixed(false);
    }
  };
  