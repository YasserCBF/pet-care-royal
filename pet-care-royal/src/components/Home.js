import React, { useEffect, useState } from 'react';
import Header from './Header';
import BookingForm from './BookingForm';
import PetCard from './PetCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const staticServices = [
    {
      id: 'paseo',
      name: 'Paseo de Mascotas',
      description: 'Un paseo de 30 minutos lleno de diversión para tu amigo peludo.',
      price: 15,
      image: 'https://img.freepik.com/free-photo/portrait-adorable-beagle-walking-city_23-2151793685.jpg?t=st=1746408927~exp=1746412527~hmac=a1337bbf9ebdedcb9c44ef02171e26007756d4530ff9937b42a06cd38aa6b774&w=900',
      icon: '🐾',
      category: 'Paseo',
      details: 'Duración: 30 min. Incluye: Caminata en parque, interacción con otros perros, recogida de desechos. Beneficios: Ejercicio y socialización.',
    },
    {
      id: 'baño',
      name: 'Baño Completo',
      description: 'Limpieza profunda con productos premium para un pelaje brillante.',
      price: 25,
      image: 'https://img.freepik.com/free-photo/close-up-portrait-yorkshire-dog_23-2151779200.jpg?t=st=1746409000~exp=1746412600~hmac=5f296cef51549826899ad590bfb765ce0832e1d00e222fa84c21744426cef2db&w=740',
      icon: '🛁',
      category: 'Baño',
      details: 'Duración: 1 hora. Incluye: Lavado, secado, corte de uñas. Beneficios: Pelaje sano y libre de parásitos.',
    },
    {
      id: 'corte',
      name: 'Corte de Pelo',
      description: 'Estilizado profesional que resalta la belleza de tu mascota.',
      price: 20,
      image: 'https://img.freepik.com/free-photo/close-up-portrait-yorkshire-dog_23-2151779159.jpg?t=st=1746409101~exp=1746412701~hmac=955e50371e668df3aeb8f2ac5532a97dfa374b28b8f955d627c2d145de662250&w=900',
      icon: '✂️',
      category: 'Corte',
      details: 'Duración: 45 min. Incluye: Corte personalizado, cepillado. Beneficios: Estética y comodidad.',
    },
    {
      id: 'guarderia',
      name: 'Guardería Diurna',
      description: 'Cuidado todo el día con juegos y mimos personalizados.',
      price: 30,
      image: 'https://img.freepik.com/premium-photo/veterinary-team-with-pets_1025557-13021.jpg',
      icon: '🏡',
      category: 'Guardería',
      details: 'Duración: 8 horas. Incluye: Juegos, alimentación, descanso. Beneficios: Cuidado supervisado y diversión.',
    },
    {
      id: 'entrenamiento',
      name: 'Entrenamiento Básico',
      description: 'Sesiones personalizadas para obediencia y socialización de tu mascota.',
      price: 35,
      image: 'https://img.freepik.com/free-photo/two-dogs-outdoors-being-trained-by-male-coach_23-2149448214.jpg?ga=GA1.1.945411470.1746408805&semt=ais_hybrid&w=740',
      icon: '🎾',
      category: 'Entrenamiento',
      details: 'Duración: 1 hora por sesión. Incluye: Comandos básicos, socialización. Beneficios: Mejor comportamiento y vínculo.',
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
          icon: '🐕',
          category: doc.data().category || 'Otros',
          details: doc.data().details || 'Más información disponible bajo solicitud.',
        }));
        setServices([...staticServices, ...fetchedServices]);
      } catch (err) {
        setError(err.message || 'Error al cargar servicios adicionales');
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredServices(services);
    } else if (filter === 'price-low') {
      setFilteredServices([...services].sort((a, b) => a.price - b.price));
    } else {
      setFilteredServices(services.filter(service => service.category === filter));
    }
  }, [filter, services]);

  const closeDetails = () => setSelectedService(null);

  const scrollLeft = () => {
    const carousel = document.querySelector('.carousel-container');
    carousel.scrollBy({ left: -carousel.clientWidth / 3, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const carousel = document.querySelector('.carousel-container');
    carousel.scrollBy({ left: carousel.clientWidth / 3, behavior: 'smooth' });
  };

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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '10px', border: '2px solid var(--lavanda-claro)' }}
          >
            <option value="all">Todos</option>
            <option value="Paseo">Paseo</option>
            <option value="Baño">Baño</option>
            <option value="Corte">Corte</option>
            <option value="Guardería">Guardería</option>
            <option value="Entrenamiento">Entrenamiento</option>
            <option value="price-low">Precio: Bajo a Alto</option>
          </select>
        </div>
        <div style={{ position: 'relative', maxWidth: '100%', overflow: 'hidden' }}>
          <button
            onClick={scrollLeft}
            className="carousel-arrow carousel-arrow-left"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--oro-suave)',
              color: 'var(--gris-oscuro)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            &larr;
          </button>
          <div
            className="carousel-container"
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              gap: '25px',
              padding: '0 20px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--rosa-vibrante) var(--blanco-crema)',
            }}
          >
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`service-card ${selectedService && selectedService.id === service.id ? 'flipped' : ''}`}
                onClick={() => setSelectedService(selectedService && selectedService.id === service.id ? null : service)}
                style={{
                  flex: '0 0 calc(33.33% - 16.67px)',
                  minWidth: '280px',
                  scrollSnapAlign: 'center',
                }}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span className="icon" data-tooltip={service.category}>{service.icon}</span>
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
                        alignSelf: 'center',
                      }}
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/200x200/?pet';
                      }}
                    />
                    <h3 style={{ fontSize: '22px', marginBottom: '12px', textAlign: 'center' }}>{service.name}</h3>
                    <p className="description" style={{ flexGrow: 1, padding: '0 10px', textAlign: 'center' }}>{service.description}</p>
                  </div>
                  <div className="card-back">
                    <h3 style={{ fontSize: '24px', marginBottom: '15px', textAlign: 'center' }}>{service.name}</h3>
                    <p style={{ marginBottom: '10px', textAlign: 'center' }}>Precio: ${service.price}</p>
                    <p style={{ marginBottom: '15px', textAlign: 'center', padding: '0 10px' }}>{service.details}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); closeDetails(); }}
                      style={{
                        background: 'var(--oro-suave)',
                        color: 'var(--gris-oscuro)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="carousel-arrow carousel-arrow-right"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--oro-suave)',
              color: 'var(--gris-oscuro)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            &rarr;
          </button>
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
      <section id="reviews">
        <h2 style={{ color: 'var(--gris-oscuro)', textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Lo que dicen nuestros clientes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'var(--blanco-crema)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <p style={{ color: 'var(--gris-oscuro)', fontStyle: 'italic' }}>"¡El baño fue increíble! Mi perro quedó feliz."</p>
            <p style={{ color: 'var(--rosa-vibrante)', fontWeight: 'bold', marginTop: '10px' }}>- Ana G.</p>
          </div>
          <div style={{ background: 'var(--blanco-crema)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <p style={{ color: 'var(--gris-oscuro)', fontStyle: 'italic' }}>"El paseo fue perfecto, muy recomendado."</p>
            <p style={{ color: 'var(--rosa-vibrante)', fontWeight: 'bold', marginTop: '10px' }}>- Juan P.</p>
          </div>
        </div>
      </section>
      <section id="contact" style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--menta-suave)' }}>
        <h2 style={{ color: 'var(--gris-oscuro)', marginBottom: '20px', fontSize: '32px' }}>Contáctanos</h2>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'var(--oro-suave)',
            color: 'var(--gris-oscuro)',
            padding: '12px 24px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.background = 'var(--rosa-vibrante)'}
          onMouseOut={(e) => e.target.style.background = 'var(--oro-suave)'}
        >
          Escríbenos por WhatsApp
        </a>
      </section>
    </div>
  );
};

export default Home;