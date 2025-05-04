import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        const [petsResponse, servicesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/pets', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/services'),
        ]);
        setPets(petsResponse.data);
        setServices(servicesResponse.data);
      } catch (err) {
        setError(err.response?.data.message || 'Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        {
          pet: selectedPet,
          service: selectedService,
          date,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuccess('Reserva creada con éxito');
      setError('');
      setSelectedPet('');
      setSelectedService('');
      setDate('');
    } catch (err) {
      setError(err.response?.data.message || 'Error al crear reserva');
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
              <option key={pet._id} value={pet._id}>{pet.name}</option>
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
              <option key={service._id} value={service._id}>{service.name} (${service.price})</option>
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
//creo que vy hacer dos archivos para evitar mas demoras :3 PD: no me di cuenta que son 116 lineas de codigo 