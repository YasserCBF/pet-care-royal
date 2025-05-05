import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from 'firebase/firestore';

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
  const [petDetails, setPetDetails] = useState(null);
  const [bookings, setBookings] = useState([]);

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
        const bookingsQuery = query(collection(db, 'bookings'), where('client', '==', user.uid));
        const [petsSnapshot, servicesSnapshot, bookingsSnapshot] = await Promise.all([
          getDocs(petsQuery),
          getDocs(servicesQuery),
          getDocs(bookingsQuery),
        ]);
        setPets(petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setError('');
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      const pet = pets.find(p => p.id === selectedPet);
      setPetDetails(pet ? { name: pet.name, breed: pet.breed, age: pet.age } : null);
    } else {
      setPetDetails(null);
    }
  }, [selectedPet, pets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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
      setPetDetails(null);
    } catch (err) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'cancelled' });
      setSuccess('Reserva cancelada con éxito');
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      setError(err.message || 'Error al cancelar la reserva');
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
              {petDetails && (
                <p className="form-hint">
                  Detalles: {petDetails.name} - {petDetails.breed || 'Raza no especificada'}, {petDetails.age || 'Edad no especificada'} años
                </p>
              )}
            </div>
            <div className="form-group">
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
            {bookings.length > 0 && (
              <div className="mt-4">
                <h3 className="form-title text-lg">Tus Reservas</h3>
                {bookings.map((booking) => (
                  <div key={booking.id} className="form-group mb-2">
                    <p>
                      Mascota: {pets.find(p => p.id === booking.pet)?.name || 'Desconocida'} | Servicio: {services.find(s => s.id === booking.service)?.name || 'Desconocido'} | Fecha: {new Date(booking.date).toLocaleString()} | Estado: {booking.status}
                    </p>
                    {booking.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="form-button mt-2 py-1 px-2 text-sm"
                        disabled={loading}
                      >
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default BookingForm;