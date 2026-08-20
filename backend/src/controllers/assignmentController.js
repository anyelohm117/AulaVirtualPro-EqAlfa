const Assignment  = require('../models/Assignment');
const Submission  = require('../models/Submission');
const Inscripcion = require('../models/Inscripcion');
const Course      = require('../models/Course');

/**
 * @desc    Crea una tarea — verifica que el curso pertenezca al instructor
 * @route   POST /api/v1/tareas
 * @access  Private (instructor)
 */
const crearTarea = async (req, res) => {
  try {
    const { cursoId, titulo, descripcion, fechaEntrega, puntos } = req.body;

    if (!cursoId || !titulo || !fechaEntrega) {
      return res.status(400).json({ error: 'cursoId, título y fechaEntrega son requeridos' });
    }

    // Verificar que el curso pertenece al instructor
    const curso = await Course.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    if (curso.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para crear tareas en este curso' });
    }

    const tarea = await Assignment.create({
      cursoId, titulo, descripcion, fechaEntrega,
      puntos: puntos || 100,
      instructorId: req.user.id,
    });

    return res.status(201).json(tarea);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear tarea', detalle: error.message });
  }
};

/**
 * @desc    Obtiene las tareas del alumno — solo cursos en los que está inscrito
 * @route   GET /api/v1/tareas/mis-tareas
 * @access  Private (alumno)
 */
const getMisTareas = async (req, res) => {
  try {
    // Cursos en los que está inscrito
    const inscripciones = await Inscripcion.find({
      alumnoId: req.user.id,
      activo: true,
    }).select('cursoId');

    const cursoIds = inscripciones.map(i => i.cursoId);

    // Tareas de esos cursos
    const tareas = await Assignment.find({
      cursoId: { $in: cursoIds },
      activo: true,
    }).populate('cursoId', 'titulo');

    // Estado de entrega por tarea
    const tareasConEstado = await Promise.all(tareas.map(async (tarea) => {
      const submission = await Submission.findOne({
        assignmentId: tarea._id,
        alumnoId: req.user.id,
      });

      const hoy = new Date();
      let estado = 'pendiente';
      if (submission) {
        estado = submission.estado;
      } else if (new Date(tarea.fechaEntrega) < hoy) {
        estado = 'vencida';
      }

      return {
        ...tarea.toObject(),
        estado,
        entrega: submission || null,
      };
    }));

    return res.status(200).json(tareasConEstado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener tareas', detalle: error.message });
  }
};

/**
 * @desc    Obtiene tareas de un curso específico (para el instructor)
 * @route   GET /api/v1/tareas/curso/:cursoId
 * @access  Private (instructor, admin)
 */
const getTareasPorCurso = async (req, res) => {
  try {
    if (req.user.rol === 'instructor') {
      const curso = await Course.findById(req.params.cursoId);
      if (!curso) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }
      if (curso.instructorId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para ver tareas de este curso' });
      }
    }
    const tareas = await Assignment.find({
      cursoId: req.params.cursoId,
      activo: true,
    });
    return res.status(200).json(tareas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener tareas', detalle: error.message });
  }
};

/**
 * @desc    Alumno entrega una tarea
 * @route   POST /api/v1/tareas/:id/entregar
 * @access  Private (alumno)
 */
const entregarTarea = async (req, res) => {
  try {
    const { comentario } = req.body;

    const tarea = await Assignment.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Verificar que el alumno está inscrito en el curso
    const inscrito = await Inscripcion.findOne({
      alumnoId: req.user.id,
      cursoId: tarea.cursoId,
      activo: true,
    });
    if (!inscrito) {
      return res.status(403).json({ error: 'No estás inscrito en este curso' });
    }

    // Crear o actualizar entrega
    const submission = await Submission.findOneAndUpdate(
      { assignmentId: tarea._id, alumnoId: req.user.id },
      { comentario, estado: 'entregada', fechaEntrega: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Tarea entregada correctamente', submission });
  } catch (error) {
    return res.status(500).json({ error: 'Error al entregar tarea', detalle: error.message });
  }
};

/**
 * @desc    Instructor ve entregas de una tarea con estado por alumno
 * @route   GET /api/v1/tareas/:id/entregas
 * @access  Private (instructor, admin)
 */
const getEntregas = async (req, res) => {
  try {
    const tarea = await Assignment.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Verificar que el instructor es dueño del curso
    if (req.user.rol === 'instructor') {
      const curso = await Course.findById(tarea.cursoId);
      if (curso.instructorId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para ver estas entregas' });
      }
    }

    // Alumnos inscritos en el curso
    const inscritos = await Inscripcion.find({
      cursoId: tarea.cursoId, activo: true,
    }).populate('alumnoId', 'nombre email');

    // Cruzar con entregas
    const resultado = await Promise.all(inscritos.map(async (inscripcion) => {
      const submission = await Submission.findOne({
        assignmentId: tarea._id,
        alumnoId: inscripcion.alumnoId._id,
      });
      return {
        alumno: { id: inscripcion.alumnoId._id, nombre: inscripcion.alumnoId.nombre, email: inscripcion.alumnoId.email },
        entrega: submission || null,
        estado: submission ? submission.estado : 'pendiente',
      };
    }));

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener entregas', detalle: error.message });
  }
};

/**
 * @desc    Instructor elimina una tarea
 * @route   DELETE /api/v1/tareas/:id
 * @access  Private (instructor, admin)
 */
const eliminarTarea = async (req, res) => {
  try {
    const tarea = await Assignment.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (req.user.rol === 'instructor') {
      const curso = await Course.findById(tarea.cursoId);
      if (curso.instructorId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar esta tarea' });
      }
    }

    tarea.activo = false;
    await tarea.save();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar tarea', detalle: error.message });
  }
};

module.exports = { crearTarea, getMisTareas, getTareasPorCurso, entregarTarea, getEntregas, eliminarTarea };