import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PetCard = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No autenticado');
        const q = query(collection(db, 'pets'), where('owner', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const petList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPets(petList);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPets();
  }, []);

  return (
    <div style={{ background: 'var(--blanco-crema)', padding: '20px' }}>
      <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center' }}>Mis Mascotas - Pet Care Royal</h2>
      {error && <p style={{ background: 'var(--melocoton-suave)', color: 'var(--gris-oscuro)', padding: '10px', borderRadius: '5px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {pets.map((pet) => (
          <div
            key={pet.id}
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

export default PetCard;