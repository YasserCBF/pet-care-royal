import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PetCard = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPets(response.data);
      } catch (err) {
        setError(err.response?.data.message || 'Error al cargar mascotas');
      }
    };
    fetchPets();
  }, []);

  return (
    <div style={{ background: 'var(--blanco-crema)', padding: '20px' }}>
      <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center' }}>Mis Mascotas</h2>
      {error && <p style={{ background: 'var(--melocoton-suave)', color: 'var(--gris-oscuro)', padding: '10px', borderRadius: '5px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {pets.map((pet) => (
          <div
            key={pet._id}
            style={{
              background: 'var(--menta-suave)',
              borderRadius: '10px',
              padding: '20px',
              width: '200px',
              boxShadow: '0 4px 10px rgba(232, 236, 239, 0.2)',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <h3 style={{ color: 'var(--gris-oscuro)', margin: '0 0 10px' }}>{pet.name}</h3>
            <p style={{ color: 'var(--gris-oscuro)', margin: '5px 0' }}>Especie: {pet.species}</p>
            {pet.breed && <p style={{ color: 'var(--gris-oscuro)', margin: '5px 0' }}>Raza: {pet.breed}</p>}
            {pet.age && <p style={{ color: 'var(--gris-oscuro)', margin: '5px 0' }}>Edad: {pet.age} años</p>}
            {pet.specialNeeds && <p style={{ color: 'var(--gris-oscuro)', margin: '5px 0' }}>Necesidades: {pet.specialNeeds}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
//me acaba de morde un cucaracha XD
export default PetCard;


