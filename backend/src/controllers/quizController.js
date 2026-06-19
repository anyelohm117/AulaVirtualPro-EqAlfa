const Quiz       = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

/**
 * @desc    Obtiene las preguntas de un quiz para mostrarlas al alumno
 * @route   GET /api/v1/quiz/:id
 * @access  Private (alumno)
 */
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-preguntas.respuestaCorrecta');
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }
    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el quiz', detalle: error.message });
  }
};

/**
 * @desc    Recibe las respuestas del alumno, calcula la calificación y guarda el resultado
 * @route   POST /api/v1/quiz/:id/submit
 * @access  Private (alumno)
 */
const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    const { respuestas } = req.body;
    if (!respuestas || respuestas.length !== quiz.preguntas.length) {
      return res.status(400).json({ error: 'Debes responder todas las preguntas' });
    }

    // Calcular calificación automática
    let puntajeObtenido = 0;
    let puntajeTotal    = 0;

    quiz.preguntas.forEach((pregunta, i) => {
      puntajeTotal += pregunta.puntaje;
      if (respuestas[i] === pregunta.respuestaCorrecta) {
        puntajeObtenido += pregunta.puntaje;
      }
    });

    const calificacion = Math.round((puntajeObtenido / puntajeTotal) * 10 * 10) / 10;
    const aprobado     = calificacion >= 6;

    const resultado = await QuizResult.create({
      alumnoId: req.user.id,
      quizId:   quiz._id,
      respuestas,
      calificacion,
      aprobado,
    });

    return res.status(201).json({ calificacion, aprobado, resultado });

  } catch (error) {
    return res.status(500).json({ error: 'Error al procesar el quiz', detalle: error.message });
  }
};

/**
 * @desc    Retorna el resultado del quiz para el alumno autenticado
 * @route   GET /api/v1/quiz/:id/resultado
 * @access  Private (alumno)
 */
const getResultado = async (req, res) => {
  try {
    const resultado = await QuizResult.findOne({
      quizId:   req.params.id,
      alumnoId: req.user.id,
    }).populate('quizId', 'titulo preguntas');

    if (!resultado) {
      return res.status(404).json({ error: 'No has realizado este quiz aún' });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener resultado', detalle: error.message });
  }
};
const getQuizzesByCurso = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ cursoId: req.params.cursoId, activo: true })
      .select('titulo cursoId');
    return res.status(200).json(quizzes);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener quizzes', detalle: error.message });
  }
};

module.exports = { 
  getQuizById, 
  submitQuiz, 
  getResultado,
  getQuizzesByCurso 
};