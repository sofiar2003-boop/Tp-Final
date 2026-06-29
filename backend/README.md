# Gestor de Hábitos - Backend
Aplicación backend construida con Node.js, Express y MongoDB que implementa una arquitectura en capas (Routes -> Controllers -> Services -> Repositories).

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`
3. Crear un archivo `.env` en la raíz con las siguientes variables:
   ```env
   PORT=8080
   MONGO_URI=mongodb://127.0.0.1:27017/tracker-habitos
   JWT_SECRET=tu_clave_secreta_utn
   BACKEND_URL=http://localhost:8080

### Usuario de prueba 
