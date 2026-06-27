const Progress = require('../models/Progress');
const Course   = require('../models/Course');

/**
 * @desc    Marca una lección como completada y recalcula el porcentaje de avance
 * @route   PUT /api/v1/progreso/:cursoId/leccion/:leccionId
 * @access  Private (alumno)
 */
const marcarLeccion = async (req, res) => {
  try {
    const { cursoId, leccionId } = req.params;

    const curso = await Course.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Contar total de lecciones del curso
    const totalLecciones = curso.modulos.reduce((acc, m) => acc + m.lecciones.length, 0);

    // Buscar o crear registro de progreso
    let progreso = await Progress.findOne({ alumnoId: req.user.id, cursoId });
    if (!progreso) {
      progreso = new Progress({ alumnoId: req.user.id, cursoId, leccionesCompletadas: [] });
    }

    // Agregar lección si no estaba completada
    if (!progreso.leccionesCompletadas.includes(leccionId)) {
      progreso.leccionesCompletadas.push(leccionId);
    }

    // Recalcular porcentaje
    progreso.porcentaje      = Math.round((progreso.leccionesCompletadas.length / totalLecciones) * 100);
    progreso.ultimaActividad = new Date();
    await progreso.save();

    return res.status(200).json(progreso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al marcar lección', detalle: error.message });
  }
};

/**
 * @desc    Retorna el progreso del alumno en un curso específico
 * @route   GET /api/v1/progreso/:cursoId
 * @access  Private (alumno)
 */
const getProgreso = async (req, res) => {
  try {
    const progreso = await Progress.findOne({
      alumnoId: req.user.id,
      cursoId:  req.params.cursoId,
    });

    if (!progreso) {
      return res.status(200).json({ porcentaje: 0, leccionesCompletadas: [] });
    }

    return res.status(200).json(progreso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener progreso', detalle: error.message });
  }
};
/**
 * @desc    Obtiene todo el progreso del alumno autenticado en todos sus cursos
 * @route   GET /api/v1/progreso
 * @access  Private (alumno)
 */
const getMiProgreso = async (req, res) => {
  try {
    const progresos = await Progress.find({ alumnoId: req.user.id })
      .populate({ path: 'cursoId', select: 'titulo' });
    return res.status(200).json(progresos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener progreso', detalle: error.message });
  }
};

module.exports = { marcarLeccion, getProgreso, getMiProgreso };