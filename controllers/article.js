const validator = require("validator");
const Article = require("../models/Article");
const { error } = require("node:console");

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

const listar = async (req, res) => {
    try {

        const limite = parseInt(req.query.limite) || 0;

        let consulta = Article.find({}).sort({fecha: -1}); // -1 = descendente 

        // Si hay límite, aplicarlo
        if (limite > 0) {
            consulta = consulta.limit(limite);
        }

        const articulos = await consulta;

        if(!articulos || articulos.length === 0){
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

        if(!articulo){
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
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar el articulo"
        });
    }
};

const borrar = async (req,res) => {
    try {

        const articulo = await Article.findByIdAndDelete(req.params.id);

        if(!articulo) {
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

    }catch(error) {
        console.error("Error en borrar", error.message);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al borrar el articulo"
        });
    }
}

const actualizar = async (req,res) => {
    try {

        const articulo = await Article.findByIdAndUpdate(req.params.id,req.body,{new: true});

        if(!articulo) {
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

    }catch(error) {
        console.error("Error en borrar", error.message);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el articulo"
        });
    }
}

module.exports = {
    crear,
    listar,
    obtenerPorId,
    borrar,
    actualizar
}