# Panel Universitario - Gestor de Hábitos (Frontend)

Este repositorio contiene la interfaz de usuario de la aplicación desarrollada en **React** y empaquetada con **Vite**. El proyecto actúa como unA organización personal y académico diseñado específicamente para estudiantes universitarios.

## Características del Frontend

* **Autenticación de Usuarios:** Vistas completas para Login y Registro de usuarios.
* **Gestión de Navegación Fluyente:** Implementación de rutas protegidas mediante `react-router-dom`. Si el token expira o es inválido, redirige automáticamente.
* **Modo Oscuro Integrado:** Se ve unificado y elegante.
* **CRUD de Hábitos en Tiempo Real:** Interfaz dinámica que permite:
    * **Crear** hábitos recurrentes seleccionando días específicos de la semana.
    * **Listar** la agenda del día seleccionado de forma dinámica.
    * **Editar** en línea el nombre del hábito directamente con controles interactivos.
    * **Eliminar** hábitos impactando de inmediato en la base de datos.
* **Consistencia Mensual:** Calendario visual con mapa de calor que calcula el porcentaje de rendimiento diario del alumno.
* **UI Responsiva:** Diseñada con **Tailwind CSS**, adaptada para resoluciones desde Mobile (320px) hasta Desktop (2000px).


## Tecnologías Utilizadas

* **React** (Vite)
* **Tailwind CSS** (Estilos y Modo Oscuro)
* **React Router DOM v6** (Enrutamiento dinámico)
* **Lucide React** (Paquete de iconos vectoriales)

---

##  Estructura de Carpetas Principal

src/
 ├─ components/       # Componentes modulares (HabitManager, etc.)
 ├─ context/          # Contexto de Autenticación (AuthContext para manejo del JWT)
 ├─ pages/            # Vistas principales (Login, Register, Dashboard)
 ├─ index.css         # Configuración global y directivas de Tailwind
 └─ main.jsx          # Punto de entrada de la aplicación

 ## Instalación y Ejecución Local

### Prerrequisitos
Tener instalado **Node.js** (v16 o superior) y una instancia de **MongoDB** corriendo localmente (`mongodb://127.0.0.1:27017`).

### Pasos para levantar la API
1. Cloná este repositorio en tu máquina:
   ```bash
   git clone [https://github.com/TU_USUARIO/tracker-habitos-backend.git](https://github.com/TU_USUARIO/tracker-habitos-backend.git)


### Ususario de prueba
Usuario: usuario-prueba@gmail.com
contrasenia: prueba123