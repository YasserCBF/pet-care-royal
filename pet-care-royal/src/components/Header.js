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

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-text">Pet Care Royal</Link>
      </div>
      <nav className="nav-center">
        <div className="relative">
          <button
            onClick={() => setShowServices(!showServices)}
            className="login-button py-1 px-3"
          >
            Servicios
          </button>
          {showServices && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-10">
              <a href="#services?filter=Paseo" className="block px-4 py-2 hover:bg-gray-200">Paseo</a>
              <a href="#services?filter=Baño" className="block px-4 py-2 hover:bg-gray-200">Baño</a>
              <a href="#services?filter=Corte" className="block px-4 py-2 hover:bg-gray-200">Corte</a>
              <a href="#services?filter=Guardería" className="block px-4 py-2 hover:bg-gray-200">Guardería</a>
            </div>
          )}
        </div>
        <a href="#about" className="login-button py-1 px-3">Nosotros</a>
        <a href="#location" className="login-button py-1 px-3">Ubicación</a>
        <a href="#reviews" className="login-button py-1 px-3">Reseñas</a>
        <a href="#contact" className="login-button py-1 px-3">Contáctanos</a>
      </nav>
      <div className="login-container">
        {user ? (
          <>
            <span className="mr-2 text-sm">{user.email || user.displayName}</span>
            <button
              onClick={handleLogout}
              className="login-button py-1 px-3"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button py-1 px-3">Iniciar Sesión</Link>
        )}
      </div>
    </header>
  );
};

export default Header;