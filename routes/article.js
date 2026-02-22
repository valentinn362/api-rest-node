const express = require("express");
const router = express.Router();
const multer = require("multer");
const ArticuloController = require("../controllers/article");

// para guardar las imagenes
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/articulos/")
    },

    filename: (req, file, cb) => {
        cb(null, "articulo" + Date.now() + file.originalname)
    }
});

const subidas = multer({storage: almacenamiento});

// Rutas
router.post("/crear", ArticuloController.crear);
router.get("/articulos", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.obtenerPorId);
router.delete("/articulo/:id", ArticuloController.borrar);
router.patch("/articulo/:id", ArticuloController.actualizar);
router.post("/subir-imagen/:id", [subidas.single("file0")],ArticuloController.subir);
router.get("/imagen/articulo/:archivo", ArticuloController.imagen);
router.get("/buscar/:busqueda", ArticuloController.buscar);


module.exports = router;
