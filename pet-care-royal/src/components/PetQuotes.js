import React, { useState, useEffect } from 'react';

const PetQuotes = () => {
  const quotes = [
    "El amor de una mascota es el más puro que existe. 🐾",
    "Un hogar con una mascota es un hogar lleno de felicidad. 🏡",
    "Las mascotas no solo llenan tu casa, también llenan tu corazón. ❤️",
    "Cada día con tu mascota es una nueva aventura mágica. ✨",
    "El cariño de una mascota es un tesoro que nunca se desvanece. 🐶",
    "Las mascotas nos enseñan a amar sin condiciones. 🐱",
    "Un amigo peludo hace que cada momento sea especial. 🌟",
  ];

  const [currentQuote, setCurrentQuote] = useState('');

  // Seleccionar una frase aleatoria al cargar el componente
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  // Función para cambiar a una nueva frase
  const getNewQuote = () => {
    let newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    // Evitar que se repita la misma frase consecutivamente
    while (newQuote === currentQuote) {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setCurrentQuote(newQuote);
  };

  return (
    <section className="pet-quotes-section">
      <h2>Frase Inspiradora del Día</h2>
      <div className="quote-card">
        <p>{currentQuote}</p>
        <button onClick={getNewQuote} className="quote-btn">
          Nueva Frase
        </button>
      </div>
    </section>
  );
};

export default PetQuotes;