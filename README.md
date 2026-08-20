# 🚀 AulaVirtualPro
> NexaTech Consulting — Mayo–Agosto 2026

## 📋 Descripción
Plataforma LMS para capacitación empresarial que centraliza y formaliza el proceso educativo. Estructura los materiales en módulos y lecciones descargables, automatiza el seguimiento con barras de progreso y evalúa a los alumnos con quizzes de calificación automática. Incluye asignaciones, reportes para docentes y un asistente de IA integrado en la plataforma.

## 👥 Equipo
| Nombre | Rol | Usuario GitHub |
|--------|-----|---------------|
| Alberto Hernandez | PM / Tech Lead | @anyelohm117 |
| Alan Santillan | UI/UX Designer | @alan-sant |
| Johan Anuart | Frontend Dev | @johan-anuart |
| Erick Hernandez | Backend Dev | @redhollow |

## 🛠 Stack Tecnológico
- **Frontend:** React 19 + Vite, React Router, Recharts, Lucide Icons
- **Backend:** Node.js + Express, JWT, Bcrypt, Nodemailer, OpenAI (asistente)
- **Base de Datos:** MongoDB + Mongoose
- **Despliegue:** Vercel / Railway / Render

## 🚀 Instalación y uso

### Requisitos
- Node.js 18+
- MongoDB (local o Atlas)
- Clave de API de OpenAI (opcional, para el asistente)

### Backend
```bash
cd backend
npm install
cp .env.example .env   # configurar variables de entorno
npm run seed           # cargar datos iniciales
npm run dev            # iniciar API en http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # iniciar app en http://localhost:5173
```

## 🔑 Variables de entorno (`backend/.env`)
| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor |
| `MONGO_URI` | Cadena de conexión a MongoDB |
| `JWT_SECRET` | Secreto para firmar tokens |
| `OPENAI_API_KEY` | Clave de la API de OpenAI |
| `EMAIL_USER` / `EMAIL_PASS` | Credenciales de Nodemailer |

## 📁 Estructura del proyecto
```
/backend     → API REST (Express + MongoDB)
  /src
    /controllers  → Lógica de negocio (auth, cursos, quizzes, asistente IA…)
    /routes       → Definición de endpoints
    /models       → Modelos de Mongoose
    /middleware   → Autenticación y roles
    /seeds        → Datos iniciales
/frontend    → SPA (React + Vite)
  /src
    /pages        → Vistas (Login, Catálogo, Dashboards, Quizzes…)
    /components   → Componentes reutilizables
    /context      → AuthContext y ChatContext
    /services     → Cliente de la API
    /styles       → Hojas de estilo
/docs        → Documentación, diagramas y presentaciones
```

## 🧪 Scripts
| Comando | Descripción |
|---------|-------------|
| `npm run dev` (backend) | API en modo desarrollo con nodemon |
| `npm run seed` (backend) | Poblar la base de datos |
| `npm run dev` (frontend) | App en modo desarrollo (Vite) |
| `npm run build` (frontend) | Build de producción |
| `npm run lint` (frontend) | Análisis estático con ESLint |

## 📊 Módulos principales
- **Cursos y catálogo:** módulos con lecciones y materiales descargables
- **Progreso:** seguimiento automático por alumno
- **Quizzes:** evaluación con calificación automática
- **Asignaciones:** entrega y revisión de tareas
- **Dashboards:** administrador, docente y alumno
- **Asistente IA:** chat integrado para resolver dudas
- **Reportes:** generación de reportes de rendimiento

## 🌐 Demo en vivo
[URL del sistema desplegado](https://tu-app.vercel.app)

## 📄 Licencia
MIT — NexaTech Consulting 2026
