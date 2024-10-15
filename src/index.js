import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './components/modal_cart_itens/CartContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importando o Router e o Routes

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      {/* Envolvemos o App com Router e definimos uma rota dinâmica */}
      <Router>
        <Routes>
          <Route path="/:storeName" element={<App />} /> {/* Capturando o nome do estabelecimento da URL */}
        </Routes>
      </Router>
    </CartProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
