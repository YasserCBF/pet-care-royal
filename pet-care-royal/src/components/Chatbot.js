import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [petData, setPetData] = useState(null);
  const [conversationStep, setConversationStep] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      const greeting = currentUser
        ? `¡Hola, ${currentUser.email || currentUser.displayName}! Bienvenido a Pet Care Royal. ¿En qué te ayudo hoy? Elige una opción:
          1. Servicios
          2. Reservas
          3. Ubicación
          4. Contacto
          5. Cuidado de Mascotas`
        : `¡Hola! Bienvenido a Pet Care Royal. Inicia sesión para consejos de cuidado de mascotas. Elige una opción:
          1. Servicios
          2. Reservas
          3. Ubicación
          4. Contacto`;
      setMessages([{ sender: 'bot', text: greeting }]);
    });
    return () => unsubscribe();
  }, []);

  const normalizeText = (text) => {
    let normalized = text.toLowerCase().trim();
    const replacements = {
      'rrreserva': 'reserva',
      'rrreserba': 'reserva',
      'serbicio': 'servicio',
      'servico': 'servicio',
      'prego': 'precio',
      'presio': 'precio',
      'allenar': 'alimentar',
      'alimentasion': 'alimentación',
      'bañar': 'baño',
      'ezersicio': 'ejercicio',
      'ejersisio': 'ejercicio',
      'dónde': 'donde',
      'cuánto': 'cuanto',
      'cuesta': 'cuesta',
      'hacer': 'hacer',
      'dolraser': 'dólares',
    };
    Object.keys(replacements).forEach((wrong) => {
      if (normalized.includes(wrong)) {
        normalized = normalized.replace(new RegExp(wrong, 'g'), replacements[wrong]);
      }
    });
    return normalized;
  };

  const calculateFoodAmount = (weight, age, size, activityLevel, healthIssues, foodType) => {
    let dailyAmount = 0;
    const ageInMonths = age.includes('mes') ? parseInt(age) : age.includes('año') ? parseInt(age) * 12 : parseInt(age) / 30;
    const weightKg = parseFloat(weight);

    if (size === 'pequeño') dailyAmount = weightKg * 40;
    else if (size === 'mediano') dailyAmount = weightKg * 30;
    else if (size === 'grande') dailyAmount = weightKg * 25;

    if (ageInMonths < 6) dailyAmount *= 1.5;
    else if (ageInMonths > 84) dailyAmount *= 0.8;

    if (activityLevel === 'alto') dailyAmount *= 1.2;
    else if (activityLevel === 'bajo') dailyAmount *= 0.8;

    if (healthIssues === 'sí') dailyAmount *= 0.9;

    if (foodType === 'húmeda') dailyAmount *= 3;

    return Math.round(dailyAmount);
  };

  const generateResponse = (input) => {
    const normalizedInput = normalizeText(input);
    const keywords = normalizedInput.split(/\s+/);

    let intent = null;
    if (keywords.some(k => ['servicio', 'servicios', 'ofrecen'].includes(k))) intent = 'servicios';
    else if (keywords.some(k => ['reserva', 'reservar', 'cómo'].includes(k))) intent = 'reservas';
    else if (keywords.some(k => ['donde', 'ubicación', 'están'].includes(k))) intent = 'ubicación';
    else if (keywords.some(k => ['contacto', 'contactar', 'whatsapp'].includes(k))) intent = 'contacto';
    else if (user && keywords.some(k => ['cuidado', 'alimentar', 'baño', 'ejercicio', 'higiene', 'salud', 'entrenamiento', 'comportamiento'].includes(k))) intent = 'cuidado';

    if (!intent && !/^\d+\.?.*$/.test(normalizedInput)) {
      setConversationStep(null);
      return `No te entendí. Por favor, elige una opción o escribe un número:
        1. Servicios
        2. Reservas
        3. Ubicación
        4. Contacto
        ${user ? '5. Cuidado de Mascotas' : 'Inicia sesión para consejos de cuidado'}`;
    }

    const selection = parseInt(normalizedInput.match(/^\d+/)?.[0]);
    if (selection) {
      switch (selection) {
        case 1:
          intent = 'servicios';
          break;
        case 2:
          intent = 'reservas';
          break;
        case 3:
          intent = 'ubicación';
          break;
        case 4:
          intent = 'contacto';
          break;
        case 5:
          if (user) intent = 'cuidado';
          else return 'Inicia sesión para acceder a consejos de cuidado. Elige otra opción:\n1. Servicios\n2. Reservas\n3. Ubicación\n4. Contacto';
          break;
        default:
          return `Opción no válida. Elige entre:
            1. Servicios
            2. Reservas
            3. Ubicación
            4. Contacto
            ${user ? '5. Cuidado de Mascotas' : ''}`;
      }
    }

    switch (intent) {
      case 'servicios':
        setConversationStep(null);
        return `1. Servicios
          1.1 Paseo - 15 dólares
          1.2 Baño - 25 dólares
          1.3 Corte - 20 dólares
          1.4 Guardería - 30 dólares
          1.5 Entrenamiento - 35 dólares
          Escribe el número de un servicio para más detalles o elige otra opción: 1-5`;

      case 'reservas':
        setConversationStep(null);
        return `1. Reservas
          1.1 Ve a "Reservar un Servicio"
          1.2 Completa el formulario
          1.3 Te contactaremos para confirmar
          ¿Necesitas ayuda con el formulario? Escribe 1 para sí, o elige otra opción: 1-5`;

      case 'ubicación':
        setConversationStep(null);
        return `1. Ubicación
          1.1 Estamos en San Francisco, CA
          1.2 Consulta el mapa en "Ubicación"
          ¿Quieres más detalles? Escribe 1 para sí, o elige otra opción: 1-5`;

      case 'contacto':
        setConversationStep(null);
        return `1. Contacto
          1.1 WhatsApp: https://wa.me/1234567890
          1.2 ¡Estamos aquí para ayudarte!
          ¿Te ayudo con algo más? Escribe 1 para sí, o elige otra opción: 1-5`;

      case 'cuidado':
        if (keywords.some(k => ['alimentar', 'alimentación', 'comida'].includes(k))) {
          if (!petData) {
            setConversationStep('collectingPetData');
            return `1. Cuidado - Alimentación
              1.1 Por favor, dime:
                1.1.1 Peso de tu perro (en kg)
                1.1.2 Edad (en meses, años o días)
                1.1.3 Raza
                1.1.4 Tamaño (pequeño, mediano, grande)
                1.1.5 Nivel de actividad (alto, medio, bajo)
                1.1.6 ¿Tiene problemas de salud? (sí/no)
                1.1.7 Tipo de comida preferida (seca/húmeda)
              1.2 Escribe la información en un solo mensaje (ejemplo: 10 kg, 2 años, Labrador, mediano, alto, no, seca)`;
          }
          if (petData && conversationStep === 'collectingPetData') {
            setConversationStep(null);
            const { weight, age, breed, size, activityLevel, healthIssues, foodType } = petData;
            const dailyAmount = calculateFoodAmount(weight, age, size, activityLevel, healthIssues, foodType);
            return `1. Cuidado - Alimentación
              1.1 Para tu perro (${breed}, ${size}, ${weight} kg, ${age}, actividad ${activityLevel}, salud: ${healthIssues}, comida ${foodType}):
                1.1.1 Cantidad diaria recomendada: ${dailyAmount} ${foodType === 'húmeda' ? 'gramos (equivalente a unas 2-3 latas pequeñas)' : 'gramos'} de comida ${foodType}
                1.1.2 Divide en 2-3 comidas al día
                1.1.3 Considera ajustar según su apetito y energía
              1.2 Si quieres más detalles, te recomendamos llevarlo a nuestro centro de atención
              1.3 ¿Más ayuda? Escribe 1 para sí, o elige otra opción: 1-5`;
          }
        }
        const petType = keywords.find(k => ['perro', 'gato'].includes(k)) || 'mascota';
        if (keywords.some(k => ['baño', 'bañar'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Baño
            1.1 Báñalo cada 4-6 semanas con shampoo para animales
            1.2 Usa agua tibia y enjuaga bien
            1.3 ¿Tips de secado? Escribe 1 para sí`;
        }
        if (keywords.some(k => ['ejercicio', 'jugar'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Ejercicio
            1.1 ${petType === 'perro' ? 'Perro: 30 minutos diarios' : 'Gato: 15-20 minutos diarios'}
            1.2 Paseos o juegos
            1.3 ¿Más consejos? Escribe 1 para sí`;
        }
        if (keywords.some(k => ['higiene', 'cepillar'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Higiene
            1.1 Cepíllalo regularmente
            1.2 Limpia oídos y corta uñas mensualmente
            1.3 ¿Más detalles? Escribe 1 para sí`;
        }
        if (keywords.some(k => ['salud', 'veterinario'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Salud
            1.1 Visita al veterinario anual
            1.2 Vacunas y desparasitación al día
            1.3 ¿Preocupación específica? Escribe 1 para sí`;
        }
        if (keywords.some(k => ['entrenamiento', 'entrenar'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Entrenamiento
            1.1 Usa refuerzo positivo con premios
            1.2 Comienza con órdenes básicas como "sentado" o "quieto"
            1.3 Sé paciente y constante
            1.4 Si quieres más detalles, te recomendamos llevarlo a nuestro centro de atención
            1.5 ¿Más ayuda? Escribe 1 para sí`;
        }
        if (keywords.some(k => ['comportamiento', 'portarse'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Comportamiento
            1.1 Identifica la causa (estrés, aburrimiento, etc.)
            1.2 Mantén una rutina estable
            1.3 Evita castigos; usa refuerzo positivo
            1.4 Si quieres más detalles, te recomendamos llevarlo a nuestro centro de atención
            1.5 ¿Más ayuda? Escribe 1 para sí`;
        }
        setConversationStep(null);
        return `1. Cuidado de Mascotas
          1.1 Elige un tema: alimentación, baño, ejercicio, higiene, salud, entrenamiento o comportamiento
          1.2 Escribe el tema o elige otra opción: 1-5`;
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { sender: 'user', text: userInput }]);

    if (conversationStep === 'collectingPetData' && userInput.match(/^\d+\.?\d*\s*(kg|kgs?)?,\s*\d+\s*(meses?|años?|días?),\s*[a-zA-Z]+,\s*(pequeño|mediano|grande),\s*(alto|medio|bajo),\s*(sí|si|no),\s*(seca|húmeda)$/i)) {
      const [weight, age, breed, size, activityLevel, healthIssues, foodType] = userInput.split(',').map(s => s.trim());
      setPetData({
        weight: weight.replace(/kg|kgs?/i, '').trim(),
        age,
        breed,
        size,
        activityLevel,
        healthIssues: healthIssues === 'sí' || healthIssues === 'si' ? 'sí' : 'no',
        foodType
      });
    }

    const botResponse = generateResponse(userInput);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 500);

    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
        >
          🐾 Chat
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Pet Care Assistant</h3>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: '2px 0' }}>{line}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un número o mensaje..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;