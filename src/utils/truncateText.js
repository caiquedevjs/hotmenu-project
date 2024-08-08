// <-------- função para truncar o texto -------->

 const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  export default truncateText;
  