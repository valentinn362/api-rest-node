require("dotenv").config();

const { connection } = require("./database/connection");

//Inicializar app
console.log("App de node arrancada");

// Conecatar a la base de datos
connection();

