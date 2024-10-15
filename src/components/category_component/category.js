/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import './category_styles.css';
import Grid_component from '../Grid_component/Grid_component';
import { fetchCategories, fetchEstabelecimentoData } from '../service/productService';
import SelectorCategoryComponent from '../selector_category_component/selector_category';
import ModalBusca from '../modal_search_component/modal_search_component';
import { useParams } from 'react-router-dom'; // Importando useParams para pegar o nome do estabelecimento

const Category_component = () => {
  const { storeName } = useParams(); // Captura o nome do estabelecimento da URL

  // Estados das categorias
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");

  // Lógica da busca por categorias na API
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await fetchCategories(storeName); // Passa o nome do estabelecimento para a função
        // Filtra e ordena categorias
        const filteredCategories = fetchedCategories
          .filter(category => !category.Removido)
          .sort((a, b) => a.Ordem - b.Ordem);
        setCategories(filteredCategories);
        setIsLoading(false); // Marca o carregamento como completo
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        setIsLoading(false); // Marca o carregamento como completo mesmo em caso de erro
      }
    };

    if(storeName){
      fetchCategoriesData();
    }
  }, [storeName]); // Dependência de storeName para refazer a busca ao mudar o nome do estabelecimento


  useEffect(() => {
    const fetchDataEstabelecimento = async () => {
      try {
        const data = await fetchEstabelecimentoData(storeName); // Passa o nome do estabelecimento para a função
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
  }, [storeName]); // Dependência de storeName para refazer a busca ao mudar o nome do estabelecimento


  if (isLoading) {
    return (
      <div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='category_component'>
      {categories.length > 0 && <SelectorCategoryComponent categories={categories} />}
      <div id='category_container'>
        {categories.map((category, index) => (
          <div key={index}>
            <div id='category_label_title'>
              <h4 className='category_title' id={`category-${category.Id}`} style={{ backgroundColor: color }}>{category.Nome}</h4>
            </div>
            {/* Renderiza o grid de categorias e passa as categoria.Id e categoria.Nome como propriedade */}
            <Grid_component categoryId={category.Id} categoryName={category.Nome} />
          </div>
        ))}
      </div>
      {/* Renderiza o ModalBusca e passa as categorias como propriedade */}
      <ModalBusca categories={categories} /> 
    </div>
  );
};

export default Category_component;
