/* eslint-disable jsx-a11y/anchor-is-valid */

// <------- import hooks and context------->
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../modal_cart_itens/CartContext';



// <------- import css------->
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../header_component/header_styles.css';
import './modal_cart_itens.css';
import './modal_cupom_desconto.css';
import './modal_finalizar_pedido.css';
import 'react-toastify/dist/ReactToastify.css';

// <------- import react icons, assets, toaltip and toast ------->
import { FaSearch,FaShoppingCart } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";
import { Tooltip } from 'react-tooltip';
import { Offcanvas} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import SoundMessage from '../../assets/sounds/message.wav';
import InputMask from 'react-input-mask';
import { Nav, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

// <------- import utils------->
import { fetchFormaPagamentos,fetchEstabelecimentoData } from '../service/productService';
import  useHover  from '../../utils/headerHoverHandlers';
import useScrollToTopButton from '../../utils/scrollHandler';
import truncateText from '../../utils/truncateText';






const Header_component = () =>{

 // <------ constantes utils ------->
  const cartHover = useHover();
  const searchHover = useHover();
  const comprarButtonHover = useHover();
  const cupomButtonHover = useHover();
  const finalizarButtonHover = useHover();
  const cancelarButtonHover = useHover();
  const { isIconsFixed} = useScrollToTopButton();
  const truncate_Text = (text) => truncateText(text, 40)

// <------- contexto do carrinho ------->
const { cartItems, totalCartPrice, removeFromCart, isOpen, toggleOffcanvas} = useContext(CartContext);
const { storeName } = useParams();

// <------ estados ------->
const [formasPorTipo, setFormasPorTipo] = useState({});
const [formasSemTipo, setFormasSemTipo] = useState({});
const [estabelecimento, setEstabelecimento] = useState(null);
const [deliveryOptions, setDeliveryOptions] = useState({ pickup: false, home: false, mesa: false})
const [pagamentoOptions, setPagamentoOptions] = useState({pagamentoOnline : false, pagamentoNaRetirada : null})
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [color, setColor] = useState('');
const [logoMarca, setLogoMarca] = useState('');
const [fotoCard, setFotoCard] = useState('');
const [fotoCard2,setFotoCard2] = useState('');
const [fotoCard3, setFotoCard3] = useState('');
const [fotoCard4, setFotoCard4] = useState('');
const [fotoCard5, setFotoCard5] = useState('');
const [pixKey, setPixKey] = useState(``);
const [FreteFixo,setFreteFixo] = useState('');
const [Fretefuncao, setFreteFuncao] = useState('');
const [descontoAplicado, setDescontoAplicado] = useState(0);
const [valorTroco, setValorTroco] = useState(0);
const [cupom, setCupom] = useState('');
const [celular, setCelular] = useState('');
const [estebelecimentoId, setEstabelecimentoId] = useState('');
const [mensagem, setMensagem] = useState('');
const [fontSize, setFontSize] = useState('16px'); // Tamanho de fonte padrão
const [activeTab, setActiveTab] = useState('pickup');
const [activeTabCard, setActiveTabCard] = useState('pagamentoOnline ');







// <------ estados do formulario, valor total do pedido------->  
const [valorTotalPedido, setValorTotalPedido] = useState();
const [valorVendaMinima, setValorVendaMinima] = useState(0);
const [list, setList] = useState([]);
const [nome, setNome] = useState('');
const [telefone, setTelefone] = useState('');
const [endereco, setEndereco] = useState('');
const [complemento, setComplemento] = useState('');
const [bairro, setBairro] = useState('');
const [cep, setCep] = useState('');
const [cartao, setCartao] = useState('');
const [titular, setTitular] = useState('');
const [vencimento, setVencimento] = useState('');
const [cvc, setCvc] = useState('');
const [mesa, setMesa] = useState('');
const [selectedOption, setSelectedOption] = useState('');
const [isFormValid, setIsFormValid] = useState(false);
const [isValid, setIsValid] = useState(true);
const [errorCard, setErrorCard] = useState('');
const [checkedOptions, setCheckedOptions] = useState({});
const [showCupomModal, setShowCupomModal] = useState(false);
const [showFinalizarModal, setShowFinalizarModal] = useState(false);


// <---------- Notificações ---------->
const sound = new Audio(SoundMessage)
const notify = () => toast.success(`Olá ${nome} 👋, seu pedido foi feito com sucesso! 🍔🍟 `,{theme: 'dark'});
const notify02 = () => toast.success('Você receberá o status do pedido pelo WhatsApp. ⏱️ ', {theme: 'dark'});



// <-------- algoritmo de luhn para validação de número do cartão de credito ------->

const isValidCardNumber = (number) => {
  const sanitizedNumber = number.replace(/\s+/g, '');
  
  if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
    return false; // Números de cartão devem ter entre 13 e 19 dígitos
  }

  if (!/^\d+$/.test(sanitizedNumber)) {
    return false; // Deve conter apenas dígitos
  }

  let sum = 0;
  let shouldDouble = false;

  // Lógica do Algoritmo de Luhn
  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (sum % 10 === 0);
};

const handleCardChange = (e) => {
  const value = e.target.value;
  setCartao(value);

  // Valida o número do cartão e atualiza o estado de erro em tempo real
  if (isValidCardNumber(value)) {
    setErrorCard(''); // Limpa o erro se o número for válido
  } else {
    setErrorCard('Número do cartão inválido.'); // Define o erro se o número for inválido
  }
};

const handleCheckboxChange = (nome) => {
  setCheckedOptions((prev) => {
      const newOptions = {
          ...prev,
          [nome]: !prev[nome], // Alterna o valor do checkbox
      };

      // Retorna a bandeira do cartão selecionada
      const selectedBandeira = Object.keys(newOptions).find(key => newOptions[key]);
      return { ...newOptions, bandeiraCartão: selectedBandeira || null }; // Define a bandeira do cartão
  });
};

 
// <------ função para redimensionar o texto fretis gratis em relação a tela ------>
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 360) {
        setFontSize('9px');
      } else if (window.innerWidth <= 768) {
        setFontSize('11px');
      } else {
        setFontSize('13px');
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


 // <------ função pra gerenciar a escolha da tab de formas de pagamento ------->
  const handleTabSelect = (key) => setActiveTab(key);
  const handleTabCardSelect = (key) => {
    setActiveTabCard(key);
    if (key === 'pagamentoOnline') {
        setSelectedOption('credito'); // Define como 'credito' ao selecionar a aba de pagamento online
    }
  };

//---------------------------------------------------------------------------------------------------------------------------------------------------------


  // <------ renderização das formas de pagamentos ------->
 
  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetchFormaPagamentos(storeName);
              if (response && response.FormasDePagamento) {
                  const formasByTipo = {};
                  const formasSemTipo = {};
                  response.FormasDePagamento.forEach((curr) => {
                      if (curr.Tipo) {
                          if (!formasByTipo[curr.Tipo]) {
                              formasByTipo[curr.Tipo] = [];
                          }
                          formasByTipo[curr.Tipo].push(curr);
                      } else {
                          if (!formasSemTipo[curr.Nome]) {
                              formasSemTipo[curr.Nome] = [];
                          }
                          formasSemTipo[curr.Nome].push(curr);
                      }
                  });
                  setFormasPorTipo(formasByTipo);
                  setFormasSemTipo(formasSemTipo);
              }
          } catch (error) {
              console.error('Erro ao buscar formas de pagamento:', error);
          }
      };

      fetchData();
  }, [storeName]);
  const renderFormas = (tipo) => {
    if (!formasPorTipo[tipo]) return null;

    return (
      <div><p>Escolha uma bandeira de cartão.</p>
        <div className="payment-grid">
            {formasPorTipo[tipo].map((forma) => (
                <div key={forma.Id} className="payment-item" onClick={() => handleCheckboxChange(forma.Nome)}>
                  
                    <div className="image-container">
                        <img
                            src={`https://hotmenu.com.br/assets/images/FormaPagamento/${forma.Imagem}`}
                            alt={forma.Nome}
                        />
                        <input
                            type="checkbox"
                            checked={checkedOptions[forma.Nome] || false}
                            onChange={() => handleCheckboxChange(forma.Nome)}
                            className="invisible-checkbox"
                        />
                        <span className={`checkmark ${checkedOptions[forma.Nome] ? 'checked' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="check-icon">
                                <path d="M9 19l-7-7 1.41-1.41L9 16.17l11.59-11.59L22 6l-13 13z"/>
                            </svg>
                        </span>
                    </div>
                    
                </div>
            ))}
        </div>
        </div>
    );
};




const renderFormasSemTipo = (nome) => {
    const formas = formasSemTipo[nome];
    if (!formas || !Array.isArray(formas)) return null;
    return (
        <div className="payment-grid">
            {formas.map((forma) => (
                <div key={forma.Id} className="payment-item">
                    <img src={`https://hotmenu.com.br/assets/images/FormaPagamento/${forma.Imagem}`} alt={forma.Nome} />
                    
                </div>
            ))}
        </div>
    );
};

useEffect(() => {
  const fetchDataEstabelecimento = async () => {
    try {
      const response = await fetchEstabelecimentoData(storeName);
      console.log('Resposta da API:', response); // Verifique se os dados estão completos
      if (response) {
        // Confirme se os campos realmente existem
        console.log('Logomarca:', response.Logomarca);
        console.log('Nome:', response.Nome);
        setEstabelecimento(response);
        setColor(response.CorPadrao);
        setLogoMarca(response.Logomarca);
        setFotoCard(response.FotoCard1);
        setFotoCard2(response.FotoCard2);
        setFotoCard3(response.FotoCard3);
        setFotoCard4(response.FotoCard4);
        setFotoCard5(response.FotoCard5);
        setEstabelecimentoId(response.Id);
        setCelular(response.TelContato);
        setFreteFixo(response.ValorFreteFixo);
        setFreteFuncao(response.FreteFixo); 
        setPagamentoOptions({
          pagamentoOnline: response.PgtoOnLine,
          pagamentoNaRetirada : response.PgtoRetiradaLocal
        });
        setDeliveryOptions({
          pickup: response.RetiradaNaLoja,
          home: response.Delivery,
          mesa : response.Mesa
        });
        setPixKey(response.ChavePix);
        setValorVendaMinima(response.LimiteVendaMinima);
      } else {
        setError('Nenhum dado recebido da API');
      }
    } catch (error) {
      setError('Erro ao buscar dados do estabelecimento');
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  if (storeName) {
    fetchDataEstabelecimento();
  }
}, [storeName]);


  // <---------- Função para formatar o preço ---------->
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };
   // <---------- Função para formatar o texto de adcionais  ---------->
  const formatarTexto = (texto) => {
    return texto.toLowerCase(); // Converte o texto para minúsculas
  };
  const handleCloseModal = () => {
    setShowFinalizarModal(false);
    
    // Verifica se ainda há outros modais abertos antes de remover a classe 'modal-open'
    const openModals = document.querySelectorAll('.modal.show');
    if (openModals.length === 0) {
      document.body.classList.remove('modal-open'); // Remove a classe que impede o scroll
    }
  
    // Remove o backdrop apenas se não houver outros modais abertos
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && openModals.length === 0) {
      backdrop.remove(); // Remove o backdrop manualmente
    }
  };

// <---------- Função para calcular o preço com frete  ---------->
const totalPriceWithFrete = () => {
  const cartTotal = parseFloat(totalCartPrice().replace(',', '.'));
  let totalComDesconto = cartTotal;

  // Aplicar desconto, se houver
  if (descontoAplicado > 0) {
    const descontoValor = totalComDesconto * (descontoAplicado / 100);
    totalComDesconto -= descontoValor;
  }

  // Calcular o frete
  if (estabelecimento) {
    if (estabelecimento.PromocaoFreteGratis && cartTotal >= estabelecimento.ValorFreteGratisAcimaDe) {
      return totalComDesconto.toFixed(2).replace('.', ','); 
    } else if (estabelecimento.FreteFixo) {
      const totalComFrete = totalComDesconto + estabelecimento.ValorFreteFixo;
      return totalComFrete.toFixed(2).replace('.', ','); 
    }
  }
  return totalComDesconto.toFixed(2).replace('.', ','); 
};

const calcularTroco = () => {
  const total = parseFloat(totalPriceWithFrete().replace(',', '.'));
  const troco = valorTroco ? parseFloat(valorTroco.replace(',', '.')) - total : 0;
  return troco.toFixed(2).replace('.', ',');
};




// <------ função para adicionar os itens do carrinho a lista de pedido ------->
const handleAddPedido =() =>{
  if(totalCartPrice() < valorVendaMinima){
    toast.error(`Valor minimo para compra: ${valorVendaMinima}`);
   }
   else{
    setList(cartItems);
    setValorTotalPedido(totalPriceWithFrete())
    sound.play()
   }
}



//<------ função para finalizar a lista de pedido ------->
const handleFinalizarPedido = () => {
  if (list.length > 0) {

     // Validação dos campos obrigatórios
     if (!nome || !telefone) {
      toast.error("Nome e telefone são dados obrigatórios", { theme: 'dark' });
      return;
  }


      // Verifica se as abas de retirada e pagamento estão selecionadas
      if (!['pickup', 'home', 'mesa'].includes(activeTab)) {
          toast.error("Escolha uma forma de retirada.", { theme: 'dark' });
          sound.play(); // Toca um som de erro
          return;
      }
      
      if (!['pagamentoOnline', 'pagamentoNaRetirada'].includes(activeTabCard)) {
          toast.error("Escolha uma forma de pagamento.", { theme: 'dark' });
          sound.play(); // Toca um som de erro
          return;
      }

     

      // Validação para forma de retirada
      if (activeTab === 'home' && (!endereco || !bairro || !cep)) {
          alert("Por favor, preencha todos os campos de entrega.");
          return;
      }

      // Validação para pagamento online
      if (activeTabCard === 'pagamentoOnline') {
          if (!cartao || !titular || !vencimento || !cvc) {
              toast.error("Por favor, preencha todos os dados do cartão", { theme: 'dark' });
              return;
          }
      }

      // Validação para pagamento na retirada
      if (activeTabCard === 'pagamentoNaRetirada') {
          if (!selectedOption) {
              toast.error("Escolha uma opção de pagamento", { theme: 'dark' });
              return;
          } 
           else if (selectedOption === 'Dinheiro') {
              if (!valorTroco) {
                  toast.error("Por favor, preencha um valor para troco", { theme: 'dark' });
                  return;
              }
          }
      }

      // Captura a forma de retirada
      const formaRetirada = activeTab;

      // Mapeia os produtos para o formato desejado
      const produtos = list.map(item => ({
          Id: item.product.Id,
          Nome: item.product.Nome,
          Quantidade: item.quantity,
          Sugestão: item.suggestion,
          Adicionais: item.additionalStates.map(additional => ({
            Observações: additional.observacao.filter(obs => obs.selected).map(obs => obs.Nome),
            Opções: additional.options.filter(option => option.count > 0).map(option => ({
              Id: option.id,
              Nome: option.name,
              Quantidade: option.count
            })),
            Produtos: additional.produtos.filter(produto => produto.count > 0).map(produto => ({
              Id: produto.Id,
              Nome: produto.Nome,
              Quantidade: produto.count
            })),
            
          })),
          Preço: item.product.PrecoDeVenda, 
      }));

      const pedido = {
          DataPedido: new Date().toISOString(),
          Status: "Novo",
          Cliente: nome,
          Tel: telefone,
          Numero_cartao: cartao,
          Cvc: cvc,
          Endereço: (cep === '' && endereco === '' && complemento === '' && bairro === '') ?
              "RETIRADA NO LOCAL" :
              `Cep: ${cep}, ${endereco}, ${complemento}, ${bairro}`,
          mesa: (mesa === '') ? "Não possui mesa" : `Mesa número: ${mesa}`,
          FormaPagamento: selectedOption,
          bandeiraCartão: checkedOptions.bandeiraCartão || "Sem cartão",
          FormaRetirada: formaRetirada,
          Produtos: produtos,
          frete: estabelecimento.PromocaoFreteGratis && estabelecimento.ValorFreteGratisAcimaDe ?
          "Frete grátis" :`R$ ${FreteFixo}`,
          troco: valorTroco ? `R$ ${calcularTroco()}` : `R$ 00,00`,
          preçoTotal: `R$ ${totalPriceWithFrete()}`
      };
     
      // Transformar o objeto em JSON
const pedidoJson = JSON.stringify(pedido);

// Exemplo de como fazer a requisição POST usando fetch
fetch('URL_DA_API', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: pedidoJson
})
.then(response => response.json())
.then(data => {
    console.log('Sucesso:', data);
})
.catch((error) => {
    console.error('Erro:', error);
});


      // Se tudo estiver válido, prosseguir com a finalização do pedido
      console.log('Pedido finalizado com sucesso!');
      notify();
      notify02();

      // Log do objeto pedido para verificação
      console.log(pedido);

      // Número do estabelecimento que gera a mensagem
      const celularWhatsApp = celular.replace(/\D/g, '');

      // Mensagem para o destinatário
      // Mensagem para o destinatário
      const mensagemProdutos = pedido.Produtos.map(produto => 
        `
       
        *Nome:* ${produto.Nome}  
        *Quantidade:* ${produto.Quantidade}  
        *Sugestão:* ${produto.Sugestão}  
        *Adicionais:*  
        ${produto.Adicionais.map(addicional => 
          `${addicional.Observações.length > 0 ? `Observações: ${addicional.Observações.join(', ')}\n` : ''}
           ${addicional.Opções.length > 0 ? `Opções: ${addicional.Opções.map(opcao => `${opcao.Nome} (${opcao.Quantidade})`).join(', ')}\n` : ''}
           ${addicional.Produtos.length > 0 ? `Produtos: ${addicional.Produtos.map(produto => `${produto.Nome} (${produto.Quantidade})`).join(', ')}` : ''}`
        ).join('\n')}`
      ).join('\n\n');
      
      const mensagem = `*Olá 👋, acabei de fazer um pedido 🧾*  
      * Status:* ${pedido.Status}
      ---------------------------
      *Os itens escolhidos são:*  
      ${mensagemProdutos}  
      ---------------------------
      *Frete:*  ${pedido.frete}  
      *Preço Total:*  ${pedido.preçoTotal}  
      *Troco:* ${pedido.troco}
      ---------------------------
      *Forma de Entrega:* ${pedido.FormaRetirada}  
      *Forma de pagamento:* ${pedido.FormaPagamento}  
      *Cartão:* ${pedido.bandeiraCartão}  
      *Endereço:* ${pedido.Endereço}  
      *Mesa:* ${pedido.mesa}  
      ---------------------------
      *Nome:* ${pedido.Cliente}  
      *Telefone:* ${pedido.Tel}`;
      
      const mensagemCodificada = encodeURIComponent(mensagem);
      

      // Cria a URL do WhatsApp
      const urlWhatsApp = `https://wa.me/${celularWhatsApp}?text=${mensagemCodificada}`;

      // Abre o link do WhatsApp em uma nova aba
      window.open(urlWhatsApp, '_blank');

      // Limpeza dos campos após o envio
      setList([]);
      setNome('');
      setTelefone('');
      setBairro('');
      setEndereco('');
      setComplemento('');
      setCep('');
      setCartao('');
      setTitular('');
      setVencimento('');
      setCvc('');
      setMesa('');
      setSelectedOption('');

  } else {
      toast.error("Não há pedidos para finalizar", { theme: 'dark' });
      sound.play();
  }
};

// <------ função para remover o pedido da lista de pedido ------->
  const hendlerRemovePedido = () => {
    if(list.length === 0){
      toast.error("Não pedido para cancelar!", {theme: 'dark'})
      sound.play()
    }
    else{
    setList([])
    setValorTotalPedido()
    toast.success("Pedido excluido com sucesso. 😞",  {theme: 'dark'})
    sound.play()}
  };


//<------ função para capitar o valor da escolha da forma de pagamento------->
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  
  //<------ função para requisitar o dado no modal de cupom na api de cupom------->

  const handleBuscarCupom = async () => {
    if (!estabelecimento) {
        console.error('Dados do estabelecimento não carregados');
        return;
    }

    const totalSemFrete = parseFloat(totalCartPrice().replace(',', '.'));
    
    if (totalSemFrete < 20) {
        setMensagem('O valor mínimo para aplicar o cupom é R$ 20,00.');
        return;
    }

    try {
      const response = await fetch('https://hotmenu.com.br/webhook/BuscarCupom', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              Id: estebelecimentoId,
              Cupom: cupom,
              Celular: celular,
          })
      });
  
      // Verifique o tipo da resposta (content-type)
      const contentType = response.headers.get('content-type');
      console.log('Tipo de conteúdo:', contentType);
      if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Resposta JSON:', data);
  
          const { Valido, MsgErro, Regras } = data;
  
          if (Valido) {
              setMensagem('Cupom válido!');
              const desconto = parseFloat(Regras.match(/Desconto de: (\d+,\d+)/)[1].replace(',', '.'));
              setDescontoAplicado(desconto);
          } else {
              setMensagem(MsgErro || 'Cupom inválido ou não encontrado para este estabelecimento.');
          }
      } else {
          // Se não for JSON, logue o conteúdo como texto para entender o que está sendo retornado
          const text = await response.text();
          console.error('Resposta inesperada:', text);
          setMensagem('Erro ao buscar o cupom');
      }
  } catch (error) {
      console.error('Erro ao buscar o cupom:', error);
      setMensagem('Erro ao buscar o cupom');
  }
  
  
};

const [show, setShow] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);






    return (
  
 <div className='Header-component'>
  <header className='header_class'>
   {/* <-------estrutura dos icons do carrossel de banners-------> */}
  <div id="carouselExampleFade" class="carousel slide carousel-fade" >
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src={`https://hotmenu.com.br/arquivos/${fotoCard}`} class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={`https://hotmenu.com.br/arquivos/${fotoCard2}`} class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={`https://hotmenu.com.br/arquivos/${fotoCard3}`} class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={`https://hotmenu.com.br/arquivos/${fotoCard4}`} class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={`https://hotmenu.com.br/arquivos/${fotoCard5}`} class="d-block w-100" alt="..."/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
 {/* <-------estrutura dos icons do header-------> */}
 <div className={isIconsFixed ? 'icons_header_conteiner_class fixed' : 'icons_header_conteiner_class'}>
  <FaSearch onMouseEnter={cartHover.handleMouseEnter}
        onMouseLeave={cartHover.handleMouseLeave}
        style={{ color: cartHover.isHovered ? '#332D2D' : color, marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease',  marginLeft: '10px',  }} data-bs-toggle="modal" data-bs-target="#modal_search_id"/>
        {cartItems.length === 0 ?  (
          <div className='amount_order_conteiner'>
          <FaShoppingCart onMouseEnter={searchHover.handleMouseEnter}
             onMouseLeave={searchHover.handleMouseLeave}
             onClick={()=>{
              if(isOpen){
                handleShow()
              }
             }}
             style={{color: isOpen ? (searchHover.isHovered ? '#332D2D' : color) : 'gray', marginTop: '10px', cursor : 'pointer',  transition: 'color 0.5s ease', }}  />
              </div>   
        ) :(
          <div className='amount_order_conteiner'>
     <label id='amount_order'>1</label> 
     <FaShoppingCart
            onMouseEnter={searchHover.handleMouseEnter}
            onMouseLeave={searchHover.handleMouseLeave}
            onClick={()=>{
              if(isOpen){
                handleShow()
              }
             }}
            style={{
              color: isOpen ? (searchHover.isHovered ? '#332D2D' : color) : 'gray', // Cor alterada quando fechado
              marginTop: '10px',
              cursor: isOpen ? 'pointer' : 'not-allowed', // Cursor alterado quando fechado
              transition: 'color 0.5s ease',
              width: '35px'
            }}
            
          />
         </div>   
        )}
  </div>
  <div className='logo_conteiner_class'>
  {logoMarca ? (
  <img src={`https://hotmenu.com.br/arquivos/${logoMarca}`} className="img-fluid" alt="Logo" />
) : (
  <p>Logo não disponível</p>
)}

  </div>
  <h1 id='title_logo'>{estabelecimento ? estabelecimento.Nome : 'Carregando...'}</h1>
  <h6 className='estabelecimento-description'>{estabelecimento ? estabelecimento.Descricao : "Pizza de qualidade"}</h6> 
     
  </header>



  
  

{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}



<Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-bag-fill" viewBox="0 0 16 16" style={{ color }}>
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
            </svg>
            

        
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div class="overflow-y-auto">
            <div className="modal-body" id='modal-body-cartItens'>
              {cartItems.length === 0 ? (
                <p id='span-carrinho-vazio'>Seu carrinho está vazio. 😞</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className='product-img-cart-item'>
                      <img src={`https://hotmenu.com.br/arquivos/${item.product.Foto}`} alt={item.product.Nome} className="cart-item-img" />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16" id='remove-item-cart' onClick={() => removeFromCart(index)}>
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                      
                    </div>
                    <div className="cart-item-details">
                      <p className='text-cart-name'>{item.quantity}x {item.product.Nome}</p>
                      <p className='text-cart-description'>
                      {item.additionalStates.map((additional, additionalIndex) => (
                        <p key={additionalIndex} className='text-cart-description'>
                          {additional.observacao.map(obs => (
                            obs.selected ? (
                              <span key={obs.Id}>{formatarTexto(obs.Nome)}, </span>
                            ) : null
                          ))}
                          {additional.options.map(option => (
                            option.count > 0 ? (
                              <span key={option.id}>{option.count}x {truncateText(formatarTexto(option.name))}, </span>
                            ) : null
                          ))}
                          {additional.produtos.map(produto => (
                            produto.count > 0 ? (
                              <span key={produto.Id}>{produto.count}x {truncateText(formatarTexto(produto.Nome))}, </span>
                            ) : null
                          ))}
                        </p>
                      ))}
                      </p>
                      <p className='text-cart-price'><strong>Preço:</strong> R$ {formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))
              )}

<Tooltip id='tooltip-cupom-btn'/>
              <div id='mdfCart'>
                <div className='modal-footer-conteiner'>
                  <div className='prices-labels'>
                    <p className='Total-price-cart'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag-fill" viewBox="0 0 16 16">
                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                  </svg>
                      Subtotal:</p>
                    <p className='Total-price-cart'>
                    <img width="16" height="16" src="https://img.icons8.com/ios-filled/50/delivery--v1.png" alt="delivery--v1"/>
                      Taxa de entrega
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-question-circle-fill tax-info-icon" viewBox="0 0 16 16"
                        data-tooltip-id="tooltip-taxa-entrega-info"
                        data-tooltip-content="Sujeito alteração do estabelecimento."
                        data-tooltip-place="right"
                        data-tooltip-offset="5">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.419-.932-1.045-.932-.592 0-1.037.375-1.037.927 0 .545.44.927 1.048.927" />
                      </svg>
                      <Tooltip id="tooltip-taxa-entrega-info" />
                    </p>
                    <strong><p className='Total-price-cart'>
                    <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/average-2.png" alt="average-2"/>
                      Total:</p></strong>
                  </div>
                  <div className='prices-conteiner'>
                    <p className='Total-price-cart'>R$ {totalCartPrice()}</p>
                    {estabelecimento && estabelecimento.PromocaoFreteGratis && parseFloat(totalCartPrice().replace(',', '.')) >= estabelecimento.ValorFreteGratisAcimaDe ? (
                       <p  className='freeGratis_class' style={{ color: 'red' ,'fontSize': fontSize}}>
                          Frete grátis 
                        </p> ) :(
                      <p className='Total-price-cart' style={{'color' : '#228B22'}}>
                      {estabelecimento && estabelecimento.FreteFixo ? `R$ ${estabelecimento.ValorFreteFixo.toFixed(2).replace('.', ',')}` : 'consultar'}
                      </p>
                    )}
                     {descontoAplicado > 0 && (
                                <p className='Total-price-cart'>
                                    Desconto de: {descontoAplicado}% 
                                </p>
                            )}
                    <strong><p className='Total-price-cart'>R$ {totalPriceWithFrete()}</p></strong>
                  </div>
                </div>
                <hr></hr>
                <div className='btn-card'>
                <button
                  className="btn-compra"
                  disabled={cartItems.length === 0 || parseFloat(totalCartPrice().replace(',', '.')) < valorVendaMinima} // Verifica se o carrinho está vazio ou o valor é menor que o mínimo
                  data-bs-toggle={cartItems.length > 0 && parseFloat(totalCartPrice().replace(',', '.')) >= valorVendaMinima ? 'modal' : undefined} // Verifica se o total atende ao valor mínimo
                  data-bs-target={cartItems.length > 0 && parseFloat(totalCartPrice().replace(',', '.')) >= valorVendaMinima ? '#modal-finalizar-compra' : undefined} // Modal aberto somente se o total for maior que o mínimo
                  onClick={()=>{
                    handleAddPedido()
                    handleClose()
                  }}
                  data-tooltip-id="carrinho-vazio-id"
                  data-tooltip-content={
                    cartItems.length === 0 
                      ? "Adicione um produto para finalizar a compra." 
                      : parseFloat(totalCartPrice().replace(',', '.')) < valorVendaMinima 
                      ? `O valor mínimo para compra é: R$ ${valorVendaMinima.toFixed(2).replace('.', ',')}` 
                      : ""
                  } 
                  data-tooltip-place="top-start"
                  style={{
                    backgroundColor: comprarButtonHover.isHovered ? '#332D2D' : color, 
                    cursor: cartItems.length > 0 && parseFloat(totalCartPrice().replace(',', '.')) >= valorVendaMinima ? 'pointer' : 'not-allowed'
                  }}
                  onMouseEnter={comprarButtonHover.handleMouseEnter}
                  onMouseLeave={comprarButtonHover.handleMouseLeave}
                  
                  
                >
                  Finalizar Compra
                </button>
                <Tooltip id='carrinho-vazio-id'></Tooltip>
                 <button  data-bs-toggle="modal" data-bs-target="#modal_cupom_desconto"  className='btn-cupom'
              data-tooltip-id="tooltip-cupom-btn"
             data-tooltip-content="adicione o seu cupom aqui."
             data-tooltip-place="top-start"
             style={{backgroundColor : cupomButtonHover.isHovered ? '#332D2D' : color}}
             onMouseEnter={cupomButtonHover.handleMouseEnter}
             onMouseLeave={cupomButtonHover.handleMouseLeave}
             onClick={handleClose}
             >Adicionar cupom
              </button>
                </div>
               </div>
            </div>
            </div>
        </Offcanvas.Body>
        </Offcanvas>

{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}



              {/* <------------ Modal carrinho de cupom de desconto ------------>*/}
      <div className="modal fade" id="modal_cupom_desconto"  data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modal-header-title">
            <RiDiscountPercentFill  id='cupom-icon-modal-title' style={{color : color}}/>
           Cupom
        </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id='modal-body-cupom-desconto'>
          <Tooltip id='tooltip-bsucar-cupom'></Tooltip>
            <input className='cupom-desconto-input' placeholder='digite seu cupom'
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
             data-tooltip-id="tooltip-bsucar-cupom"
             data-tooltip-content="busque um cupom para ultilizar"
             data-tooltip-place="top-start"
             ></input> 
            <button className='btn-buscar-cupom' style={{backgroundColor: color}} onClick={handleBuscarCupom}>buscar</button>
          </div>
        </div>
      </div>
    </div>

{/*//---------------------------------------------------------------------------------------------------------------------------------------------------------*/}



{/* <-------- Modal de finalizar compra -------> */}
<div className="modal fade" id="modal-finalizar-compra" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fs-5" id='info_text'>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ color: color }}>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
              </svg>
              Resumo
            </h3>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
          <div className='cart-finalize-list'>
                <div class="overflow-y-auto">
                {list.map((item, index) => (
                  <div key={index} className="finalize-item">
                    <img src={`https://hotmenu.com.br/arquivos/${item.product.Foto}`} alt={item.product.Nome} className="cart-item-img" />
                    <p className='pedido-desccao'>{item.product.Nome}<br></br>Quantidade: {item.quantity}
                    
                      {item.additionalStates.map((additional, additionalIndex) => (
                        <p key={additionalIndex} className='pedido-desccao-detalis'>
                          {additional.observacao.map(obs => (
                            obs.selected ? (
                              <span key={obs.Id}>{formatarTexto(obs.Nome)}, </span>
                            ) : null
                          ))}
                          {additional.options.map(option => (
                            option.count > 0 ? (
                              <span key={option.id}>{option.count}x {truncateText(formatarTexto(option.name))}, </span>
                            ) : null
                          ))}
                          {additional.produtos.map(produto => (
                            produto.count > 0 ? (
                              <span key={produto.Id}>{produto.count}x {truncateText(formatarTexto(produto.Nome))}, </span>
                            ) : null
                          ))}
                        </p>
                      ))}
                      </p>
                      
                  </div>
                ))}
              </div>
                </div>
                <div className='total-valor-pedido'>
                <p className='total-valor-pedido-p'>Valor total: <span className='total-valor-pedido-span'>R$ {valorTotalPedido}</span></p>
              </div>
                <form className="row g-3">
                  <div className='user--inputs-conteine'>
                  <div className="col-md-6">
                <label htmlFor="inputNome4" className="form-label-credit-usuario">Nome</label>
                <input type="text" className="form-control" id="inputNome4" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputTelefone4" className="form-label-credit-usuario">Telefone</label>

                <InputMask
                 className="form-control"
                 mask = '99999-999999'
                  id="inputTelefone4" value={telefone} 
                  onChange={(e) => setTelefone(e.target.value)} 
                  >
                </InputMask>
                  {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputTelefone4" />}
                  
              </div>
                  </div><hr></hr>

        <h3 className='formas_retirada_titulo'>Forma de retirda</h3>
      <Tab.Container id="delivery-tabs" activeKey={activeTab} onSelect={handleTabSelect}>
      <Nav variant="tabs" className="mb-3">
        {deliveryOptions.pickup && (
          <Nav.Item>
            <Nav.Link eventKey="pickup" style={{color: color}}>Retirada</Nav.Link>
          </Nav.Item>
        )}
        {deliveryOptions.home && (
          <Nav.Item>
            <Nav.Link eventKey="home"style={{color: color}}>Entrega</Nav.Link>
          </Nav.Item>
        )}
        {deliveryOptions.mesa && (
          <Nav.Item>
            <Nav.Link eventKey="mesa"style={{color: color}}>Em mesa</Nav.Link>
          </Nav.Item>
        )}
      </Nav>
      <Tab.Content>
        {activeTab === 'pickup' && (
          <Tab.Pane eventKey="pickup">
            <h3>Retirada No Local</h3>
            <p>{estabelecimento ? estabelecimento.Endereco : "Endereço"}</p>
          </Tab.Pane>
        )}
        {activeTab === 'home' && (
          <Tab.Pane eventKey="home">
            <div className="col-12">
              <label htmlFor="inputAddress" className="form-label-credit-usuario">Endereço</label>
              <input type="text" className="form-control" id="inputAddress" placeholder="Av. Luís Viana Filho, 6462 - Paralela" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </div>
            <div className="col-12">
              <label htmlFor="inputComplemento" className="form-label-credit-usuario">Complemento</label>
              <input type="text" className="form-control" id="inputComplemento" placeholder="Wall Street Empresarial" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCity" className="form-label-credit-usuario">Bairro</label>
              <input type="text" className="form-control" id="inputCity" value={bairro} onChange={(e) => setBairro(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label htmlFor="inputZip" className="form-label-credit-usuario">Cep</label>
              <InputMask
                mask="99999-999"
                className="form-control"
                id="inputZip"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              >
                {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputZip" />}
              </InputMask>
            </div>
          </Tab.Pane>
        )}
        {activeTab === 'mesa' && (
          <Tab.Pane eventKey="mesa">
            <div className="col-12">
              <label htmlFor="inputMesa" className="form-label-credit-usuario">Número da mesa</label>
              <input type="text" className="form-control" id="inputMesa" value={mesa} onChange={(e) => setMesa(e.target.value)} />
            </div>
          </Tab.Pane>
        )}
      </Tab.Content>
    </Tab.Container>

    <h3 className='formas_retirada_titulo'>Forma de pagamento</h3>
    <Tab.Container id="pagamento-tabs" activeKey={activeTabCard} onSelect={handleTabCardSelect}>
      <Nav variant="tabs" className="mb-3">
      {(pagamentoOptions.pagamentoNaRetirada === null || true) &&(
          <Nav.Item>
            <Nav.Link eventKey="pagamentoNaRetirada"style={{color: color}}>Pagar na retirada</Nav.Link>
          </Nav.Item>
          )}
        {pagamentoOptions.pagamentoOnline  && (
          <Nav.Item>
            <Nav.Link eventKey="pagamentoOnline" style={{color: color}}>Pagar online</Nav.Link>
          </Nav.Item>
        )}
        
      </Nav>
    
      <Tab.Content> 
        {activeTabCard==='pagamentoNaRetirada' &&(
          <Tab.Pane eventKey="pagamentoNaRetirada">
<div className='conteiner-check'>
{Object.keys(formasPorTipo).map((tipo) => (
    <div key={tipo} className="form-check">
        <input
            className="form-check-input"
            type="radio"
            name="paymentOption"
            id={`${tipo}Option`}
            value={tipo}
            checked={selectedOption === tipo.toLowerCase()}
            onChange={handleOptionChange}
        />
        <label className="form-label-check" htmlFor={`${tipo}Option`}>
            {tipo}
        </label>
    </div>
    
))}
</div>
<div className='conteiner-check'>
{Object.keys(formasSemTipo).map((tipo) => (
    <div key={tipo} className="form-check">
        <input
            className="form-check-input"
            type="radio"
            name="paymentOption"
            id={`${tipo}Option`}
            value={tipo}
            checked={selectedOption === tipo.toLowerCase()}
            onChange={handleOptionChange}
        />
        <label className="form-label-check" htmlFor={`${tipo}Option`}>
            {tipo}
        </label>
    </div>
))}
</div><hr></hr>
<div className="payment-icons">
    {selectedOption && renderFormas(selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1))}
    {selectedOption && renderFormasSemTipo(selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1))}
</div> <hr></hr>



{selectedOption === 'Dinheiro' ? (
    <div className='titular-card-pay-conteiner'>
        <div className="col-md-4">
            <label htmlFor="inputChangeValue" className='labelValorTroco'>Valor para troco</label>
            <input 
                type="text" 
                className="form-control" 
                id="inputChangeValue" 
                value={valorTroco} 
                onChange={(e) => setValorTroco(e.target.value)} 
            />
        </div>
    </div>
) : null}

{selectedOption === 'Pix' ? (
    <div className='titular-card-pay-conteiner'>
        <div className="col-md-4">
            <label htmlFor="inputChangeValue" className='labelValorTroco'>Chave pix</label>
            <input 
              readOnly
                type="text" 
                className="form-control" 
                id="inputChangeValue" 
                value={estabelecimento.ChavePix || ''}
                onChange={() => {}} 
            />
              <button 
              className="btn btn-secondary ms-2" 
              onClick={() => {
                  navigator.clipboard.writeText(estabelecimento.ChavePix || '');
                  alert('Chave Pix copiada!');
              }}
            >
              Copiar
            </button>
        </div>
      
    </div>
) : null}

            
          </Tab.Pane>
          )}
        
      </Tab.Content>


      <Tab.Content>
        {activeTabCard === 'pagamentoOnline' && (
          <Tab.Pane eventKey="pagamentoOnline">
           
    <h6 className='pagamento_online_title'>Crédito</h6>
    <div className='titular-card-pay-container'>
    <div className="row">
        <div className="col-md-6">
            <label htmlFor="inputCardNumber">Número do cartão</label>
            <InputMask 
               
               className={`form-control ${errorCard ? 'is-invalid' : ''}`}
                id="inputCardNumber" 
                mask="9999 9999 9999 9999"
                value={cartao} 
                onChange={handleCardChange } 
            >
               {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputCardNumber" />}
               </InputMask>
               {errorCard && <div className="invalid-feedback">{errorCard}</div>}
        </div>
        <div className="col-md-6">
            <label htmlFor="inputCardHolder">Nome do titular</label>
            <input 
                type="text" 
                className="form-control" 
                id="inputCardHolder" 
                value={titular} 
                onChange={(e) => setTitular(e.target.value)} 
            />
        </div>
    </div>
    <div className='card-date-container'>
<div className="row">
    <div className="card-date-container_grid">
    <div className=" col-sm-6">
    <label htmlFor="inputExpiryDate">Data de vencimento</label>
          <InputMask
            mask="99/99"
            placeholder='MM/AA'
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
          >
            {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputExpiryDate" />}
          </InputMask>
        </div>
        <div className=" col-sm-6">
        <label htmlFor="inputCVC">CVC</label>
          <InputMask
            mask="999"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          >
            {(inputProps) => <input {...inputProps} type="text" className="form-control" id="inputCVC" />}
          </InputMask>
    </div>
    </div>
    
</div>
</div>
</div>

       </Tab.Pane>
       
  )}
        
    </Tab.Content>
    </Tab.Container>

  
            </form>
          </div>
          
          <div className="modal-footer">
            <button type="button"  id='finalizar-pedido-btn'  onClick={handleFinalizarPedido}
             style={{backgroundColor : finalizarButtonHover.isHovered ? '#332D2D' : color}}
             onMouseEnter={finalizarButtonHover.handleMouseEnter}
             onMouseLeave={finalizarButtonHover.handleMouseLeave}
            >Finalizar pedido</button>
            <ToastContainer />
            <button type="button" id='excluir-pedido-btn' onClick={hendlerRemovePedido}
             style={{backgroundColor : cancelarButtonHover.isHovered ? '#332D2D' : color}}
             onMouseEnter={cancelarButtonHover.handleMouseEnter}
             onMouseLeave={cancelarButtonHover.handleMouseLeave}
            >Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}
export default Header_component;