import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

// Base de datos estática para Pet Care Royal
const petCareData = {
  servicios: [
    { id: '1.1', nombre: 'Paseo', precio: 15, descripcion: 'Un paseo relajante de 30 minutos para tu mascota.' },
    { id: '1.2', nombre: 'Baño', precio: 25, descripcion: 'Baño completo con shampoo especial para mascotas.' },
    { id: '1.3', nombre: 'Corte', precio: 20, descripcion: 'Corte de pelo profesional adaptado al tipo de pelaje.' },
    { id: '1.4', nombre: 'Guardería', precio: 30, descripcion: 'Cuidado diario con actividades y supervisión.' },
    { id: '1.5', nombre: 'Entrenamiento', precio: 35, descripcion: 'Sesiones de entrenamiento con refuerzo positivo.' },
  ],
  reservas: [
    'Ve a "Reservar un Servicio"',
    'Completa el formulario',
    'Te contactaremos para confirmar',
  ],
  ubicacion: {
    direccion: 'San Francisco, CA',
    mapa: 'Consulta el mapa en "Ubicación"',
  },
  contacto: {
    whatsapp: 'https://wa.me/1234567890',
    mensaje: '¡Estamos aquí para ayudarte!',
  },
  cuidado: {
    alimentacion: {
      consejos: 'Divide en 2-3 comidas al día. Ajusta según su apetito y energía.',
      seguimiento: 'Si quieres más detalles, te recomendamos llevarlo a nuestro centro de atención.',
    },
    baño: [
      'Báñalo cada 4-6 semanas con shampoo especial para animales.',
      'Usa agua tibia y asegúrate de enjuagar bien para evitar irritaciones.',
      'Sécalo con una toalla suave y, si es necesario, usa un secador a baja temperatura.',
    ],
    ejercicio: {
      perro: {
        pequeño: [
          '15-20 minutos de paseo ligero dos veces al día.',
          'Juegos cortos en casa, como buscar juguetes (10-15 minutos).',
          'Evita ejercicios intensos; los perros pequeños se cansan rápido.',
        ],
        mediano: [
          '30 minutos de paseo a ritmo moderado dos veces al día.',
          'Juegos como lanzar una pelota (15-20 minutos).',
          'Incluye 5-10 minutos de entrenamiento básico (sentado, quieto).',
        ],
        grande: [
          '45 minutos de paseo a ritmo rápido o trote, dos veces al día.',
          'Actividades como correr o buscar objetos (20-30 minutos).',
          'Añade caminatas en terrenos variados para estimularlo (1 vez por semana).',
        ],
      },
      gato: [
        '10-15 minutos de juego con juguetes interactivos (plumas, pelotas).',
        'Coloca un rascador o estructura para trepar y que se estire.',
        'Esconde premios para estimular su instinto de caza (5-10 minutos).',
      ],
    },
    higiene: [
      'Cepíllalo 2-3 veces por semana para evitar enredos y reducir la caída de pelo.',
      'Limpia sus oídos con una solución veterinaria una vez al mes.',
      'Corta sus uñas cada 3-4 semanas o cuando escuches que "golpean" el suelo.',
    ],
    salud: [
      'Llévalo al veterinario al menos una vez al año para chequeos generales.',
      'Mantén sus vacunas y desparasitaciones al día (consulta con tu vet).',
      'Observa su comportamiento: cambios en apetito, energía o ánimo pueden indicar problemas.',
      'Proporciónale agua fresca siempre y una dieta equilibrada.',
      'Cepilla sus dientes 2-3 veces por semana con pasta dental para mascotas.',
    ],
    entrenamiento: [
      'Usa refuerzo positivo: premia con golosinas o caricias cuando obedezca.',
      'Comienza con órdenes básicas como "sentado", "quieto" o "ven" (5-10 minutos diarios).',
      'Sé paciente y constante; repite las sesiones todos los días.',
    ],
    comportamiento: [
      'Identifica la causa de su comportamiento (estrés, aburrimiento, falta de ejercicio).',
      'Mantén una rutina estable para darle seguridad (horarios de comida, paseos).',
      'Evita castigos; usa refuerzo positivo para corregir conductas.',
    ],
  },
};

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
    // Convertir a minúsculas, eliminar tildes y caracteres especiales
    let normalized = text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
      .replace(/[^a-z0-9\s]/g, '') // Elimina signos de puntuación
      .replace(/\s+/g, ' '); // Normaliza espacios

    // Diccionario de reemplazos para errores comunes (ampliado)
    const replacements = {
      'rrreserva': 'reserva',
      'rrreserba': 'reserva',
      'rezerva': 'reserva',
      'reservarion': 'reserva',
      'reserba': 'reserva',
      'rezervacion': 'reserva',
      'serbicio': 'servicio',
      'servico': 'servicio',
      'sirvicio': 'servicio',
      'servisios': 'servicio',
      'servizios': 'servicio',
      'serbisios': 'servicio',
      'prego': 'precio',
      'presio': 'precio',
      'precios': 'precio',
      'presios': 'precio',
      'allenar': 'alimentar',
      'alimentasion': 'alimentacion',
      'alimentarion': 'alimentacion',
      'alimentasion': 'alimentacion',
      'comid': 'comida',
      'komida': 'comida',
      'bañar': 'baño',
      'banio': 'baño',
      'bano': 'baño',
      'bañio': 'baño',
      'ezersicio': 'ejercicio',
      'ejersisio': 'ejercicio',
      'ejersicio': 'ejercicio',
      'ejercisio': 'ejercicio',
      'ejersizio': 'ejercicio',
      'ejercizio': 'ejercicio',
      'exersisio': 'ejercicio',
      'rutina': 'ejercicio',
      'rutin': 'ejercicio',
      'higiene': 'higiene',
      'hijiene': 'higiene',
      'higien': 'higiene',
      'salud': 'salud',
      'salu': 'salud',
      'sanu': 'salud',
      'saludable': 'salud',
      'sano': 'salud',
      'bienestar': 'salud',
      'entrenamiento': 'entrenamiento',
      'entrenar': 'entrenamiento',
      'entrenamieto': 'entrenamiento',
      'entrenaminto': 'entrenamiento',
      'comportamiento': 'comportamiento',
      'comportamieto': 'comportamiento',
      'portarse': 'comportamiento',
      'portace': 'comportamiento',
      'donde': 'donde',
      'dond': 'donde',
      'ubicasion': 'ubicacion',
      'ubikasion': 'ubicacion',
      'ubicazion': 'ubicacion',
      'ubicasion': 'ubicacion',
      'contactar': 'contacto',
      'kontacto': 'contacto',
      'kontactar': 'contacto',
      'cuanto': 'cuanto',
      'kuanto': 'cuanto',
      'cuesta': 'cuesta',
      'kosta': 'cuesta',
      'cuantas': 'cuanto',
      'hacer': 'hacer',
      'aser': 'hacer',
      'haser': 'hacer',
      'dolraser': 'dolares',
      'dolar': 'dolares',
      'dolres': 'dolares',
      'perro': 'perro',
      'perros': 'perro',
      'pero': 'perro',
      'perrro': 'perro',
      'gato': 'gato',
      'gatos': 'gato',
      'gatto': 'gato',
      'mascota': 'mascota',
      'mazcota': 'mascota',
      'mascot': 'mascota',
      'kiero': 'quiero',
      'quier': 'quiero',
      'kero': 'quiero',
      'ayud': 'ayuda',
      'ayudar': 'ayuda',
      'ayudame': 'ayuda',
      'necesito': 'ayuda',
      'puedo': 'ayuda',
      'podria': 'ayuda',
      'podrias': 'ayuda',
      'como': 'ayuda',
      'komo': 'ayuda',
      'salu': 'salud',
      'sanu': 'salud',
      'saludable': 'salud',
      'sano': 'salud',
      'bienestar': 'salud',
      'bien': 'salud',
      'estarbien': 'salud',
      'estar': 'salud',
      'mantener': 'salud',
      'mantenerlo': 'salud',
      'mantenga': 'salud',
      'jugar': 'ejercicio',
      'juego': 'ejercicio',
      'actividad': 'ejercicio',
      'actividades': 'ejercicio',
      'pasear': 'ejercicio',
      'paseo': 'ejercicio',
      'caminar': 'ejercicio',
      'caminata': 'ejercicio',
      'correr': 'ejercicio',
      'entrenar': 'entrenamiento',
      'enseñar': 'entrenamiento',
      'enseñarle': 'entrenamiento',
      'obedecer': 'entrenamiento',
      'ordenes': 'entrenamiento',
      'portarse': 'comportamiento',
      'comportarse': 'comportamiento',
      'malo': 'comportamiento',
      'mal': 'comportamiento',
      'cepillar': 'higiene',
      'limpieza': 'higiene',
      'limpiar': 'higiene',
      'uñas': 'higiene',
      'dientes': 'higiene',
      'veterinario': 'salud',
      'vet': 'salud',
      'doctor': 'salud',
      'enfermo': 'salud',
      'enfermedad': 'salud',
      'chequeo': 'salud',
      'chequear': 'salud',
      'vacunas': 'salud',
      'desparasitar': 'salud',
    };

    Object.keys(replacements).forEach((wrong) => {
      if (normalized.includes(wrong)) {
        normalized = normalized.replace(new RegExp(wrong, 'g'), replacements[wrong]);
      }
    });

    // Coincidencia parcial para palabras clave
    if (/salu|sanu|bien|mantener|estarbien/.test(normalized)) normalized += ' salud';
    if (/jugar|juego|actividad|pasear|caminar|correr/.test(normalized)) normalized += ' ejercicio';
    if (/entrenar|enseñar|obedecer|ordenes/.test(normalized)) normalized += ' entrenamiento';
    if (/portarse|comportarse|malo|mal/.test(normalized)) normalized += ' comportamiento';
    if (/cepillar|limpieza|uñas|dientes/.test(normalized)) normalized += ' higiene';
    if (/veterinario|vet|enfermo|vacunas|chequeo/.test(normalized)) normalized += ' salud';

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

    // Lista de palabras clave relacionadas con Pet Care Royal (ampliado)
    const petCareKeywords = [
      'servicio', 'servicios', 'reserva', 'reservas', 'reservar',
      'ubicacion', 'donde', 'contacto', 'contactar', 'whatsapp',
      'cuidado', 'alimentar', 'alimentacion', 'comida', 'baño',
      'bañar', 'ejercicio', 'jugar', 'higiene', 'cepillar', 'salud',
      'veterinario', 'entrenamiento', 'entrenar', 'comportamiento',
      'portarse', 'perro', 'gato', 'mascota', 'precio', 'cuanto',
      'cuesta', 'dolares', 'hacer', 'pet', 'care', 'royal', 'ayuda',
      'quiero', 'necesito', 'puedo', 'podria', 'como', 'rutina',
      'actividad', 'paseo', 'caminar', 'correr', 'juego', 'sano',
      'saludable', 'bienestar', 'mantener', 'limpieza', 'uñas',
      'dientes', 'vacunas', 'chequeo', 'enfermo', 'doctor', 'vet',
      'enseñar', 'obedecer', 'ordenes', 'malo', 'mal',
    ];

    // Verificar si el mensaje está relacionado con Pet Care Royal
    const isRelated = keywords.some(keyword => petCareKeywords.includes(keyword));
    if (!isRelated && !/^\d+\.?.*$/.test(normalizedInput)) {
      setConversationStep(null);
      return `Ese tema no está relacionado. ¿En qué puedo ayudarte sobre Pet Care Royal? Elige una opción:
        1. Servicios
        2. Reservas
        3. Ubicación
        4. Contacto
        ${user ? '5. Cuidado de Mascotas' : ''}`;
    }

    // Detectar tipo de mascota
    const petType = keywords.includes('perro') ? 'perro' : keywords.includes('gato') ? 'gato' : 'mascota';

    // Detectar intenciones basadas en palabras clave (ampliado)
    let intent = null;
    if (keywords.some(k => ['servicio', 'servicios', 'ofrecen'].includes(k))) intent = 'servicios';
    else if (keywords.some(k => ['reserva', 'reservar', 'cómo'].includes(k))) intent = 'reservas';
    else if (keywords.some(k => ['donde', 'ubicacion', 'están'].includes(k))) intent = 'ubicacion';
    else if (keywords.some(k => ['contacto', 'contactar', 'whatsapp'].includes(k))) intent = 'contacto';
    else if (user && keywords.some(k => ['cuidado', 'alimentar', 'baño', 'ejercicio', 'higiene', 'salud', 'entrenamiento', 'comportamiento'].includes(k))) intent = 'cuidado';

    // Manejar casos ambiguos (por ejemplo, podría ser ejercicio o salud)
    const possibleIntents = [];
    if (keywords.some(k => ['ejercicio', 'rutina', 'jugar', 'paseo', 'caminar', 'correr'].includes(k))) possibleIntents.push('ejercicio');
    if (keywords.some(k => ['salud', 'sano', 'saludable', 'bienestar', 'mantener', 'veterinario', 'vacunas'].includes(k))) possibleIntents.push('salud');

    if (!intent && possibleIntents.length > 1) {
      setConversationStep(null);
      return `Parece que quieres ayuda con el cuidado de tu ${petType}. ¿Es sobre...?\n  1. Ejercicio (rutinas, paseos, juegos)\n  2. Salud (cómo mantenerlo sano, veterinario)\nEscribe 1 o 2, o elige otra opción: 1-5`;
    }

    if (!intent && !/^\d+\.?.*$/.test(normalizedInput)) {
      setConversationStep(null);
      return `No te entendí. Por favor, elige una opción o escribe un número:
        1. Servicios
        2. Reservas
        3. Ubicación
        4. Contacto
        ${user ? '5. Cuidado de Mascotas' : 'Inicia sesión para consejos de cuidado'}`;
    }

    // Manejar selecciones numéricas
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
          intent = 'ubicacion';
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
        return `1. Servicios\n` + petCareData.servicios.map(s => `  ${s.id} ${s.nombre} - ${s.precio} dólares`).join('\n') + `\nEscribe el número de un servicio para más detalles o elige otra opción: 1-5`;

      case 'reservas':
        setConversationStep(null);
        return `1. Reservas\n` + petCareData.reservas.map((step, idx) => `  1.${idx + 1} ${step}`).join('\n') + `\n¿Necesitas ayuda con el formulario? Escribe 1 para sí, o elige otra opción: 1-5`;

      case 'ubicacion':
        setConversationStep(null);
        return `1. Ubicación\n  1.1 Estamos en ${petCareData.ubicacion.direccion}\n  1.2 ${petCareData.ubicacion.mapa}\n¿Quieres más detalles? Escribe 1 para sí, o elige otra opción: 1-5`;

      case 'contacto':
        setConversationStep(null);
        return `1. Contacto\n  1.1 WhatsApp: ${petCareData.contacto.whatsapp}\n  1.2 ${petCareData.contacto.mensaje}\n¿Te ayudo con algo más? Escribe 1 para sí, o elige otra opción: 1-5`;

      case 'cuidado':
        if (keywords.some(k => ['alimentar', 'alimentacion', 'comida'].includes(k))) {
          if (!petData) {
            setConversationStep('collectingPetData');
            return `1. Cuidado - Alimentación
              1.1 Por favor, dime:
                1.1.1 Peso de tu ${petType} (en kg)
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
              1.1 Para tu ${petType} (${breed}, ${size}, ${weight} kg, ${age}, actividad ${activityLevel}, salud: ${healthIssues}, comida ${foodType}):
                1.1.1 Cantidad diaria recomendada: ${dailyAmount} ${foodType === 'húmeda' ? 'gramos (equivalente a unas 2-3 latas pequeñas)' : 'gramos'} de comida ${foodType}
                1.1.2 ${petCareData.cuidado.alimentacion.consejos}
                1.1.3 ${petCareData.cuidado.alimentacion.seguimiento}
              1.2 ¿Más ayuda? Escribe 1 para sí, o elige otra opción: 1-5`;
          }
        }
        if (keywords.some(k => ['baño', 'bañar'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Baño\n` + petCareData.cuidado.baño.map((tip, idx) => `  1.${idx + 1} ${tip}`).join('\n') + `\n  1.4 ¿Más consejos de baño? Escribe 1 para sí, o elige otra opción: 1-5`;
        }
        if (keywords.some(k => ['ejercicio', 'jugar', 'rutina', 'paseo', 'caminar', 'correr'].includes(k))) {
          setConversationStep('collectingExerciseData');
          if (petType === 'gato') {
            setConversationStep(null);
            return `1. Cuidado - Ejercicio para tu gato\n` + petCareData.cuidado.ejercicio.gato.map((tip, idx) => `  1.${idx + 1} ${tip}`).join('\n') + `\n  1.4 ¿Más consejos de ejercicio? Escribe 1 para sí, o elige otra opción: 1-5`;
          }
          return `1. Cuidado - Ejercicio para tu perro\n  1.1 ¿De qué tamaño es tu perro? (pequeño, mediano, grande)\n  1.2 Escribe el tamaño o elige otra opción: 1-5`;
        }
        if (conversationStep === 'collectingExerciseData' && keywords.some(k => ['pequeño', 'mediano', 'grande'].includes(k))) {
          setConversationStep(null);
          const size = keywords.find(k => ['pequeño', 'mediano', 'grande'].includes(k));
          return `1. Cuidado - Rutina de Ejercicio para tu perro (${size})\n` + petCareData.cuidado.ejercicio.perro[size].map((tip, idx) => `  1.${idx + 1} ${tip}`).join('\n') + `\n  1.4 ¿Más consejos de ejercicio? Escribe 1 para sí, o elige otra opción: 1-5`;
        }
        if (keywords.some(k => ['higiene', 'cepillar', 'limpieza', 'uñas', 'dientes'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Higiene para tu ${petType}\n` + petCareData.cuidado.higiene.map((tip, idx) => `  1.${idx + 1} ${tip}`).join('\n') + `\n  1.4 ¿Más consejos de higiene? Escribe 1 para sí, o elige otra opción: 1-5`;
        }
        if (keywords.some(k => ['salud', 'sano', 'saludable', 'bienestar', 'mantener', 'veterinario', 'vacunas', 'chequeo', 'enfermo'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Salud para tu ${petType}\n` + petCareData.cuidado.salud.map((tip, idx) => `  1.${idx + 1} ${tip}`).join('\n') + `\n  1.6 ¿Tienes una preocupación específica sobre su salud? Escribe 1 para sí, o elige otra opción: 1-5`;
        }
        if (keywords.some(k => ['entrenamiento', 'entrenar', 'enseñar', 'obedecer', 'ordenes'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Entrenamiento para tu ${petType}\n` + petCareData.cuidado.entrenamiento.map((tip, idx) => `  1.${idx + 1} ${tip}`).join('\n') + `\n  1.4 ${petCareData.cuidado.alimentacion.seguimiento}\n  1.5 ¿Más ayuda con el entrenamiento? Escribe 1 para sí, o elige otra opción: 1-5`;
        }
        if (keywords.some(k => ['comportamiento', 'portarse', 'comportarse', 'malo', 'mal'].includes(k))) {
          setConversationStep(null);
          return `1. Cuidado - Comportamiento de tu ${petType}\n` + petCareData.cuidado.comportamiento.map((tip, idx) => `  1.${idx + 1} ${tip}`).join('\n') + `\n  1.4 ${petCareData.cuidado.alimentacion.seguimiento}\n  1.5 ¿Más ayuda con el comportamiento? Escribe 1 para sí, o elige otra opción: 1-5`;
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