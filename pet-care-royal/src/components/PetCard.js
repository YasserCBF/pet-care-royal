import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

const PetCard = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError('Por favor, inicia sesión para ver tus mascotas');
          return;
        }
        const q = query(collection(db, 'pets'), where('owner', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const petList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          image: doc.data().image || (
            doc.data().species === 'Perro'
              ? 'https://source.unsplash.com/200x200/?dog'
              : doc.data().species === 'Gato'
              ? 'https://source.unsplash.com/200x200/?cat'
              : 'https://source.unsplash.com/200x200/?pet'
          )
        }));
        setPets(petList);
        setError('');
      } catch (err) {
        setError(err.message || 'Error al cargar las mascotas');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ background: 'var(--blanco-crema)', padding: '40px 20px' }}
    >
      <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>
        Mis Mascotas - Pet Care Royal
      </h2>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'var(--coral-suave)',
            color: 'var(--gris-oscuro)',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto 20px',
          }}
        >
          {error}
        </motion.p>
      )}
      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: 'var(--gris-oscuro)',
            textAlign: 'center',
            fontSize: '16px',
          }}
        >
          Cargando mascotas...
        </motion.p>
      ) : pets.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: 'var(--gris-oscuro)',
            textAlign: 'center',
            fontSize: '16px',
          }}
        >
          No tienes mascotas registradas.
        </motion.p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * pets.indexOf(pet) }}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)' }}
              style={{
                background: 'var(--menta-suave)',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <img
                src={pet.image}
                alt={pet.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  border: '2px solid var(--lavanda-claro)',
                }}
                onError={(e) => {
                  e.target.src = 'https://source.unsplash.com/200x200/?pet';
                }}
              />
              <h3 style={{ color: 'var(--gris-oscuro)', fontSize: '20px', marginBottom: '10px' }}>{pet.name}</h3>
              <p style={{ color: 'var(--gris-oscuro)', fontSize: '14px', margin: '5px 0' }}>Especie: {pet.species || 'No especificado'}</p>
              {pet.breed && <p style={{ color: 'var(--gris-oscuro)', fontSize: '14px', margin: '5px 0' }}>Raza: {pet.breed}</p>}
              {pet.age && <p style={{ color: 'var(--gris-oscuro)', fontSize: '14px', margin: '5px 0' }}>Edad: {pet.age} años</p>}
              {pet.specialNeeds && <p style={{ color: 'var(--gris-oscuro)', fontSize: '14px', margin: '5px 0' }}>Necesidades: {pet.specialNeeds}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PetCard;