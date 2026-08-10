const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
  alumnoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cursoId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  fechaInscripcion: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

// Un alumno solo puede inscribirse una vez por curso
inscripcionSchema.index({ alumnoId: 1, cursoId: 1 }, { unique: true });

module.exports = mongoose.model('Inscripcion', inscripcionSchema);