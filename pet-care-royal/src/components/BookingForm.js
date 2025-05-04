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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No autenticado');
        const petsQuery = query(collection(db, 'pets'), where('owner', '==', user.uid));
        const servicesQuery = collection(db, 'services');
        const [petsSnapshot, servicesSnapshot] = await Promise.all([
          getDocs(petsQuery),
          getDocs(servicesQuery),
        ]);
        setPets(petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No autenticado');
      await addDoc(collection(db, 'bookings'), {
        pet: selectedPet,
        service: selectedService,
        date: new Date(date),
        status: 'pending',
        client: user.uid,
      });
      setSuccess('Reserva creada con éxito');
      setError('');
      setSelectedPet('');
      setSelectedService('');
      setDate('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div style={{ background: 'var(--blanco-crema)', padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: 'var(--blanco-crema)', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(232, 236, 239, 0.2)', width: '400px' }}
      >
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center' }}>Crear Reserva - Pet Care Royal</h2>
        {error && <p style={{ background: 'var(--melocoton-suave)', color: 'var(--gris-oscuro)', padding: '10px', borderRadius: '5px' }}>{error}</p>}
        {success && <p style={{ background: 'var(--menta-suave)', color: 'var(--gris-oscuro)', padding: '10px', borderRadius: '5px' }}>{success}</p>}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gris-oscuro)' }}>Mascota</label>
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            style={{ background: 'var(--gris-perla)', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', color: 'var(--gris-oscuro)' }}
            required
          >
            <option value="">Selecciona una mascota</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gris-oscuro)' }}>Servicio</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            style={{ background: 'var(--gris-perla)', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', color: 'var(--gris-oscuro)' }}
            required
          >
            <option value="">Selecciona un servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name} (${service.price})</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'var(--gris-oscuro)' }}>Fecha y Hora</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ background: 'var(--gris-perla)', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', color: 'var(--gris-oscuro)' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ background: 'var(--oro-suave)', color: 'var(--gris-oscuro)', padding: '12px 24px', borderRadius: '5px', border: 'none', cursor: 'pointer', width: '100%' }}
          onMouseOver={(e) => (e.target.style.background = 'var(--azul-cielo)')}
          onMouseOut={(e) => (e.target.style.background = 'var(--oro-suave)')}
        >
          Reservar
        </button>
      </form>
    </div>
  );
};

export default BookingForm;