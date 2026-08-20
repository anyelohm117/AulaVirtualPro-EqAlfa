const express = require('express');
const cors    = require('cors');
require('dotenv').config();
const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
const connectDB      = require('./config/db');
const authRoutes     = require('./routes/authRoutes');
const courseRoutes   = require('./routes/courseRoutes');
const quizRoutes     = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const reportRoutes   = require('./routes/reportRoutes');
const userRoutes     = require('./routes/userRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const assignmentRoutes  = require('./routes/assignmentRoutes');
const assistantRoutes   = require('./routes/assistantRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// Conexión a base de datos
connectDB();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas versionadas /api/v1/
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/cursos',    courseRoutes);
app.use('/api/v1/quiz',      quizRoutes);
app.use('/api/v1/progreso',  progressRoutes);
app.use('/api/v1/reportes',  reportRoutes);
app.use('/api/v1/usuarios',  userRoutes);
app.use('/api/v1/inscripciones', inscripcionRoutes);
app.use('/api/v1/tareas',        assignmentRoutes);
app.use('/api/v1/asistente',     assistantRoutes);
// Ruta base de prueba
app.get('/', (req, res) => {
  res.status(200).json({ message: 'AulaVirtual Pro API v1 funcionando ✅' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));