import React, { createContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Criar o contexto do carrinho
export const CartContext = createContext();

// Fornecer o contexto do carrinho
export const CartProvider = ({ children }) => {
  const { storeName } = useParams(); // Obter o nome do estabelecimento da URL
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [agendamentoDePedidos, setAgendamentoDePedidos] = useState(false);

  // Função para buscar horários de funcionamento e agendamento de pedidos da API
  const fetchHorarioFuncionamento = async (storeName) => {
    try {
      const response = await fetch(`https://hotmenu.com.br/webhook/HorarioAtendimento/${storeName}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar horário de funcionamento');
      }
      const data = await response.json();
      return data.horarios;
    } catch (error) {
      console.error('Erro ao buscar horário de funcionamento', error);
      return [];
    }
  };

  const fetchEstabelecimentoData = async (storeName) => {
    try {
      const response = await fetch(`https://hotmenu.com.br/webhook/Cliente/${storeName}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do estabelecimento');
      }
      const data = await response.json();
      return data.cliente.FechadoLiberarPedido;
    } catch (error) {
      console.error('Erro ao buscar dados do estabelecimento:', error);
      return false;
    }
  };

  // Função para verificar se o estabelecimento está aberto ou fechado
  const checkIfOpen = async () => {
    if (!storeName) return; // Verifica se o storeName foi definido

    try {
      const [horarios, fechadoLiberarPedido] = await Promise.all([
        fetchHorarioFuncionamento(storeName),
        fetchEstabelecimentoData(storeName),
      ]);

      setAgendamentoDePedidos(fechadoLiberarPedido);

      if (fechadoLiberarPedido) {
        setIsOpen(true);
      } else {
        updateStatus(horarios);
      }
    } catch (error) {
      console.error('Erro ao verificar se o estabelecimento está aberto:', error);
      setIsOpen(false);
    }
  };

  const updateStatus = (horarios) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinutes; // Convertendo para minutos
    const currentDay = now.getDay() + 1; // Dia da semana, começando de domingo (1=Domingo, 7=Sábado)
  
    const hojeHorario = horarios.find(h => h.DiaDaSemana === currentDay);
    
    if (hojeHorario) {
      const [horaIni, minIni] = hojeHorario.HoraIni.split(':').map(Number);
      const [horaFim, minFim] = hojeHorario.HoraFim.split(':').map(Number);
      
      const startTime = horaIni * 60 + minIni;
      const endTime = (horaFim === 0 && minFim === 0) ? 1440 : horaFim * 60 + minFim; // 1440 é 24h em minutos
  
      const isOpenNow = currentTime >= startTime && currentTime < endTime;
      
      console.log("Horário Atual:", currentHour + ':' + currentMinutes);
      console.log("Horário de Abertura:", hojeHorario.HoraIni);
      console.log("Horário de Fechamento:", hojeHorario.HoraFim);
      console.log("Estabelecimento está aberto?", isOpenNow);
  
      setIsOpen(isOpenNow);
    } else {
      console.log("Nenhum horário definido para hoje.");
      setIsOpen(false);
    }
  };

  useEffect(() => {
    console.log("Store Name:", storeName); // Verifique o valor de storeName
    checkIfOpen();
  }, [storeName]);
  

  const addToCart = (product, additionalStates, totalPrice, quantity, suggestion) => {
    const existingItem = cartItems.find(item => item.product.Id === product.Id && JSON.stringify(item.additionalStates) === JSON.stringify(additionalStates));

    if (existingItem) {
      const updatedItems = cartItems.map(item => {
        if (item.product.Id === product.Id && JSON.stringify(item.additionalStates) === JSON.stringify(additionalStates)) {
          return {
            ...item,
            quantity: item.quantity + quantity,
            totalPrice: item.totalPrice + totalPrice,
            suggestion: suggestion
          };
        }
        return item;
      });
      setCartItems(updatedItems);
    } else {
      setCartItems(prevItems => [
        ...prevItems,
        { product, additionalStates, totalPrice, quantity, suggestion }
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
const clearCart = () => {
  setCartItems([]);
  totalCartPrice(0)
  

};
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalCartPrice, isOpen, clearCart  }}>
      {children}
    </CartContext.Provider>
  );
};
