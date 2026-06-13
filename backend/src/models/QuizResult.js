const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  alumnoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  quizId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz',   required: true },
  respuestas:   [{ type: Number }], // índices de las opciones elegidas
  calificacion: { type: Number, required: true },
  aprobado:     { type: Boolean, required: true },
}, { timestamps: true });

quizResultSchema.index({ alumnoId: 1, quizId: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);