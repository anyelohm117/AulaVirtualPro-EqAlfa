const mongoose = require('mongoose');

const leccionSchema = new mongoose.Schema({
  titulo:      { type: String, required: true },
  contenido:   { type: String, default: '' },
  materialURL: { type: String, default: '' },
  duracion:    { type: Number, default: 0 }, // minutos
});

const moduloSchema = new mongoose.Schema({
  titulo:    { type: String, required: true },
  orden:     { type: Number, required: true },
  lecciones: [leccionSchema],
});

const courseSchema = new mongoose.Schema({
  titulo:       { type: String, required: [true, 'El título es requerido'], trim: true },
  descripcion:  { type: String, default: '' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imagen:       { type: String, default: '' },
  activo:       { type: Boolean, default: true },
  modulos:      [moduloSchema],
}, { timestamps: true });

// Índices para búsquedas frecuentes
courseSchema.index({ activo: 1 });
courseSchema.index({ instructorId: 1 });

module.exports = mongoose.model('Course', courseSchema);