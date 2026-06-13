const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  alumnoId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  cursoId:              { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  leccionesCompletadas: [{ type: String }], // IDs de lecciones completadas
  porcentaje:           { type: Number, default: 0 },
  ultimaActividad:      { type: Date,   default: Date.now },
}, { timestamps: true });

// Índice compuesto para búsqueda alumno + curso
progressSchema.index({ alumnoId: 1, cursoId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);