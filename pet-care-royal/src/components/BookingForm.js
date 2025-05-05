import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

const BookingForm = () => {
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
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

    // Validar fecha futura
    const selectedDate = new Date(date);
    const now = new Date();
    if (selectedDate <= now) {
      setError('Por favor, selecciona una fecha y hora futura');
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No autenticado');
      await addDoc(collection(db, 'bookings'), {
        pet: selectedPet,
        service: selectedService,
        date: selectedDate,
        notes: notes.trim() || 'Sin notas',
        status: 'pending',
        client: user.uid,
        createdAt: new Date(),
      });
      setSuccess('¡Reserva creada con éxito!');
      setSelectedPet('');
      setSelectedService('');
      setDate('');
      setNotes('');
    } catch (err) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-section">
      <form onSubmit={handleSubmit} className="booking-form form-container">
        <h2 className="form-title">Reservar un Servicio</h2>
        {error && (
          <p className="form-message form-message--error">
            {error}
          </p>
        )}
        {success && (
          <p className="form-message form-message--success">
            {success}
          </p>
        )}
        {loading ? (
          <div className="form-loading">
            <span className="spinner"></span>
            Cargando datos...
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="pet">
                Mascota
              </label>
              <select
                id="pet"
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="form-input"
                required
                disabled={loading || pets.length === 0}
              >
                <option value="">Selecciona una mascota</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
              {pets.length === 0 && (
                <p className="form-hint">
                  No hay mascotas registradas.
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="service">
                Servicio
              </label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="form-input"
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
                <p className="form-hint">
                  No hay servicios disponibles.
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="date">
                Fecha y Hora
              </label>
              <input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="notes">
                Notas Adicionales (Opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input form-textarea"
                rows="4"
                placeholder="Ej. 'Mi perro necesita un champú hipoalergénico'"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="form-button"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                'Reservar Ahora'
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default BookingForm;