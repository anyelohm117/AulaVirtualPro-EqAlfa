const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("\n========== INICIANDO CONEXIÓN ==========\n");

    console.log("Node:", process.version);
    console.log("Mongoose:", mongoose.version);

    if (!process.env.MONGO_URI) {
      throw new Error("La variable MONGO_URI no existe.");
    }

    const safeUri = process.env.MONGO_URI.replace(
      /(mongodb(\+srv)?:\/\/.*?:)(.*?)(@)/,
      "$1********$4"
    );

    console.log("URI:");
    console.log(safeUri);
    console.log("");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("\n✅ Conectado correctamente");
    console.log("Host:", conn.connection.host);
    console.log("Base:", conn.connection.name);
    console.log("Estado:", conn.connection.readyState);

  } catch (error) {

    console.log("\n========== ERROR ==========");

    console.log("Nombre:", error.name);
    console.log("Mensaje:", error.message);
    console.log("Código:", error.code);
    console.log("Errno:", error.errno);

    if (error.cause) {
      console.log("\nCause:");
      console.dir(error.cause, { depth: null });
    }

    console.log("\nObjeto completo:");
    console.dir(error, { depth: null });

    console.log("\nStack:");
    console.log(error.stack);

    process.exit(1);
  }
};

module.exports = connectDB;