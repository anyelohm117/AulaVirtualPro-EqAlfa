const Course = require('../models/Course');

/**
 * @desc    Obtiene todos los cursos activos
 * @route   GET /api/v1/cursos
 * @access  Public
 */
const getCursos = async (req, res) => {
  try {
    const cursos = await Course.find({ activo: true }).select('-modulos');
    return res.status(200).json(cursos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener cursos', detalle: error.message });
  }
};

/**
 * @desc    Obtiene el detalle de un curso con sus módulos y lecciones
 * @route   GET /api/v1/cursos/:id
 * @access  Public
 */
const getCursoById = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el curso', detalle: error.message });
  }
};

/**
 * @desc    Crea un nuevo curso
 * @route   POST /api/v1/cursos
 * @access  Private (admin, instructor)
 */
const crearCurso = async (req, res) => {
  try {
    const { titulo, descripcion, imagen, modulos } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: 'El título del curso es requerido' });
    }

    const curso = await Course.create({
      titulo, descripcion, imagen, modulos,
      instructorId: req.user.id,
    });

    return res.status(201).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el curso', detalle: error.message });
  }
};

/**
 * @desc    Actualiza un curso existente
 * @route   PUT /api/v1/cursos/:id
 * @access  Private (admin, instructor)
 */
const actualizarCurso = async (req, res) => {
  try {
    const curso = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el curso', detalle: error.message });
  }
};

/**
 * @desc    Elimina (desactiva) un curso
 * @route   DELETE /api/v1/cursos/:id
 * @access  Private (admin)
 */
const eliminarCurso = async (req, res) => {
  try {
    const curso = await Course.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    return res.status(200).json({ message: 'Curso desactivado correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el curso', detalle: error.message });
  }
};

/**
 * @desc    Obtiene los materiales descargables de una lección específica
 * @route   GET /api/v1/cursos/:cursoId/lecciones/:leccionId/materiales
 * @access  Private
 */
const getMaterialesLeccion = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.cursoId);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    let leccionEncontrada = null;
    curso.modulos.forEach(modulo => {
      modulo.lecciones.forEach(leccion => {
        if (leccion._id.toString() === req.params.leccionId) {
          leccionEncontrada = leccion;
        }
      });
    });

    if (!leccionEncontrada) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    const materiales = leccionEncontrada.materialURL
      ? [{ id: leccionEncontrada._id, nombre: leccionEncontrada.titulo, tipo: 'pdf', url: leccionEncontrada.materialURL }]
      : [];

    return res.status(200).json(materiales);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener materiales', detalle: error.message });
  }
};

module.exports = {
  getCursos,
  getCursoById,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  getMaterialesLeccion
};
