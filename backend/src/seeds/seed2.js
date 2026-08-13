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

const seed2 = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Iniciando seed2...');

  const hash = await bcrypt.hash('password123', 10);

  // ── 2 instructores nuevos (no duplica si ya existen) ─────────────
  const instructores = [];
  for (const datos of [
    { nombre: 'Roberto Vega',     email: 'roberto@aulavirtual.com' },
    { nombre: 'Gabriela Núñez',   email: 'gabriela@aulavirtual.com' },
  ]) {
    let u = await User.findOne({ email: datos.email });
    if (!u) u = await User.create({ ...datos, password: hash, rol: 'instructor' });
    instructores.push(u);
  }
  console.log(`✅ Instructores listos: ${instructores.map(u => u.email).join(', ')}`);

  // ── 4 cursos nuevos con módulos y lecciones ──────────────────────
  const cursosData = [
    {
      titulo: 'Marketing Digital', descripcion: 'Estrategias de marketing en línea.',
      instructorId: instructores[0]._id,
      modulos: [
        { titulo: 'Fundamentos', orden: 1, lecciones: [
          { titulo: 'Introducción al marketing digital', contenido: 'Qué es y por qué importa.', duracion: 20 },
          { titulo: 'Estrategias de contenido',          contenido: 'Cómo planear contenido efectivo.', duracion: 25 },
          { titulo: 'SEO básico',                        contenido: 'Optimización para buscadores.', duracion: 30 },
        ]},
        { titulo: 'Redes sociales', orden: 2, lecciones: [
          { titulo: 'Publicidad en redes', contenido: 'Campanas pagadas en Facebook e Instagram.', duracion: 25 },
          { titulo: 'Métricas y análisis', contenido: 'Lee los datos de tus campañas.', duracion: 20 },
        ]},
      ],
    },
    {
      titulo: 'Finanzas Personales', descripcion: 'Administra tu dinero con inteligencia.',
      instructorId: instructores[0]._id,
      modulos: [
        { titulo: 'Presupuesto', orden: 1, lecciones: [
          { titulo: 'Cómo hacer un presupuesto', contenido: 'Método 50/30/20.', duracion: 25 },
          { titulo: 'Control de gastos',         contenido: 'Identifica fugas de dinero.', duracion: 20 },
        ]},
        { titulo: 'Inversión', orden: 2, lecciones: [
          { titulo: 'Introducción a la inversión', contenido: 'Conceptos básicos.', duracion: 30 },
          { titulo: 'Ahorro e interés compuesto',  contenido: 'Haz crecer tu dinero.', duracion: 25 },
        ]},
      ],
    },
    {
      titulo: 'Comunicación Efectiva', descripcion: 'Habla y escribe mejor en el trabajo.',
      instructorId: instructores[1]._id,
      modulos: [
        { titulo: 'Comunicación verbal', orden: 1, lecciones: [
          { titulo: 'Hablar en público',     contenido: 'Vence el miedo escénico.', duracion: 30 },
          { titulo: 'Presentaciones eficaces', contenido: 'Estructura y storytelling.', duracion: 25 },
        ]},
        { titulo: 'Comunicación escrita', orden: 2, lecciones: [
          { titulo: 'Correos profesionales', contenido: 'Redacción clara y concisa.', duracion: 15 },
          { titulo: 'Reportes ejecutivos',   contenido: 'Sintetiza información.', duracion: 20 },
        ]},
      ],
    },
    {
      titulo: 'Excel Avanzado', descripcion: 'Domina funciones y automatización.',
      instructorId: instructores[1]._id,
      modulos: [
        { titulo: 'Funciones avanzadas', orden: 1, lecciones: [
          { titulo: 'BUSCARV y XLOOKUP',  contenido: 'Búsquedas inteligentes.', duracion: 30 },
          { titulo: 'Funciones anidadas', contenido: 'SI, Y, O combinadas.', duracion: 25 },
        ]},
        { titulo: 'Automatización', orden: 2, lecciones: [
          { titulo: 'Formato condicional', contenido: 'Visualiza tus datos.', duracion: 20 },
          { titulo: 'Introducción a macros', contenido: 'Automatiza tareas repetitivas.', duracion: 35 },
        ]},
      ],
    },
  ];

  const cursos = [];
  for (const datos of cursosData) {
    let c = await Course.findOne({ titulo: datos.titulo });
    if (!c) c = await Course.create(datos);
    cursos.push(c);
  }
  console.log(`✅ Cursos listos: ${cursos.map(c => c.titulo).join(', ')}`);

  // ── Quizzes para los 4 cursos nuevos ─────────────────────────────
  const quizzesData = [
    { cursoId: cursos[0]._id, titulo: 'Quiz — Marketing Digital', preguntas: [
      { enunciado: '¿Qué significa SEO?', opciones: ['Search Engine Optimization', 'Social Easy Online', 'System Error Output', 'Sales Extra Order'], respuestaCorrecta: 0, puntaje: 2 },
      { enunciado: '¿Qué plataforma se usa para publicidad pagada?', opciones: ['Notepad', 'Facebook Ads', 'Paint', 'Calculator'], respuestaCorrecta: 1, puntaje: 2 },
      { enunciado: '¿Qué métrica mide el alcance?', opciones: ['Clics', 'Impresiones', 'Seguidores', 'Descargas'], respuestaCorrecta: 1, puntaje: 2 },
    ]},
    { cursoId: cursos[1]._id, titulo: 'Quiz — Finanzas Personales', preguntas: [
      { enunciado: '¿Qué método distribuye 50/30/20?', opciones: ['Necesidades/gustos/ahorro', 'Ahorro/gastos/impuestos', 'Vivienda/comida/ocio', 'Inversión/deuda/efectivo'], respuestaCorrecta: 0, puntaje: 2 },
      { enunciado: '¿Qué es el interés compuesto?', opciones: ['Interés solo del capital', 'Interés sobre intereses', 'Comisión bancaria', 'Impuesto ahorro'], respuestaCorrecta: 1, puntaje: 2 },
    ]},
    { cursoId: cursos[2]._id, titulo: 'Quiz — Comunicación Efectiva', preguntas: [
      { enunciado: '¿Qué estructura usa una buena presentación?', opciones: ['Caótica', 'Introducción-desarrollo-cierre', 'Solo datos', 'Sin guion'], respuestaCorrecta: 1, puntaje: 2 },
      { enunciado: '¿Qué es el storytelling?', opciones: ['Contar historias para comunicar', 'Exagerar datos', 'Leer diapositivas', 'Hablar rápido'], respuestaCorrecta: 0, puntaje: 2 },
    ]},
    { cursoId: cursos[3]._id, titulo: 'Quiz — Excel Avanzado', preguntas: [
      { enunciado: '¿Qué función busca un valor en una tabla?', opciones: ['SUM', 'BUSCARV/XLOOKUP', 'PROMEDIO', 'CONTAR'], respuestaCorrecta: 1, puntaje: 2 },
      { enunciado: '¿Qué permite el formato condicional?', opciones: ['Cambiar estilo según reglas', 'Enviar correos', 'Crear macros', 'Imprimir rangos'], respuestaCorrecta: 0, puntaje: 2 },
    ]},
  ];

  for (const datos of quizzesData) {
    const existe = await Quiz.findOne({ titulo: datos.titulo });
    if (!existe) await Quiz.create(datos);
  }
  console.log(`✅ Quizzes de cursos nuevos listos`);

  // ── Quiz para "Ventas y Negociación" (no tiene quiz actualmente) ─
  const ventas = await Course.findOne({ titulo: 'Ventas y Negociación' });
  if (ventas) {
    const existe = await Quiz.findOne({ cursoId: ventas._id });
    if (!existe) {
      await Quiz.create({
        cursoId: ventas._id,
        titulo: 'Quiz — Ventas y Negociación',
        preguntas: [
          { enunciado: '¿Cuál es el primer paso del proceso de venta?', opciones: ['Cerrar trato', 'Prospección de clientes', 'Cobrar', 'Hacer contrato'], respuestaCorrecta: 1, puntaje: 2 },
          { enunciado: '¿Qué técnica ayuda a cerrar una venta?', opciones: ['Hablar sin parar', 'Escuchar al cliente', 'Presionar al cliente', 'Ignorar objeciones'], respuestaCorrecta: 1, puntaje: 2 },
          { enunciado: '¿Qué es una objeción?', opciones: ['Una queja sin sentido', 'Una duda del cliente sobre el producto', 'Un descuento', 'Una garantía'], respuestaCorrecta: 1, puntaje: 2 },
        ],
      });
      console.log(`✅ Quiz creado para "${ventas.titulo}"`);
    } else {
      console.log(`ℹ️ "${ventas.titulo}" ya tiene quiz, no se duplicó`);
    }
  } else {
    console.log(`⚠️ Curso "Ventas y Negociación" no encontrado, revisa si el seed original corrió`);
  }

  await mongoose.disconnect();
  console.log('✅ Seed2 completado. Credenciales: password123');
};

seed2().catch(err => { console.error('❌ Error en seed2:', err); process.exit(1); });