const validator = require("validator");

const validarArticulo = (parametros, esCreacion = false) => {
    
    // Si es creación, TODOS los campos son obligatorios
    if (esCreacion) {
        if (!parametros.titulo || !parametros.contenido) {
            throw new Error("Faltan datos por enviar");
        }
    }

    // Validar título SOLO si se envió
    if (parametros.titulo !== undefined) {
        let validar_titulo = !validator.isEmpty(parametros.titulo) && 
                            validator.isLength(parametros.titulo, {min: 5, max: undefined});
        
        if (!validar_titulo) {
            throw new Error("El título debe tener al menos 5 caracteres");
        }
    }

    // Validar contenido SOLO si se envió
    if (parametros.contenido !== undefined) {
        let validar_contenido = !validator.isEmpty(parametros.contenido);
        
        if (!validar_contenido) {
            throw new Error("El contenido no puede estar vacío");
        }
    }
}

module.exports = {
    validarArticulo
}