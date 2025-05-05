import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

const BookingForm = () => {
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError('Por favor, inicia sesión para crear una reserva');
          return;
        }
        const petsQuery = query(collection(db, 'pets'), where('owner', '==', user.uid));
        const servicesQuery = collection(db, 'services');
        const [petsSnapshot, servicesSnapshot] = await Promise.all([
          getDocs(petsQuery),
          getDocs(servicesQuery),
        ]);
        setPets(petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setError('');
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No autenticado');
      await addDoc(collection(db, 'bookings'), {
        pet: selectedPet,
        service: selectedService,
        date: new Date(date),
        status: 'pending',
        client: user.uid,
        createdAt: new Date(),
      });
      setSuccess('Reserva creada con éxito');
      setSelectedPet('');
      setSelectedService('');
      setDate('');
    } catch (err) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--azul-cielo), var(--menta-suave))',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="form-container"
        style={{
          background: 'var(--blanco-crema)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>
          Crear Reserva - Pet Care Royal
        </h2>
        {error && (
          <p
            style={{
              background: 'var(--coral-suave)',
              color: 'var(--gris-oscuro)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}
        {success && (
          <p
            style={{
              background: 'var(--menta-suave)',
              color: 'var(--gris-oscuro)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {success}
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
            Cargando datos...
          </p>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--gris-oscuro)', fontWeight: '400', display: 'block', marginBottom: '5px' }}>
                Mascota
              </label>
              <select
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                style={{
                  background: 'var(--gris-perla)',
                  border: '1px solid var(--lavanda-claro)',
                  padding: '12px',
                  borderRadius: '8px',
                  width: '100%',
                  color: 'var(--gris-oscuro)',
                  fontSize: '16px',
                }}
                required
                disabled={loading || pets.length === 0}
              >
                <option value="">Selecciona una mascota</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
              {pets.length === 0 && (
                <p style={{ color: 'var(--coral-suave)', fontSize: '12px', marginTop: '5px' }}>
                  No hay mascotas registradas.
                </p>
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--gris-oscuro)', fontWeight: '400', display: 'block', marginBottom: '5px' }}>
                Servicio
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                  background: 'var(--gris-perla)',
                  border: '1px solid var(--lavanda-claro)',
                  padding: '12px',
                  borderRadius: '8px',
                  width: '100%',
                  color: 'var(--gris-oscuro)',
                  fontSize: '16px',
                }}
                required
                disabled={loading || services.length === 0}
              >
                <option value="">Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} (${service.price || 'N/A'})
                  </option>
                ))}
              </select>
              {services.length === 0 && (
                <p style={{ color: 'var(--coral-suave)', fontSize: '12px', marginTop: '5px' }}>
                  No hay servicios disponibles.
                </p>
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--gris-oscuro)', fontWeight: '400', display: 'block', marginBottom: '5px' }}>
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  background: 'var(--gris-perla)',
                  border: '1px solid var(--lavanda-claro)',
                  padding: '12px',
                  borderRadius: '8px',
                  width: '100%',
                  color: 'var(--gris-oscuro)',
                  fontSize: '16px',
                }}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(90deg, var(--oro-suave), var(--melocoton-suave))',
                color: 'var(--gris-oscuro)',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                fontSize: '16px',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Reservar'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default BookingForm;