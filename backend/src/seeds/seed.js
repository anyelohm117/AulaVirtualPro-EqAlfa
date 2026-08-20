require('dotenv').config();
const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const Course   = require('../models/Course');
const Quiz     = require('../models/Quiz');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Iniciando seed...');


  const hash = await bcrypt.hash('password123', 10);

  const users = await User.insertMany([
    { nombre: 'Admin Sistema',     email: 'admin@aulavirtual.com',     password: hash, rol: 'admin' },
    { nombre: 'Carlos Instructor', email: 'carlos@aulavirtual.com',    password: hash, rol: 'instructor' },
    { nombre: 'María López',       email: 'maria@aulavirtual.com',     password: hash, rol: 'alumno' },
    { nombre: 'Juan García',       email: 'juan@aulavirtual.com',      password: hash, rol: 'alumno' },
    { nombre: 'Ana Martínez',      email: 'ana@aulavirtual.com',       password: hash, rol: 'alumno' },
    { nombre: 'Luis Torres',       email: 'luis@aulavirtual.com',      password: hash, rol: 'alumno' },
    { nombre: 'Sofía Herrera',     email: 'sofia@aulavirtual.com',     password: hash, rol: 'alumno' },
    { nombre: 'Pedro Ramírez',     email: 'pedro@aulavirtual.com',     password: hash, rol: 'alumno' },
    { nombre: 'Laura Sánchez',     email: 'laura@aulavirtual.com',     password: hash, rol: 'alumno' },
    { nombre: 'Diego Flores',      email: 'diego@aulavirtual.com',     password: hash, rol: 'alumno' },
  ]);
  console.log(`✅ ${users.length} usuarios creados`);

  const cursos = await Course.insertMany([
    {
      titulo: 'Excel para Negocios', descripcion: 'Domina Excel desde cero.',
      instructorId: users[1]._id, activo: true,
      modulos: [
        { titulo: 'Fundamentos', orden: 1, lecciones: [
          { titulo: 'Interfaz de Excel',  contenido: 'Conoce la interfaz básica.', duracion: 15 },
          { titulo: 'Fórmulas básicas',   contenido: 'SUM, AVERAGE, MAX, MIN.',   duracion: 20 },
          { titulo: 'Formato de celdas',  contenido: 'Colores, bordes y estilos.', duracion: 12 },
        ]},
        { titulo: 'Tablas dinámicas', orden: 2, lecciones: [
          { titulo: 'Crear tabla dinámica', contenido: 'Paso a paso.',    duracion: 25 },
          { titulo: 'Filtros y segmentos',  contenido: 'Análisis avanzado.', duracion: 20 },
        ]},
      ],
    },
    {
      titulo: 'Liderazgo Efectivo', descripcion: 'Habilidades de liderazgo moderno.',
      instructorId: users[1]._id, activo: true,
      modulos: [
        { titulo: 'Fundamentos', orden: 1, lecciones: [
          { titulo: 'Estilos de liderazgo',  contenido: 'Autocrático vs democrático.', duracion: 30 },
          { titulo: 'Comunicación asertiva', contenido: 'Técnicas prácticas.',          duracion: 25 },
          { titulo: 'Gestión del tiempo',    contenido: 'Prioridades y delegación.',    duracion: 20 },
        ]},
      ],
    },
    {
      titulo: 'Ventas y Negociación', descripcion: 'Técnicas modernas de ventas.',
      instructorId: users[1]._id, activo: true,
      modulos: [
        { titulo: 'El proceso de venta', orden: 1, lecciones: [
          { titulo: 'Prospección de clientes', contenido: 'Cómo identificar clientes.', duracion: 20 },
          { titulo: 'Cierre de ventas',        contenido: 'Técnicas de cierre.',        duracion: 30 },
        ]},
      ],
    },
  ]);
  console.log(`✅ ${cursos.length} cursos creados`);

  await Quiz.insertMany([
    {
      cursoId: cursos[0]._id, titulo: 'Quiz — Fundamentos Excel',
      preguntas: [
        { enunciado: '¿Qué función suma un rango?', opciones: ['SUM', 'ADD', 'TOTAL', 'PLUS'], respuestaCorrecta: 0, puntaje: 2 },
        { enunciado: '¿Qué función calcula el promedio?', opciones: ['AVG', 'AVERAGE', 'MEAN', 'CALC'], respuestaCorrecta: 1, puntaje: 2 },
        { enunciado: '¿Para qué sirven las tablas dinámicas?', opciones: ['Dibujar gráficas', 'Resumir datos', 'Enviar correos', 'Imprimir'], respuestaCorrecta: 1, puntaje: 2 },
      ],
    },
    {
      cursoId: cursos[1]._id, titulo: 'Quiz — Liderazgo',
      preguntas: [
        { enunciado: '¿Qué es el liderazgo democrático?', opciones: ['Tomar decisiones solo', 'Incluir al equipo', 'Ignorar opiniones', 'Delegar todo'], respuestaCorrecta: 1, puntaje: 2 },
        { enunciado: '¿Qué es la comunicación asertiva?', opciones: ['Hablar fuerte', 'Expresarse con claridad y respeto', 'No decir nada', 'Ceder siempre'], respuestaCorrecta: 1, puntaje: 2 },
      ],
    },
  ]);
  console.log(`✅ Quizzes creados`);

  await mongoose.disconnect();
  console.log('✅ Seed completado. Credenciales: admin@aulavirtual.com / password123');
};

seed().catch(err => { console.error('❌ Error en seed:', err); process.exit(1); });