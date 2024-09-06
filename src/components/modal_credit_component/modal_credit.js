import React, { useEffect, useState } from "react";
import './modal_credit.css';
import { fetchFormaPagamentos, fetchEstabelecimentoData  } from "../service/productService";


const Modal_credit_component = () => {
    const [formasPorTipo, setFormasPorTipo] = useState({});
    const [formasSemTipo, setFormasSemTipo] = useState({});
    const [estabelecimento, setEstabelecimento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [color, setColor] = useState("");

    useEffect(() => {
        const fetchDataEstabelecimento = async () => {
          try {
            const data = await fetchEstabelecimentoData();
            if (data && data.CorPadrao) {
              setEstabelecimento(data);
              setColor(data.CorPadrao);
            } else {
              setError('Nenhum dado recebido da API');
            }
          } catch (error) {
            setError('Erro ao buscar dados do estabelecimento');
            console.error('Erro na busca: ', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchDataEstabelecimento();
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchFormaPagamentos();
                if (response && response.FormasDePagamento) {
                    // Organize formas by tipo and handle formas without tipo
                    const formasByTipo = {};
                    const formasSemTipo = {};

                    response.FormasDePagamento.forEach((curr) => {
                        if (curr.Tipo) {
                            if (!formasByTipo[curr.Tipo]) {
                                formasByTipo[curr.Tipo] = [];
                            }
                            formasByTipo[curr.Tipo].push(curr);
                        } else {
                            // Ensure each key in formasSemTipo is an array
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
    }, []);

    // Function to render formas by tipo
    const renderFormas = (tipo) => {
        if (!formasPorTipo[tipo]) return null;
        return (
            <><div className="payment-grid">
                {formasPorTipo[tipo].map((forma) => (
                    <div key={forma.Id} className="payment-item">
                        <img src={`https://hotmenu.com.br/assets/images/FormaPagamento/${forma.Imagem}`} alt={forma.Nome} />

                    </div>
                ))}
            </div><hr></hr></>
        );
    };

    // Function to render formas sem tipo
    const renderFormasSemTipo = (nome) => {
        const formas = formasSemTipo[nome];
        if (!formas || !Array.isArray(formas)) return null;
        return (
            <><div className="payment-grid">
                {formas.map((forma) => (
                    <div key={forma.Id} className="payment-item">
                        <img src={`https://hotmenu.com.br/assets/images/FormaPagamento/${forma.Imagem}`} alt={forma.Nome} />

                    </div>
                ))}
            </div><hr></hr></>
        );
    };

    return (
        <div className="modal fade" id="credit-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 id='info_text'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-credit-card-fill" viewBox="0 0 16 16" style={{ color: color }}>
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1"/>
                            </svg> Pagamentos
                        </h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div id='img_pay_conteiner'>
                            {Object.keys(formasPorTipo).map((tipo) => (
                                <div key={tipo} className="payment-category">
                                    <h3 id='pay_text'>{tipo}:</h3>
                                    {renderFormas(tipo)}
                                </div>
                            ))}
                            {Object.keys(formasSemTipo).map((nome) => (
                                <div key={nome} className="payment-category">
                                    <h3 id='pay_text'>{nome}:</h3>
                                    {renderFormasSemTipo(nome)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal_credit_component;
