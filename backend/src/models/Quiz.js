const mongoose = require('mongoose');

const preguntaSchema = new mongoose.Schema({
  enunciado:        { type: String, required: true },
  opciones:         [{ type: String }],
  respuestaCorrecta:{ type: Number, required: true }, // índice de la opción correcta
  puntaje:          { type: Number, default: 1 },
});

const quizSchema = new mongoose.Schema({
  cursoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  titulo:  { type: String, required: true },
  preguntas: [preguntaSchema],
  activo:  { type: Boolean, default: true },
}, { timestamps: true });

quizSchema.index({ cursoId: 1 });

module.exports = mongoose.model('Quiz', quizSchema);