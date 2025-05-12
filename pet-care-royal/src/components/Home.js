import React, { useEffect, useState } from 'react';
import Header from './Header';
import Chatbot from './Chatbot';
import DailyTip from './DailyTip';
import PetQuotes from './PetQuotes';
import BookingForm from './BookingForm';
import PetCard from './PetCard';

const Home = () => {
  const [services, setServices] = useState([]);
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
    // Usar solo los servicios estáticos para evitar consultas a la base de datos
    setServices(staticServices);
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

  // Estado para controlar las FAQs
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: '¿Cómo hago una reserva?',
      answer: 'Puedes reservar fácilmente a través de nuestro formulario de reservas. Solo completa tus datos y envía la solicitud. Te contactaremos pronto para confirmar.',
    },
    {
      question: '¿Cuáles son los métodos de pago?',
      answer: 'Aceptamos pagos con tarjeta de crédito, débito y transferencias bancarias. Los detalles se proporcionarán al confirmar tu reserva.',
    },
    {
      question: '¿Puedo cancelar mi reserva?',
      answer: 'Sí, puedes cancelar con hasta 24 horas de antelación sin costo. Contáctanos a través del WhatsApp para procesarlo.',
    },
  ];

  return (
    <div className="home-container">
      <Header />
      <section id="services" className="section">
        <h2>Nuestros Servicios</h2>
        <div className="filter-container">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
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
        <div className="carousel-wrapper">
          <button
            onClick={scrollLeft}
            className="carousel-arrow carousel-arrow-left"
            aria-label="Deslizar a la izquierda"
          >
            ←
          </button>
          <div className="carousel-container">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`service-card ${selectedService && selectedService.id === service.id ? 'flipped' : ''}`}
                onClick={() => setSelectedService(selectedService && selectedService.id === service.id ? null : service)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span className="icon" data-tooltip={service.category}>{service.icon}</span>
                    <img
                      src={service.image}
                      alt={service.name}
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/200x200/?pet';
                      }}
                    />
                    <h3>{service.name}</h3>
                    <p className="description">{service.description}</p>
                  </div>
                  <div className="card-back">
                    <h3>{service.name}</h3>
                    <p>Precio: ${service.price}</p>
                    <p>{service.details}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); closeDetails(); }}
                      className="close-btn"
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
            aria-label="Deslizar a la derecha"
          >
            →
          </button>
        </div>
      </section>
      <DailyTip />
      <PetQuotes />
      <section id="about" className="section">
        <h2>Sobre Nosotros</h2>
        <p>
          En Pet Care Royal, cuidamos a tus mascotas con amor y profesionalismo. Somos una empresa dedicada a ofrecer servicios de alta calidad, desde paseos hasta baños, asegurando la felicidad y bienestar de tus compañeros peludos.
        </p>
      </section>
      <section id="location" className="section">
        <h2>Nuestra Ubicación</h2>
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
      <section id="bookings" className="section">
        <h2>Reservar un Servicio</h2>
        <BookingForm />
      </section>
      
      <section id="reviews" className="section">
        <h2>Lo que Dicen Nuestros Clientes</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p className="review-text">"¡El baño fue increíble! Mi perro quedó feliz."</p>
            <p className="review-author">- Ana G.</p>
          </div>
          <div className="review-card">
            <p className="review-text">"El paseo fue perfecto, muy recomendado."</p>
            <p className="review-author">- Juan P.</p>
          </div>
        </div>
      </section>
      <section id="contact" className="section contact-section">
        <h2>Contáctanos</h2>
        <a
          href="https://wa.me/913852768"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          Escríbenos por WhatsApp
        </a>
      </section>
      <section id="faq" className="section faq-section">
        <h2>Preguntas Frecuentes</h2>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeFaq === index ? 'active' : ''}`}
            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-toggle">+</span>
            </div>
            <div className="faq-answer">
              {faq.answer}
            </div>
          </div>
        ))}
      </section>
      <Chatbot />
    </div>
  );
};

export default Home;