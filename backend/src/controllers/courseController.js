const Course = require('../models/Course');
const Quiz   = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Inscripcion = require('../models/Inscripcion');
const Progress = require('../models/Progress');

const detectTipoMaterial = (url) => {
  if (!url) return null;
  const u = String(url).toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('drive.google.com') || u.includes('docs.google.com')) return 'gdrive';
  if (/\.pdf$/.test(u)) return 'pdf';
  if (/\.(mp4|webm|mov|ogg)$/.test(u)) return 'video';
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(u)) return 'imagen';
  return 'link';
};

/**
 * @desc    Obtiene los cursos según el rol:
 *          instructor → solo sus propios cursos | admin → todos | resto → solo activos
 * @route   GET /api/v1/cursos
 * @access  Private
 */
const getCursos = async (req, res) => {
  try {
    let filter = { activo: true };
    if (req.user?.rol === 'instructor') {
      filter = { instructorId: req.user.id };
    } else if (req.user?.rol === 'admin') {
      filter = {};
    }
    const cursos = await Course.find(filter).select('-modulos');
    return res.status(200).json(cursos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener cursos', detalle: error.message });
  }
};

/**
 * @desc    Obtiene el detalle de un curso con sus módulos y lecciones
 * @route   GET /api/v1/cursos/:id
 * @access  Private (instructor solo sus cursos)
 */
const getCursoById = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    if (req.user?.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
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
    const curso = await Course.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    Object.assign(curso, req.body);
    await curso.save();
    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el curso', detalle: error.message });
  }
};

/**
 * @desc    Elimina un curso
 *          instructor → borrado completo (curso + quizzes, tareas, inscripciones, progreso)
 *          admin → solo lo desactiva (el panel de admin usa "Desactivar")
 * @route   DELETE /api/v1/cursos/:id
 * @access  Private (instructor solo sus cursos, admin todos)
 */
const eliminarCurso = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    if (req.user.rol === 'instructor') {
      const quizzes = await Quiz.find({ cursoId: curso._id }).select('_id');
      const quizIds = quizzes.map(q => q._id);
      const tareas  = await Assignment.find({ cursoId: curso._id }).select('_id');
      const tareaIds = tareas.map(t => t._id);

      await Promise.all([
        Course.findByIdAndDelete(curso._id),
        quizIds.length ? QuizResult.deleteMany({ quizId: { $in: quizIds } }) : Promise.resolve(),
        Quiz.deleteMany({ cursoId: curso._id }),
        tareaIds.length ? Submission.deleteMany({ assignmentId: { $in: tareaIds } }) : Promise.resolve(),
        Assignment.deleteMany({ cursoId: curso._id }),
        Inscripcion.deleteMany({ cursoId: curso._id }),
        Progress.deleteMany({ cursoId: curso._id }),
      ]);
      return res.status(204).send();
    }

    curso.activo = false;
    await curso.save();
    return res.status(204).send();
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

    const tipo = detectTipoMaterial(leccionEncontrada.materialURL);

    const materiales = leccionEncontrada.materialURL
      ? [{ id: leccionEncontrada._id, nombre: leccionEncontrada.titulo, tipo, url: leccionEncontrada.materialURL }]
      : [];

    return res.status(200).json(materiales);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener materiales', detalle: error.message });
  }
};

/**
 * @desc    Agrega un módulo a un curso
 * @route   POST /api/v1/cursos/:id/modulos
 * @access  Private (instructor, admin)
 */
const addModulo = async (req, res) => {
  try {
    const { titulo, orden } = req.body;
    if (!titulo) return res.status(400).json({ error: 'El título del módulo es requerido' });

    const curso = await Course.findById(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    const nuevoOrden = orden || curso.modulos.length + 1;
    curso.modulos.push({ titulo, orden: nuevoOrden, lecciones: [] });
    await curso.save();

    return res.status(201).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar módulo', detalle: error.message });
  }
};

/**
 * @desc    Actualiza un módulo
 * @route   PUT /api/v1/cursos/:id/modulos/:moduloId
 * @access  Private (instructor, admin)
 */
const updateModulo = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    const modulo = curso.modulos.id(req.params.moduloId);
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

    if (req.body.titulo) modulo.titulo = req.body.titulo;
    if (req.body.orden)  modulo.orden  = req.body.orden;
    await curso.save();

    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar módulo', detalle: error.message });
  }
};

/**
 * @desc    Elimina un módulo y sus lecciones
 * @route   DELETE /api/v1/cursos/:id/modulos/:moduloId
 * @access  Private (instructor, admin)
 */
const deleteModulo = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    curso.modulos = curso.modulos.filter(m => m._id.toString() !== req.params.moduloId);
    await curso.save();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar módulo', detalle: error.message });
  }
};

/**
 * @desc    Agrega una lección a un módulo
 * @route   POST /api/v1/cursos/:id/modulos/:moduloId/lecciones
 * @access  Private (instructor, admin)
 */
const addLeccion = async (req, res) => {
  try {
    const { titulo, contenido, materialURL, duracion } = req.body;
    if (!titulo) return res.status(400).json({ error: 'El título de la lección es requerido' });

    const curso = await Course.findById(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    const modulo = curso.modulos.id(req.params.moduloId);
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

    modulo.lecciones.push({ titulo, contenido: contenido || '', materialURL: materialURL || '', duracion: duracion || 0 });
    await curso.save();

    return res.status(201).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar lección', detalle: error.message });
  }
};

/**
 * @desc    Actualiza una lección
 * @route   PUT /api/v1/cursos/:id/modulos/:moduloId/lecciones/:leccionId
 * @access  Private (instructor, admin)
 */
const updateLeccion = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    const modulo  = curso.modulos.id(req.params.moduloId);
    if (!modulo)  return res.status(404).json({ error: 'Módulo no encontrado' });

    const leccion = modulo.lecciones.id(req.params.leccionId);
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });

    if (req.body.titulo)      leccion.titulo      = req.body.titulo;
    if (req.body.contenido !== undefined) leccion.contenido = req.body.contenido;
    if (req.body.materialURL !== undefined) leccion.materialURL = req.body.materialURL;
    if (req.body.duracion !== undefined)   leccion.duracion    = req.body.duracion;

    await curso.save();
    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar lección', detalle: error.message });
  }
};

/**
 * @desc    Elimina una lección
 * @route   DELETE /api/v1/cursos/:id/modulos/:moduloId/lecciones/:leccionId
 * @access  Private (instructor, admin)
 */
const deleteLeccion = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    if (req.user.rol === 'instructor' && curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' });
    }

    const modulo = curso.modulos.id(req.params.moduloId);
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

    modulo.lecciones = modulo.lecciones.filter(l => l._id.toString() !== req.params.leccionId);
    await curso.save();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar lección', detalle: error.message });
  }
};

module.exports = {
  getCursos, getCursoById, crearCurso, actualizarCurso, eliminarCurso,
  getMaterialesLeccion,
  addModulo, updateModulo, deleteModulo,
  addLeccion, updateLeccion, deleteLeccion,
};