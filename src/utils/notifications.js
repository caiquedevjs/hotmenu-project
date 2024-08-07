// <-------- função para evento de notificações-------->
import { toast } from 'react-toastify';

export const notify = (name) => toast.success(`Olá ${name}, seu pedido foi feito com sucesso!`);
export const notify02 = () => toast.success('Você receberá o status do pedido pelo WhatsApp.');
