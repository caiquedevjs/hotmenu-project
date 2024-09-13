import React, { createContext, useState, useEffect } from 'react';

// Criar o contexto do carrinho
export const CartContext = createContext();

// Fornecer o contexto do carrinho
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [agendamentoDePedidos, setAgendamentoDePedidos] = useState(false);

  // Função para buscar horários de funcionamento e Agendamento de Pedidos da API
  const fetchHorarioFuncionamento = async () => {
    try {
      const response = await fetch('https://hotmenu.com.br/webhook/HorarioAtendimento/hotmenu');
      if (!response.ok) {
        throw new Error('Erro ao buscar horário de funcionamento');
      }
      const data = await response.json();
      console.log('Dados recebidos da API:', data); // Log dos dados da API

      // Atualizar agendamento de pedidos
      if (data && data.FechadoLiberarPedido !== undefined) {
        setAgendamentoDePedidos(data.FechadoLiberarPedido);
      }

      // Atualizar status com base nos horários de funcionamento
      updateStatus(data.horarios);
    } catch (error) {
      console.error('Erro ao buscar horário de funcionamento', error);
      setIsOpen(false);
    }
  };

  // Atualiza o status com base nos horários de funcionamento
  const updateStatus = (horarios) => {
    console.log('Estado de AgendamentoDePedidos:', agendamentoDePedidos); // Log do estado de agendamento

    // Se o agendamento de pedidos estiver ativado, o carrinho deve estar sempre aberto
    if (agendamentoDePedidos) {
      console.log('Agendamento de Pedidos ativo, carrinho aberto.');
      setIsOpen(true);
      return;
    }

    // Se o agendamento de pedidos não estiver ativado, verificar os horários
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay() + 1; // getDay() retorna 0 para Domingo, 1 para Segunda, etc.

    const hojeHorario = horarios.find(h => h.DiaDaSemana === currentDay);
    if (hojeHorario) {
      const [horaIni] = hojeHorario.HoraIni.split(':').map(Number);
      const [horaFim] = hojeHorario.HoraFim.split(':').map(Number);

      // Ajustar o horário de fechamento que é '00:00' para o próximo dia
      const isOpenNow = horaFim === 0 ? currentHour >= horaIni : (currentHour >= horaIni && currentHour < horaFim);
      console.log('Horário de funcionamento:', horaIni, horaFim); // Log dos horários
      console.log('Hora atual:', currentHour); // Log da hora atual
      console.log('Está aberto agora?', isOpenNow); // Log do status de abertura
      setIsOpen(isOpenNow);
    } else {
      console.log('Horário de funcionamento não encontrado para hoje.');
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchHorarioFuncionamento();
  }, []);

  const addToCart = (product, additionalStates, totalPrice, quantity) => {
    const existingItem = cartItems.find(item => item.product.Id === product.Id && JSON.stringify(item.additionalStates) === JSON.stringify(additionalStates));

    if (existingItem) {
      const updatedItems = cartItems.map(item => {
        if (item.product.Id === product.Id && JSON.stringify(item.additionalStates) === JSON.stringify(additionalStates)) {
          return {
            ...item,
            quantity: item.quantity + quantity,
            totalPrice: item.totalPrice + totalPrice
          };
        }
        return item;
      });
      setCartItems(updatedItems);
    } else {
      setCartItems(prevItems => [
        ...prevItems,
        { product, additionalStates, totalPrice, quantity }
      ]);
    }
  };

  const removeFromCart = (index) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };

  const totalCartPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2).replace('.', ',');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalCartPrice, isOpen }}>
      {children}
    </CartContext.Provider>
  );
};
