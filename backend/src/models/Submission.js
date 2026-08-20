const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  alumnoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
  comentario:   { type: String, default: '' },
  estado:       { type: String, enum: ['pendiente', 'entregada', 'calificada'], default: 'pendiente' },
  calificacion: { type: Number, default: null },
  fechaEntrega: { type: Date, default: null },
}, { timestamps: true });

submissionSchema.index({ assignmentId: 1, alumnoId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);