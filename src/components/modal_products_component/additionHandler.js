import { useState, useEffect } from 'react';
import { fetchPerguntas } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const perguntas = await fetchPerguntas(productId);
        
        const transformedData = perguntas.map(pergunta => {
          return {
            id: pergunta.PerguntaId,
            description: pergunta.Texto,
            type: pergunta.Tipo,
            required: pergunta.RespostaObrigatoria,
            minOptions: pergunta.QtdOpcoesResPostaMin,
            maxOptions: pergunta.QtdOpcoesResPostaMax,
            options: pergunta.Complemento.map(complemento => ({
              id: complemento.Id,
              name: complemento.Nome,
              price: complemento.PrecoVenda,
              count: 0,
              QtdMaximaPermitida: complemento.QtdMaximaPermitida || null
            })),
            selectedCount: 0,
            observacao: pergunta.Observacao || [],
            produtos: pergunta.Produto.map(produto => ({
              Id: produto.Id,
              Nome: produto.Nome,
              PrecoDeVenda: produto.PrecoDeVenda,
              count: 0,
              QtdMaximaPermitida: produto.QtdMaximaPermitida || null
            })) // Transformando produtos da mesma forma
          };
        });

        setAdditionalStates(transformedData);
      } catch (error) {
        console.error('Erro ao buscar adicionais:', error);
      }
    };

    if (productId) {
      fetchAdditionalData();
    }
  }, [productId]);

  const handleIncrement = (id, isProduto = false) => {
    setAdditionalStates(prevState => {
      return prevState.map(additional => {
        if (additional.type === 1) { // Para observações
          const item = additional.observacao.find(obs => obs.Id === id);
          if (item) {
            // Desmarcar todas as observações
            const updatedObservacoes = additional.observacao.map(obs => ({
              ...obs,
              selected: obs.Id === id // Marca a observação selecionada
            }));
            return {
              ...additional,
              observacao: updatedObservacoes,
              selectedCount: 1 // Apenas uma pode ser selecionada
            };
          }
        } else {
          const item = isProduto
            ? additional.produtos.find(produto => produto.Id === id)
            : additional.options.find(option => option.id === id);
  
          if (item) {
            const totalSelected = additional.selectedCount + 1;
            const maxAllowed = item.QtdMaximaPermitida || additional.maxOptions;
  
            if (item.count < maxAllowed && totalSelected <= additional.maxOptions) {
              return {
                ...additional,
                [isProduto ? 'produtos' : 'options']: additional[isProduto ? 'produtos' : 'options'].map(it =>
                  it[isProduto ? 'Id' : 'id'] === id ? { ...it, count: it.count + 1 } : it
                ),
                selectedCount: totalSelected
              };
            }
          }
        }
        return additional;
      });
    });
  };
  

  const handleDecrement = (id, isProduto = false) => {
    setAdditionalStates(prevState => {
      return prevState.map(additional => {
        const item = isProduto
          ? additional.produtos.find(produto => produto.Id === id)
          : additional.options.find(option => option.id === id);

        if (item) {
          const totalSelected = additional.selectedCount - 1;

          if (item.count > 0) {
            return {
              ...additional,
              [isProduto ? 'produtos' : 'options']: additional[isProduto ? 'produtos' : 'options'].map(it =>
                it[isProduto ? 'Id' : 'id'] === id ? { ...it, count: it.count - 1 } : it
              ),
              selectedCount: totalSelected
            };
          }
        }
        return additional;
      });
    });
  };

  const totalAdditional = () => {
    return additionalStates.reduce((total, additional) => total + additional.selectedCount, 0);
  };

  return {
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement
  };
};

export default useAdditionalState;
