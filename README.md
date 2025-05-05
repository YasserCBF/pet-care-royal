# Pet Care Royal

Bienvenido al proyecto **Pet Care Royal**, una aplicación web diseñada para gestionar servicios de cuidado de mascotas con un diseño elegante y moderno. Esta aplicación permite a los usuarios reservar servicios, explorar opciones de cuidado, y disfrutar de una experiencia visual mágica gracias a sus animaciones y paleta de colores pastel.

## Descripción

Pet Care Royal es una plataforma desarrollada con React que ofrece una interfaz intuitiva para reservar servicios para mascotas (como baños, cortes de pelo, etc.). Incluye un sistema de autenticación y conexión con Firestore para gestionar datos de usuarios, mascotas y reservas. El diseño utiliza CSS con animaciones personalizadas y una paleta de colores pastel para crear una experiencia visual única.

## Requisitos Previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener lo siguiente:

- [Node.js](https://nodejs.org/) (versión 14.x o superior).
- [npm](https://www.npmjs.com/) (viene con Node.js) o [yarn](https://yarnpkg.com/).
- Una cuenta de [Firebase](https://firebase.google.com/) configurada con Firestore y Authentication (detalles en la sección de instalación).
- Un editor de código como [Visual Studio Code](https://code.visualstudio.com/).

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/pet-care-royal.git
   cd pet-care-royal
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configura Firebase:
   - Crea un proyecto en la [consola de Firebase](https://console.firebase.google.com/).
   - Habilita Firestore y Authentication (Email/Password como mínimo).
   - Descarga el archivo `firebase-config.js` y colócalo en `src/` con el siguiente contenido (reemplaza los valores):
     ```javascript
     import { initializeApp } from 'firebase/app';
     import { getAuth } from 'firebase/auth';
     import { getFirestore } from 'firebase/firestore';

     const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     export const db = getFirestore(app);
     ```
   - Renombra el archivo a `firebase.js`.

4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   # o
   yarn start
   ```
   - Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso

- **Navegación**: Usa el menú en el header para acceder a las secciones (inicio, servicios, reservas).
- **Reservas**: Inicia sesión (o regístrate) y completa el formulario de reservas para programar un servicio para tu mascota.
- **Explorar**: Revisa las cartas de servicios para obtener detalles sobre precios y descripciones.
- El fondo animado con colores pastel añade un toque mágico sin afectar la funcionalidad.

## Contribución

Si deseas contribuir al proyecto:
1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "Descripción de los cambios"
   ```
4. Envía un pull request con una descripción clara.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE). Consulta el archivo `LICENSE` para más detalles (puedes personalizarlo o añadir un archivo `LICENSE` con el texto correspondiente).

## Contacto

Para preguntas o soporte, contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com) o abre un issue en el repositorio.

¡Gracias por usar Pet Care Royal! 🐾✨
