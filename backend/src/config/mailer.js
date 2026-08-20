const nodemailer = require('nodemailer');

/**
 * Transportador configurado con Gmail SMTP
 * Usa contraseña de aplicación, no la contraseña normal
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * @desc Verifica que la conexión con Gmail funciona al arrancar
 */
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error al conectar con Gmail:', error.message);
  } else {
    console.log('✅ Servicio de email conectado:', process.env.MAIL_USER);
  }
});

module.exports = transporter;