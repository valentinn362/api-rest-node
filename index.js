require("dotenv").config();

const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Inicializar app
console.log("App de node arrancada");

// Conecatar a la base de datos
connection();

// Crear servidor Node
const app = express(); // variable en la cual se guarda la ejecucion de express
const puerto = 3900;

// Configurar cors
app.use(cors()); // middleware del cors para permitir peticiones desde otros dominios

// Convertir body a objeto js
app.use(express.json()); // middleware, si le paso distintos datos en un post, luego si los quiero usar dentro de mi ruta, voy a tener un objeto js usable en mi codigo 

// Crear rutas

// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto: "+puerto);
});