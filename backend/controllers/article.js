const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Article = require("../models/Article");

// ==========================================
// CONTROLADORES
// ==========================================

const crear = async (req, res) => {
    try {
        let parametros = req.body;

        // Creación: validación estricta (todos los campos obligatorios)
        validarArticulo(parametros, true);

        const articulo = new Article(parametros);
        const articuloGuardado = await articulo.save();

        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito"
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        });
    }
}

const listar = async (req, res) => {
    try {
        const limite = parseInt(req.query.limite) || 0;
        let consulta = Article.find({}).sort({fecha: -1});

        if (limite > 0) {
            consulta = consulta.limit(limite);
        }

        const articulos = await consulta;

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            });
        }

        return res.status(200).json({
            status: "success",
            contador: articulos.length,
            articulos
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar articulos"
        });
    }
};


const obtenerPorId = async (req, res) => {
    try {
        const articulo = await Article.findById(req.params.id);

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo
        });

    } catch (error) {
        console.error("Error en obtenerPorId:", error.message);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                status: "error",
                mensaje: "El ID proporcionado no es válido"
            });
        }

        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar el articulo"
        });
    }
};

const actualizar = async (req, res) => {
    try {
        let parametros = req.body;

        // Actualización: validación flexible (solo valida lo que se envía)
        validarArticulo(parametros, false); // o simplemente validarArticulo(parametros)

        // Eliminar campos undefined para no sobreescribir con null
        Object.keys(parametros).forEach(key => {
            if (parametros[key] === undefined) {
                delete parametros[key];
            }
        });

        const articulo = await Article.findByIdAndUpdate(
            req.params.id, 
            parametros, 
            { new: true }
        );

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Articulo actualizado",
            articulo: articulo
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        });
    }
}

const borrar = async (req, res) => {
    try {
        const articulo = await Article.findByIdAndDelete(req.params.id);

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Articulo borrado",
            articulo: articulo
        });

    } catch (error) {
        console.error("Error en borrar:", error.message);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al borrar el articulo"
        });
    }
}

const subir = async (req,res) =>{

    //Configurar multer

    // Tomar fichero de imagen subido
    if(!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            mensaje: "Peticion invalida"
        })
    }

    // Nombre del archivo
    let archivo = req.file.originalname;

    // Extensionm del archivo
    let archivo_split = archivo.split(".");
    let extension = archivo_split[1];

    // Comprobar extension correcta
    if(extension != "png" && extension != "jpg" &&
        extension != "jpeg" && extension != "gif"){
       
        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            });
        })}else{
        
        // Buscar y actualizar articulo
        const articulo = await Article.findByIdAndUpdate(
            req.params.id, 
            {imagen: req.file.filename}, 
            { new: true }
        );

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
            });
        }        
        
        return res.status(200).json({
        status: "success",
        mensaje: "Articulo actualizado",
        articulo: articulo,
        archivo: req.file
    });
    }
}

const imagen = (req, res) => {

    let archivo = req.params.archivo;
    let ruta_fisica = "./imagenes/articulos/"+archivo;

    fs.stat(ruta_fisica, (error, existe) =>{
        if(existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe"
            });
        }
    });
}

const buscar = async (req, res) => {
    try {
        // Sacar el string de búsqueda
        let busqueda = req.params.busqueda;

        // Find OR con async/await (más limpio)
        const articulosEncontrados = await Article.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } }
            ]
        })
        .sort({ fecha: -1 });

        // Si no encuentra nada
        if (!articulosEncontrados || articulosEncontrados.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }

        // Éxito
        return res.status(200).json({
            status: "success",  
            contador: articulosEncontrados.length,
            articulos: articulosEncontrados
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error en la búsqueda",
            error: error.message
        });
    }
}

module.exports = {
    crear,
    listar,
    obtenerPorId,
    borrar,
    actualizar,
    subir,
    imagen,
    buscar
}