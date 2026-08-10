const User = require('../models/User');

/**
 * @desc    Lista todos los usuarios del sistema
 * @route   GET /api/v1/usuarios
 * @access  Private (admin)
 */
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
  }
};

/**
 * @desc    Crea un nuevo usuario (admin o instructor) desde el panel de admin
 * @route   POST /api/v1/usuarios
 * @access  Private (admin)
 */
const crearUsuario = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    if (!['admin', 'instructor', 'alumno'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(409).json({ error: 'Este email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await User.create({ nombre, email, password: hash, rol });

    return res.status(201).json({
      id: usuario._id, nombre: usuario.nombre,
      email: usuario.email, rol: usuario.rol, activo: usuario.activo,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
};

/**
 * @desc    Activa o desactiva un usuario
 * @route   PATCH /api/v1/usuarios/:id/estado
 * @access  Private (admin)
 */
const toggleEstadoUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    usuario.activo = !usuario.activo;
    await usuario.save();
    return res.status(200).json({ id: usuario._id, activo: usuario.activo });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
};

/**
 * @desc    Elimina un usuario del sistema
 * @route   DELETE /api/v1/usuarios/:id
 * @access  Private (admin)
 */
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
  }
};

module.exports = { getUsuarios, crearUsuario, toggleEstadoUsuario, eliminarUsuario };