const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre:   { type: String, required: [true, 'El nombre es requerido'], trim: true },
  email:    { type: String, required: [true, 'El email es requerido'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'La contraseña es requerida'] },
  rol:      { type: String, enum: ['admin', 'instructor', 'alumno'], default: 'alumno' },
  activo:   { type: Boolean, default: true },
}, { timestamps: true });

// unique:true en email ya crea el índice automáticamente — no duplicar
userSchema.index({ rol: 1 });

module.exports = mongoose.model('User', userSchema);