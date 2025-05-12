import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const [showServices, setShowServices] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setShowServices(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-text">Pet Care Royal</Link>
      </div>
      <nav className="nav-center">
        <button
          onClick={() => setShowServices(!showServices)}
          className="nav-button"
        >
          Servicios
        </button>
        {showServices && (
          <div className="dropdown-menu">
            <button onClick={() => scrollToSection('services')} className="dropdown-item">Todos los Servicios</button>
            <button onClick={() => scrollToSection('services')} className="dropdown-item">Paseo</button>
            <button onClick={() => scrollToSection('services')} className="dropdown-item">Baño</button>
            <button onClick={() => scrollToSection('services')} className="dropdown-item">Corte</button>
            <button onClick={() => scrollToSection('services')} className="dropdown-item">Guardería</button>
            <button onClick={() => scrollToSection('services')} className="dropdown-item">Entrenamiento</button>
          </div>
        )}
        <button onClick={() => scrollToSection('daily-tip-section')} className="nav-button">Consejo del Día</button>
        <button onClick={() => scrollToSection('pet-quotes-section')} className="nav-button">Frases Inspiradoras</button>
        <button onClick={() => scrollToSection('about')} className="nav-button">Nosotros</button>
        <button onClick={() => scrollToSection('location')} className="nav-button">Ubicación</button>
        <button onClick={() => scrollToSection('bookings')} className="nav-button">Reservas</button>
        <button onClick={() => scrollToSection('reviews')} className="nav-button">Reseñas</button>
        <button onClick={() => scrollToSection('contact')} className="nav-button">Contáctanos</button>
        <button onClick={() => scrollToSection('faq')} className="nav-button">Preguntas Frecuentes</button>
      </nav>
      <div className="login-container">
        {user ? (
          <>
            <span className="user-email">{user.email || user.displayName}</span>
            <button onClick={handleLogout} className="login-button">Cerrar Sesión</button>
          </>
        ) : (
          <Link to="/login" className="login-button">Iniciar Sesión</Link>
        )}
      </div>
    </header>
  );
};

export default Header;