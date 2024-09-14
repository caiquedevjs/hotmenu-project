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
      console.log('Dados recebidos da API de horários:', data); // Log dos dados da API
      return data.horarios; // Retorna os horários para serem usados depois
    } catch (error) {
      console.error('Erro ao buscar horário de funcionamento', error);
      return []; // Retorna um array vazio em caso de erro
    }
  };

  const fetchEstabelecimentoData = async () => {
    try {
      const response = await fetch('https://hotmenu.com.br/webhook/Cliente/hotmenu');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do estabelecimento');
      }
      const data = await response.json();
      console.log('Dados do estabelecimento:', data.cliente); // Log dos dados do estabelecimento
      return data.cliente.FechadoLiberarPedido; // Retorna FechadoLiberarPedido
    } catch (error) {
      console.error('Erro ao buscar dados do estabelecimento:', error);
      return false; // Retorna false em caso de erro
    }
  };

  // Função para verificar se o estabelecimento está aberto ou fechado
  const checkIfOpen = async () => {
    try {
      // Buscando ambos os dados simultaneamente
      const [horarios, fechadoLiberarPedido] = await Promise.all([
        fetchHorarioFuncionamento(),
        fetchEstabelecimentoData()
      ]);

      // Atualizar o estado de agendamento de pedidos
      setAgendamentoDePedidos(fechadoLiberarPedido);

      // Verificação com base no valor de FechadoLiberarPedido
      if (fechadoLiberarPedido) {
        console.log('Agendamento de Pedidos ativo, carrinho aberto.');
        setIsOpen(true);
      } else {
        // Se não tiver agendamento, verificar com base nos horários de funcionamento
        updateStatus(horarios);
      }
    } catch (error) {
      console.error('Erro ao verificar se o estabelecimento está aberto:', error);
      setIsOpen(false);
    }
  };

  // Atualiza o status com base nos horários de funcionamento
  const updateStatus = (horarios) => {
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
    // Chama a função que busca os dados e verifica o status de abertura
    checkIfOpen();
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
