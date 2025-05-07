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
  };


  const handleServiceClick = (filter) => {
    
    scrollToSection('services');

    setShowServices(false);

  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-text">Pet Care Royal</Link>
      </div>
      <nav className="nav-center">
        <div className="relative">
          <button
            onClick={() => setShowServices(!showServices)}
            className="login-button"
            style={{ padding: 'var(--spacing-small) var(--spacing-medium)' }}
          >
            Servicios
          </button>
          {showServices && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-10" style={{ minWidth: '150px' }}>
              <button
                onClick={() => handleServiceClick('Paseo')}
                className="block px-4 py-2 hover:bg-gray-200 text-gray-800 w-full text-left"
              >
                Paseo
              </button>
              <button
                onClick={() => handleServiceClick('Baño')}
                className="block px-4 py-2 hover:bg-gray-200 text-gray-800 w-full text-left"
              >
                Baño
              </button>
              <button
                onClick={() => handleServiceClick('Corte')}
                className="block px-4 py-2 hover:bg-gray-200 text-gray-800 w-full text-left"
              >
                Corte
              </button>
              <button
                onClick={() => handleServiceClick('Guardería')}
                className="block px-4 py-2 hover:bg-gray-200 text-gray-800 w-full text-left"
              >
                Guardería
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => scrollToSection('about')}
          className="login-button"
          style={{ padding: 'var(--spacing-small) var(--spacing-medium)' }}
        >
          Nosotros
        </button>
        <button
          onClick={() => scrollToSection('location')}
          className="login-button"
          style={{ padding: 'var(--spacing-small) var(--spacing-medium)' }}
        >
          Ubicación
        </button>
        <button
          onClick={() => scrollToSection('reviews')}
          className="login-button"
          style={{ padding: 'var(--spacing-small) var(--spacing-medium)' }}
        >
          Reseñas
        </button>
        <button
          onClick={() => scrollToSection('contact')}
          className="login-button"
          style={{ padding: 'var(--spacing-small) var(--spacing-medium)' }}
        >
          Contáctanos
        </button>
      </nav>
      <div className="login-container">
        {user ? (
          <>
            <span className="mr-2 text-sm" style={{ color: 'var(--gris-oscuro)' }}>{user.email || user.displayName}</span>
            <button
              onClick={handleLogout}
              className="login-button"
              style={{ padding: 'var(--spacing-small) var(--spacing-medium)' }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button" style={{ padding: 'var(--spacing-small) var(--spacing-medium)' }}>Iniciar Sesión</Link>
        )}
      </div>
    </header>
  );
};

export default Header;