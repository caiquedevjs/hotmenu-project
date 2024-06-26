/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import Header_component from './components/header_component/header';
import Infos_component from './components/infos_component/infos';
import Infos_icons_component from './components/infos_icons_component/infos_icons';
import Status_moment_component from './components/status_moment_component/status_moment';
import Selector_category_component from './components/selector_category_component/selector_category';
import Category_component from './components/category_component/category';



function App() {


  return (
    <div className="App">
      <Header_component />
      <Status_moment_component />
      <Infos_component />
      <Infos_icons_component />
      <Selector_category_component/>
      <Category_component/>
     <footer>
     <div className='conteiner_hotmenu_logo'>
            <img src="logo-removebg-preview.png" alt="..."></img>
            </div>
      <label>© Copyright 2024 Hotmenu. Todos os direitos reservados.</label>
     </footer>
     
      
    </div>
  );
}

export default App;
