const validator = require("validator");
const Article = require("../models/Article");

const crear = async (req, res) => {
    
    // parametros por post a guardar
    let parametros = req.body;

    // Validar datos
    try{

        let validar_titulo = !validator.isEmpty(parametros.titulo) && 
                            validator.isLength(parametros.titulo,{min:5, max:undefined});

        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if(!validar_contenido || !validar_titulo){
            throw new Error("No se ha validado la informacion");
        }

    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Crear el objeto a guardar y asignar valores
    const articulo = new Article(parametros);

    try {
        // Guardar el articulo en la base de datos
        const articuloGuardado = await articulo.save();

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito"
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el articulo"
        });
    }
}

module.exports = {
    crear
}