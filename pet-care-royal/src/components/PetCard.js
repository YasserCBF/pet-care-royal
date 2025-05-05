import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

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
    <div style={{ background: 'var(--blanco-crema)', padding: '40px 20px' }}>
      <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>
        Mis Mascotas - Pet Care Royal
      </h2>
      {error && (
        <p
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
        </p>
      )}
      {loading ? (
        <p
          style={{
            color: 'var(--gris-oscuro)',
            textAlign: 'center',
            fontSize: '16px',
          }}
        >
          Cargando mascotas...
        </p>
      ) : pets.length === 0 ? (
        <p
          style={{
            color: 'var(--gris-oscuro)',
            textAlign: 'center',
            fontSize: '16px',
          }}
        >
          No tienes mascotas registradas.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="pet-card"
              style={{
                background: 'var(--menta-suave)',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
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
              {pet.healthStatus && <p style={{ color: 'var(--gris-oscuro)', fontSize: '14px', margin: '5px 0' }}>Salud: {pet.healthStatus}</p>}
              <Link
                to={`/edit-pet/${pet.id}`}
                style={{
                  background: 'var(--oro-suave)',
                  color: 'var(--gris-oscuro)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  marginTop: '10px',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--rosa-vibrante)'}
                onMouseOut={(e) => e.target.style.background = 'var(--oro-suave)'}
              >
                Editar Mascota
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetCard;