import React, { useEffect, useState } from 'react';
import Header from './Header';
import BookingForm from './BookingForm';
import PetCard from './PetCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  // Servicios estáticos con imágenes específicas y emojis para iconos
  const staticServices = [
    {
      id: 'paseo',
      name: 'Paseo de Mascotas',
      description: 'Un paseo de 30 minutos lleno de diversión para tu amigo peludo.',
      price: 15,
      image: 'https://img.freepik.com/free-photo/portrait-adorable-beagle-walking-city_23-2151793685.jpg?t=st=1746408927~exp=1746412527~hmac=a1337bbf9ebdedcb9c44ef02171e26007756d4530ff9937b42a06cd38aa6b774&w=900',
      icon: '🐾',
    },
    {
      id: 'baño',
      name: 'Baño Completo',
      description: 'Limpieza profunda con productos premium para un pelaje brillante.',
      price: 25,
      image: 'https://img.freepik.com/free-photo/close-up-portrait-yorkshire-dog_23-2151779200.jpg?t=st=1746409000~exp=1746412600~hmac=5f296cef51549826899ad590bfb765ce0832e1d00e222fa84c21744426cef2db&w=740',
      icon: '🛁',
    },
    {
      id: 'corte',
      name: 'Corte de Pelo',
      description: 'Estilizado profesional que resalta la belleza de tu mascota.',
      price: 20,
      image: 'https://img.freepik.com/free-photo/close-up-portrait-yorkshire-dog_23-2151779159.jpg?t=st=1746409101~exp=1746412701~hmac=955e50371e668df3aeb8f2ac5532a97dfa374b28b8f955d627c2d145de662250&w=900',
      icon: '✂️',
    },
    {
      id: 'guarderia',
      name: 'Guardería Diurna',
      description: 'Cuidado todo el día con juegos y mimos personalizados.',
      price: 30,
      image: 'https://img.freepik.com/premium-photo/veterinary-team-with-pets_1025557-13021.jpg',
      icon: '🏡',
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesQuery = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesQuery);
        const fetchedServices = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          icon: '🐕', // Ícono por defecto para servicios de Firestore
        }));
        setServices([...staticServices, ...fetchedServices]);
      } catch (err) {
        setError(err.message || 'Error al cargar servicios adicionales');
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      <Header />
      <section id="services">
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Nuestros Servicios
        </h2>
        {error && (
          <p
            style={{
              background: 'var(--coral-suave)',
              color: 'var(--gris-oscuro)',
              padding: '12px',
              borderRadius: '10px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto 30px',
            }}
          >
            {error}
          </p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card"
              style={{
                position: 'relative',
              }}
            >
              <span className="icon">{service.icon}</span>
              <img
                src={service.image}
                alt={service.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  marginBottom: '20px',
                  border: '3px solid var(--lavanda-claro)',
                }}
                onError={(e) => {
                  e.target.src = 'https://source.unsplash.com/200x200/?pet';
                }}
              />
              <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>{service.name}</h3>
              <p className="description">{service.description}</p>
              <p className="price">${service.price}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="about">
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Sobre Nosotros
        </h2>
        <p
          style={{
            color: 'var(--gris-oscuro)',
            fontSize: '16px',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          En Pet Care Royal, cuidamos a tus mascotas con amor y profesionalismo. Somos una empresa dedicada a ofrecer servicios de alta calidad, desde paseos hasta baños, asegurando la felicidad y bienestar de tus compañeros peludos.
        </p>
      </section>
      <section id="location">
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Nuestra Ubicación
        </h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019149183367!2d-122.4194156846813!3d37.77492977975966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e5b8b3b9b%3A0x9c5c6d6e6f6e6f6e!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1698765432109!5m2!1sen!2sus"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
      <section id="bookings">
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Reservar un Servicio
        </h2>
        <BookingForm />
      </section>
      <section id="pets">
        <PetCard />
      </section>
    </div>
  );
};

export default Home;