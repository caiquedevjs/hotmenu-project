import React, { useEffect, useState } from 'react';
import { fetchEstabelecimentoData } from '../service/productService';
import './selector_category.css';
import { useParams } from 'react-router-dom';

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
          setColor(data.CorPadrao); // Define a cor a partir da API
        }
      } catch (error) {
        console.error('Erro ao buscar dados do estabelecimento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataEstabelecimento();
  }, [storeName]);

  const scrollToCategory = (categoryId) => {
    const categoryElement = document.getElementById(`category-${categoryId}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  if (!categories || categories.length === 0) {
    return <p>Sem categorias disponíveis.</p>;
  }

  return (
    <div className='selector_category_component'>
      <div
        className="category-scroll-container"
        style={{
          scrollbarColor: color + " transparent", // Cor da barra de rolagem
          scrollbarWidth: "thin" // Para Firefox
        }}
      >
        {categories.map((category) => {
          const firstProduct = products.find(product => product.CategoriaId === category.Id);
          return (
            <div className="category" key={category.Id}>
              {firstProduct ? (
                <div className="category-item" onClick={() => scrollToCategory(category.Id)}>
                  <img
                    src={`https://hotmenu.com.br/arquivos/${firstProduct.Foto}`}
                    alt={firstProduct.Nome}
                    className="category-image"
                  />
                  <h4 className="category-title">{category.Nome}</h4>
                </div>
              ) : (
                <p>Sem produtos disponíveis</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectorCategoryComponent;
