const Inscripcion = require('../models/Inscripcion');
const Course      = require('../models/Course');
const User        = require('../models/User'); // Importado aquí por buenas prácticas
const transporter = require('../config/mailer');
const { inscripcionTemplate } = require('../utils/emailTemplates');

/**
 * @desc    Inscribe al alumno autenticado en un curso
 * @route   POST /api/v1/inscripciones/:cursoId
 * @access  Private (alumno)
 */
const inscribirse = async (req, res) => {
  try {
    const curso = await Course.findById(req.params.cursoId);
    if (!curso || !curso.activo) {
      return res.status(404).json({ error: 'Curso no encontrado o inactivo' });
    }

    const yaInscrito = await Inscripcion.findOne({
      alumnoId: req.user.id,
      cursoId:  req.params.cursoId,
    });
    if (yaInscrito) {
      return res.status(409).json({ error: 'Ya estás inscrito en este curso' });
    }

    const inscripcion = await Inscripcion.create({
      alumnoId: req.user.id,
      cursoId:  req.params.cursoId,
    });

    // Obtener datos del alumno para el email
    const alumno = await User.findById(req.user.id).select('nombre email');

    // Enviar correo de notificación de forma asíncrona (sin detener la respuesta)
    transporter.sendMail({
      from: `"AulaVirtual Pro" <${process.env.MAIL_USER}>`,
      to: alumno.email,
      ...inscripcionTemplate(alumno.nombre, curso.titulo),
    }).catch(err => console.error('Error al enviar email de inscripción:', err.message));

    return res.status(201).json({ message: 'Inscripción exitosa', inscripcion });
  } catch (error) {
    return res.status(500).json({ error: 'Error al inscribirse', detalle: error.message });
  }
};

/**
 * @desc    Obtiene los cursos en los que está inscrito el alumno autenticado
 * @route   GET /api/v1/inscripciones/mis-cursos
 * @access  Private (alumno)
 */
const getMisCursos = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find({
      alumnoId: req.user.id,
      activo: true,
    }).populate({
      path: 'cursoId',
      select: 'titulo descripcion imagen modulos activo',
    });

    const cursos = inscripciones
      .filter(i => i.cursoId && i.cursoId.activo)
      .map(i => ({ ...i.cursoId.toObject(), inscripcionId: i._id }));

    return res.status(200).json(cursos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener cursos inscritos', detalle: error.message });
  }
};

/**
 * @desc    Obtiene todos los cursos disponibles para inscribirse (no inscritos aún)
 * @route   GET /api/v1/inscripciones/disponibles
 * @access  Private (alumno)
 */
const getCursosDisponibles = async (req, res) => {
  try {
    // IDs de cursos en los que ya está inscrito
    const inscritos = await Inscripcion.find({
      alumnoId: req.user.id,
      activo: true,
    }).select('cursoId');

    const idsInscritos = inscritos.map(i => i.cursoId.toString());

    // Cursos activos en los que NO está inscrito
    const disponibles = await Course.find({ activo: true })
      .select('titulo descripcion imagen modulos')
      .lean();

    const resultado = disponibles.map(curso => ({
      ...curso,
      yaInscrito: idsInscritos.includes(curso._id.toString()),
    }));

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener cursos disponibles', detalle: error.message });
  }
};

/**
 * @desc    Admin inscribe a un alumno en un curso
 * @route   POST /api/v1/inscripciones/admin
 * @access  Private (admin)
 */
const inscribirAlumno = async (req, res) => {
  try {
    const { alumnoId, cursoId } = req.body;

    if (!alumnoId || !cursoId) {
      return res.status(400).json({ error: 'alumnoId y cursoId son requeridos' });
    }

    const yaInscrito = await Inscripcion.findOne({ alumnoId, cursoId });
    if (yaInscrito) {
      return res.status(409).json({ error: 'El alumno ya está inscrito en este curso' });
    }

    const inscripcion = await Inscripcion.create({ alumnoId, cursoId });
    return res.status(201).json({ message: 'Alumno inscrito correctamente', inscripcion });
  } catch (error) {
    return res.status(500).json({ error: 'Error al inscribir alumno', detalle: error.message });
  }
};

/**
 * @desc    Obtiene todos los alumnos inscritos en un curso (para el instructor)
 * @route   GET /api/v1/inscripciones/curso/:cursoId
 * @access  Private (admin, instructor)
 */
const getAlumnosPorCurso = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find({
      cursoId: req.params.cursoId,
      activo: true,
    }).populate('alumnoId', 'nombre email');

    return res.status(200).json(inscripciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener alumnos', detalle: error.message });
  }
};

module.exports = { 
  inscribirse, 
  getMisCursos, 
  getCursosDisponibles, 
  inscribirAlumno, 
  getAlumnosPorCurso 
};