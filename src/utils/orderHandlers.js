// src/utils/orderHandlers.js
import { toast } from 'react-toastify';
export const handleAddPedido = (cartItems, setList) => {
    setList(cartItems);
  };
  
  export const handleFinalizarPedido = (isFormValid, list, setList, resetFields, notify, notify02) => {
    if (isFormValid) {
      if (list.length > 0) {
        notify();
        notify02();
        setList([]);
        resetFields();
      } else {
        toast.error("Não há pedidos para finalizar");
      }
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
    }
  };
  
  export const handleRemovePedido = (setList) => {
    setList([]);
    toast.success("Pedido excluído com sucesso.");
  };
  