require('dotenv').config();
const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
const mongoose    = require('mongoose');
const User        = require('../models/User');
const Course      = require('../models/Course');
const Quiz        = require('../models/Quiz');
const Inscripcion = require('../models/Inscripcion');
const Progress    = require('../models/Progress');
const QuizResult  = require('../models/QuizResult');

const aleatorio = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed3 = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Iniciando seed3 (progreso y quizzes para reportes)...');

  const alumnos = await User.find({ rol: 'alumno', activo: true }).select('_id nombre email');
  const cursos  = await Course.find({ activo: true });
  const quizzes = await Quiz.find({ activo: true });

  if (!alumnos.length || !cursos.length) {
    console.log('⚠️ No hay alumnos o cursos activos. Corre primero seed.js y seed2.js');
    await mongoose.disconnect();
    return;
  }

  console.log(`📚 ${alumnos.length} alumnos · ${cursos.length} cursos · ${quizzes.length} quizzes`);

  let inscripciones = 0, progresos = 0, resultados = 0;

  for (let i = 0; i < alumnos.length; i++) {
    const al = alumnos[i];

    // 2 cursos base + 1 extra para algunos alumnos (rotación sin duplicados)
    const base    = (i * 2) % cursos.length;
    const second  = (i * 2 + 3) % cursos.length;
    const extra   = (i * 2 + 5) % cursos.length;
    const indices = i % 3 === 0 ? [base, second, extra] : [base, second];

    for (const idx of indices) {
      const curso = cursos[idx];

      // ── Inscripción (no duplica por índice único alumno+curso) ──
      await Inscripcion.findOneAndUpdate(
        { alumnoId: al._id, cursoId: curso._id },
        { activo: true },
        { upsert: true }
      );
      inscripciones++;

      // ── Progreso variado, consistente con las lecciones completadas ──
      const totalLecciones = curso.modulos.reduce((a, m) => a + m.lecciones.length, 0);
      if (totalLecciones > 0) {
        const idsLecciones = curso.modulos.flatMap(m => m.lecciones.map(l => l._id.toString()));
        const completadas  = aleatorio(Math.max(1, Math.floor(totalLecciones * 0.2)), totalLecciones);
        const elegidas     = idsLecciones.sort(() => Math.random() - 0.5).slice(0, completadas);
        const porcentaje   = Math.round((elegidas.length / totalLecciones) * 100);

        await Progress.findOneAndUpdate(
          { alumnoId: al._id, cursoId: curso._id },
          {
            leccionesCompletadas: elegidas,
            porcentaje,
            ultimaActividad: new Date(Date.now() - aleatorio(0, 20) * 86400000),
          },
          { upsert: true }
        );
        progresos++;
      }

      // ── Quiz del curso: resultado real calculado contra las respuestas ──
      const quiz = quizzes.find(q => q.cursoId.toString() === curso._id.toString());
      if (quiz && quiz.preguntas.length > 0) {
        const existe = await QuizResult.findOne({ alumnoId: al._id, quizId: quiz._id });
        if (!existe) {
          // ~65% de probabilidad de acertar cada pregunta → mezcla de aprobados/reprobados
          const respuestas = quiz.preguntas.map(p =>
            Math.random() < 0.65 ? p.respuestaCorrecta : (p.respuestaCorrecta + 1 + aleatorio(0, 2)) % p.opciones.length
          );
          let obtenido = 0, total = 0;
          quiz.preguntas.forEach((p, j) => {
            total += p.puntaje;
            if (respuestas[j] === p.respuestaCorrecta) obtenido += p.puntaje;
          });
          const calificacion = Math.round((obtenido / total) * 10 * 10) / 10;

          await QuizResult.create({
            alumnoId: al._id,
            quizId: quiz._id,
            respuestas,
            calificacion,
            aprobado: calificacion >= 6,
          });
          resultados++;
        }
      }
    }
  }

  console.log(`✅ ${inscripciones} inscripciones aseguradas`);
  console.log(`✅ ${progresos} progresos creados/actualizados`);
  console.log(`✅ ${resultados} resultados de quiz nuevos`);

  await mongoose.disconnect();
  console.log('✅ Seed3 completado.');
};

seed3().catch(err => { console.error('❌ Error en seed3:', err); process.exit(1); });