import React,{useEffect, useState} from 'react';
import {fetchEstabelecimentoData } from '../service/productService';
import './selector_category.css';

const SelectorCategoryComponent = ({ categories }) => {
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


  if (!categories || categories.length === 0) {
    return null; // <-----------Retorna null ou algum componente de carregamento se não houver categorias ainda----------->
  }

  return (
    <div className='selector_category_component'>
      <div className="dropdown">
        <button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{backgroundColor : color}}>
          Categorias
        </button>
        <ul className="dropdown-menu">
          {categories.map((category, index) => (
            <li key={index}><a className="dropdown-item" href={`#category-${category.Id}`}>{category.Nome}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectorCategoryComponent;
