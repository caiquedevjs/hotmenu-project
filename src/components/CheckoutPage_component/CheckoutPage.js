import React from 'react';

const CheckoutPage = () => {
  return (
    <div>
      <h1>Finalizar Compra</h1>
      <form>
        {/* Adicione aqui os campos do formulário para finalizar a compra */}
        <div>
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" name="nome" required />
        </div>
        <div>
          <label htmlFor="endereco">Endereço:</label>
          <input type="text" id="endereco" name="endereco" required />
        </div>
        <div>
          <label htmlFor="cartao">Número do Cartão:</label>
          <input type="text" id="cartao" name="cartao" required />
        </div>
        <button type="submit">Finalizar Compra</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
