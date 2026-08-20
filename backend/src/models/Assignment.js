const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  cursoId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  titulo:       { type: String, required: true, trim: true },
  descripcion:  { type: String, default: '' },
  fechaEntrega: { type: Date, required: true },
  puntos:       { type: Number, default: 100 },
  activo:       { type: Boolean, default: true },
}, { timestamps: true });

assignmentSchema.index({ cursoId: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);