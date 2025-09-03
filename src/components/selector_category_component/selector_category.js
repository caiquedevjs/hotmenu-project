import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchEstabelecimentoData } from '../service/productService';
import './selector_category.css';
import { useParams } from 'react-router-dom';
import CategoryItem from './CategoryItem'; // <-- Importe o novo componente

const SelectorCategoryComponent = ({ categories, products }) => {
  const { storeName } = useParams();
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData(storeName);
        if (data && data.CorPadrao) {
          setEstabelecimento(data);
          setColor(data.CorPadrao);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do estabelecimento:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataEstabelecimento();
  }, [storeName]);

  // <-- OTIMIZAÇÃO PRINCIPAL: Pré-processamento com useMemo
  // Criamos um mapa de acesso rápido (O(1)) para o primeiro produto de cada categoria.
  // Este código só executa uma vez ou quando `products` mudar.
  const firstProductPerCategory = useMemo(() => {
    if (!products || products.length === 0) {
      return new Map();
    }
    
    const productMap = new Map();
    // Iteramos sobre os produtos UMA VEZ
    for (const product of products) {
      // Se o mapa ainda não tem um produto para esta categoria, adicionamos
      if (!productMap.has(product.CategoriaId)) {
        productMap.set(product.CategoriaId, product);
      }
    }
    return productMap;
  }, [products]);

  // Otimização com useCallback para a função de rolagem
  const scrollToCategory = useCallback((categoryId) => {
    const categoryElement = document.getElementById(`category-${categoryId}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []); // Sem dependências, a função nunca será recriada

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  // Se não houver categorias, não renderiza nada.
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className='selector_category_component'>
      <div
        className="category-scroll-container"
        style={{
          scrollbarColor: `${color} transparent`,
          scrollbarWidth: "thin"
        }}
      >
        {categories.map((category) => {
          // A busca agora é instantânea usando o mapa pré-calculado
          const firstProduct = firstProductPerCategory.get(category.Id);
          
          // Renderiza o componente filho memoizado
          return (
            <CategoryItem 
              key={category.Id}
              category={category}
              firstProduct={firstProduct}
              onCategoryClick={scrollToCategory}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SelectorCategoryComponent;