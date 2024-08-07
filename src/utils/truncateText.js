// <-------- função para truncar o texto -------->

export const truncateText = (text, maxLength = 40) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };
  