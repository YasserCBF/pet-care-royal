import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Opcional: para personalización con usuario

const DailyTip = () => {
  const [dailyTip, setDailyTip] = useState('');
  const [user, setUser] = useState(null);

  // Lista de consejos diarios (uno por cada día de la semana)
  const tips = [
    "Lunes: Dale a tu mascota un baño relajante con agua tibia y un shampoo suave para mantener su pelaje brillante. 🛁",
    "Martes: Dedica 15 minutos a un juego activo con tu mascota para mantenerla en forma y feliz. 🏃‍♂️",
    "Miércoles: Revisa las orejas de tu mascota y límpialas con cuidado para evitar infecciones. 🐾",
    "Jueves: Prueba una nueva receta casera para tu mascota, como galletas de avena y manzana. 🍎",
    "Viernes: Lleva a tu mascota a un paseo largo por un parque para que explore nuevos olores. 🌳",
    "Sábado: Cepilla el pelaje de tu mascota para evitar nudos y fortalecer el vínculo con ella. 🖌️",
    "Domingo: Programa una visita al veterinario para un chequeo general y mantener a tu mascota saludable. 🩺",
  ];

  useEffect(() => {
    // Obtener el día actual (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const today = new Date().getDay();
    setDailyTip(tips[today]);

    // Opcional: Escuchar cambios en el estado de autenticación
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="daily-tip-section">
      <h2>Consejo del Día</h2>
      <div className="daily-tip-card">
        <p>{user ? `${user.displayName || user.email}, ${dailyTip}` : dailyTip}</p>
      </div>
    </section>
  );
};

export default DailyTip;