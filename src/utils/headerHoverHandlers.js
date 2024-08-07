// <-------- função para efeito hover dos icons -------->
export const setHoverHandlers = (setIsCartHovered, setISearchHovered, setIsCupomHovered) => {
    return {
      handleCartHover: (state) => setIsCartHovered(state),
      handleSearchHover: (state) => setISearchHovered(state),
      handleCupomHover: (state) => setIsCupomHovered(state),
    };
  };
  