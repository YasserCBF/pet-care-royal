import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-text">Pet Care Royal</Link>
      </div>
      <nav className="nav-center">
        <a href="#services">Servicios</a>
        <a href="#about">Nosotros</a>
      </nav>
      <div className="login-container">
        <Link to="/login" className="login-button">Iniciar Sesión</Link>
      </div>
    </header>
  );
};

export default Header;