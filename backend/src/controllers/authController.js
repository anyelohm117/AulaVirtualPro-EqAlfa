const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const transporter = require('../config/mailer');
const { bienvenidaTemplate } = require('../utils/emailTemplates');



/**
 * @desc    Registra un nuevo usuario en el sistema
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(409).json({ error: 'Este correo ya está registrado' });
    }

    const hash    = await bcrypt.hash(password, 10);
    const usuario = await User.create({ nombre, email, password: hash, rol: rol || 'alumno' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Enviar email de bienvenida (sin await para no bloquear la respuesta)
    transporter.sendMail({
      from: `"AulaVirtual Pro" <${process.env.MAIL_USER}>`,
      to: usuario.email,
      ...bienvenidaTemplate(usuario.nombre),
    }).catch(err => console.error('Error al enviar email de bienvenida:', err.message));

    return res.status(201).json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

/**
 * @desc    Autentica un usuario y retorna un token JWT
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

module.exports = { register, login };