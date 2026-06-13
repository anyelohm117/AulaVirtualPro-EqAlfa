const User       = require('../models/User');
const Progress   = require('../models/Progress');
const QuizResult = require('../models/QuizResult');

/**
 * @desc    Retorna reporte completo de todos los alumnos con progreso y calificaciones
 * @route   GET /api/v1/reportes/admin
 * @access  Private (admin)
 */
const getReporteAdmin = async (req, res) => {
  try {
    const alumnos = await User.find({ rol: 'alumno', activo: true }).select('nombre email');

    const reporte = await Promise.all(alumnos.map(async (alumno) => {
      const progresos    = await Progress.find({ alumnoId: alumno._id }).populate('cursoId', 'titulo');
      const calificaciones = await QuizResult.find({ alumnoId: alumno._id }).populate('quizId', 'titulo');

      return {
        alumno: { id: alumno._id, nombre: alumno.nombre, email: alumno.email },
        progresos: progresos.map(p => ({
          curso:      p.cursoId?.titulo,
          porcentaje: p.porcentaje,
        })),
        calificaciones: calificaciones.map(r => ({
          quiz:         r.quizId?.titulo,
          calificacion: r.calificacion,
          aprobado:     r.aprobado,
        })),
      };
    }));

    return res.status(200).json(reporte);
  } catch (error) {
    return res.status(500).json({ error: 'Error al generar reporte', detalle: error.message });
  }
};

module.exports = { getReporteAdmin };