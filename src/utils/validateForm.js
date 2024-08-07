//  <-------- função para validar formulario -------->
export const validateForm = (fields, setIsFormValid) => {
    const isValid = Object.values(fields).every((field) => field.trim() !== '');
    setIsFormValid(isValid);
  };
  