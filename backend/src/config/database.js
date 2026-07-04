const mongoose = require('mongoose');

// ============================================================
// UNICO ARCHIVO QUE DEBES MODIFICAR PARA CAMBIAR LA BASE DE DATOS
//
// Opciones:
//   Local:  'mongodb://localhost:27017/aulavirtual'
//   Atlas:  'mongodb+srv://usuario:password@cluster.mongodb.net/aulavirtual'
//
// Cambia la linea MONGO_URI, guarda y reinicia el servidor.
// ============================================================

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/aulavirtual';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado: ' + conn.connection.host);
    console.log('Base de datos: ' + conn.connection.name);
  } catch (error) {
    console.error('Error al conectar a MongoDB: ' + error.message);
    console.error('Verifica que MongoDB este corriendo y que MONGO_URI sea correcto.');
    process.exit(1);
  }
};

module.exports = { connectDB, MONGO_URI };
