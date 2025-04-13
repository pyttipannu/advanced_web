import { useTranslation } from 'react-i18next';
import './i18n'; 
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navigation from './components/Navigation';
import Board from './components/Board';


function App() {
  const {t} = useTranslation();
  

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <h1>{t("AdvancedProject")}</h1>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/board" element={<Board/>} />

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
