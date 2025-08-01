import { useState, useEffect } from 'react';
import { fetchPerguntas, fetchProductById } from '../service/productService';

const useAdditionalState = (productId) => {
  const [additionalStates, setAdditionalStates] = useState([]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const perguntas = await fetchPerguntas(productId);
        const productData = await fetchProductById(productId);

        const transformedData = perguntas.map(pergunta => ({
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
          produtos: pergunta.Produto.map(produto => ({
            Id: produto.Id,
            Nome: produto.Nome,
            PrecoDeVenda: produto.PrecoDeVenda,
            count: 0,
            QtdMaximaPermitida: produto.QtdMaximaPermitida || null
          })),
          observacao: pergunta.Observacao || []
        }));

        // Pergunta fake para tamanhos
        if (productData?.Tamanhos?.length > 0) {
          const tamanhosPergunta = {
            id: 'tamanhos',
            description: 'Escolha um tamanho',
            type: 1, // observação tipo radio
            required: true,
            minOptions: 1,
            maxOptions: 1,
            selectedCount: 0,
            produtos: [],
            options: [],
            observacao: productData.Tamanhos.map(tamanho => ({
              Id: tamanho.Id,
              Nome: tamanho.Nome,
              PrecoDeVenda: tamanho.PrecoDeVenda,
              selected: false
            }))
          };
          transformedData.unshift(tamanhosPergunta);
        }

        // Pergunta para as partes do produto (sabores)
        if (productData?.PartesProduto?.length > 0 && productData.QuantidadePartes > 0) {
          const partesPergunta = {
            id: 'partes-produto',
            description: `Escolha ${productData.QuantidadePartes} sabores`,
            type: 2, // assume que é tipo adicionais com incremento/decremento
            required: true,
            minOptions: productData.QuantidadePartes,
            maxOptions: productData.QuantidadePartes,
            selectedCount: 0,
            produtos: productData.PartesProduto.map(parte => ({
              Id: parte.Id,
              Nome: parte.Nome,
              PrecoDeVenda: parte.PrecoDeVenda,
              count: 0,
              QtdMaximaPermitida: 1 // cada sabor no máximo 1 vez (se quiser pode ajustar)
            })),
            options: [],
            observacao: [],
            PrecoPeloMaiorValor: productData.PrecoPeloMaiorValor // aqui que vai o flag
          };
          transformedData.push(partesPergunta);
        }

        setAdditionalStates(transformedData);
      } catch (error) {
        console.error('Erro ao buscar dados adicionais:', error);
      }
    };

    if (productId) {
      fetchAdditionalData();
    }
  }, [productId]);

  // Função que calcula o preço total dos adicionais considerando PrecoPeloMaiorValor
  const calcularPrecoAdicionais = () => {
    let total = 0;

    additionalStates.forEach(additional => {
      if (additional.id === 'partes-produto') {
        const precoPeloMaiorValor = additional.PrecoPeloMaiorValor ?? false;

        if (precoPeloMaiorValor) {
          // Pega o maior preço das partes selecionadas
          const precosSelecionados = additional.produtos
            .filter(prod => prod.count > 0)
            .map(prod => prod.PrecoDeVenda);

          if (precosSelecionados.length > 0) {
            total += Math.max(...precosSelecionados);
          }
        } else {
          // Soma normal das partes
          total += additional.produtos.reduce(
            (acc, prod) => acc + prod.PrecoDeVenda * prod.count,
            0
          );
        }
      } else {
        // Para outras perguntas, soma normalmente preços dos produtos
        if (additional.produtos && additional.produtos.length > 0) {
          total += additional.produtos.reduce(
            (acc, prod) => acc + prod.PrecoDeVenda * prod.count,
            0
          );
        } else if (additional.options && additional.options.length > 0) {
          total += additional.options.reduce(
            (acc, opt) => acc + opt.price * opt.count,
            0
          );
        }
      }
    });

    return total;
  };

  // Restante do código permanece igual
  const handleIncrement = (id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState =>
      prevState.map(additional => {
        if (additional.id === perguntaId) {
          if (isProduto) {
            const item = additional.produtos.find(produto => produto.Id === id);
            if (item) {
              const maxPerItem = additional.maxOptions;
              const totalSelected = additional.selectedCount;

              if (item.count < maxPerItem && totalSelected < additional.maxOptions) {
                return {
                  ...additional,
                  produtos: additional.produtos.map(prod =>
                    prod.Id === id ? { ...prod, count: prod.count + 1 } : prod
                  ),
                  selectedCount: totalSelected + 1
                };
              }
            }
          } else if (additional.type === 1) {
            const item = additional.observacao.find(obs => obs.Id === id);
            if (item) {
              const updatedObservacoes = additional.observacao.map(obs => ({
                ...obs,
                selected: obs.Id === id
              }));
              return {
                ...additional,
                observacao: updatedObservacoes,
                selectedCount: Math.min(additional.maxOptions, additional.selectedCount + 1)
              };
            }
          } else {
            const item = additional.options.find(option => option.id === id);
            if (item) {
              if (item.count < additional.maxOptions && additional.selectedCount < additional.maxOptions) {
                return {
                  ...additional,
                  options: additional.options.map(it =>
                    it.id === id ? { ...it, count: it.count + 1 } : it
                  ),
                  selectedCount: additional.selectedCount + 1
                };
              }
            }
          }
        }
        return additional;
      })
    );
  };

  const handleDecrement = (id, perguntaId, isProduto = false) => {
    setAdditionalStates(prevState =>
      prevState.map(additional => {
        if (additional.id === perguntaId) {
          if (isProduto) {
            const item = additional.produtos.find(produto => produto.Id === id);
            if (item && item.count > 0) {
              return {
                ...additional,
                produtos: additional.produtos.map(prod =>
                  prod.Id === id ? { ...prod, count: prod.count - 1 } : prod
                ),
                selectedCount: Math.max(0, additional.selectedCount - 1)
              };
            }
          } else if (additional.type === 1) {
            const item = additional.observacao.find(obs => obs.Id === id);
            if (item && item.selected) {
              const updatedObservacoes = additional.observacao.map(obs => ({
                ...obs,
                selected: obs.Id === id ? false : obs.selected
              }));
              return {
                ...additional,
                observacao: updatedObservacoes,
                selectedCount: Math.max(0, additional.selectedCount - 1)
              };
            }
          } else {
            const item = additional.options.find(option => option.id === id);
            if (item && item.count > 0) {
              return {
                ...additional,
                options: additional.options.map(it =>
                  it.id === id ? { ...it, count: it.count - 1 } : it
                ),
                selectedCount: Math.max(0, additional.selectedCount - 1)
              };
            }
          }
        }
        return additional;
      })
    );
  };

  const getSelectedTamanho = () => {
    const tamanhoPergunta = additionalStates.find(item => item.id === 'tamanhos');
    if (!tamanhoPergunta || !tamanhoPergunta.observacao) return null;
    const selecionado = tamanhoPergunta.observacao.find(obs => obs.selected);
    return selecionado || null;
  };

  const totalAdditional = () => {
    return additionalStates.reduce((total, additional) => total + additional.selectedCount, 0);
  };

  return {
    totalAdditional,
    additionalStates,
    handleIncrement,
    handleDecrement,
    getSelectedTamanho,
    calcularPrecoAdicionais, // exporta a função para uso externo
  };
};

export default useAdditionalState;
