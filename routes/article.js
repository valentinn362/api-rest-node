const express = require("express");
const router = express.Router();

const ArticuloController = require("../controllers/article");

// Rutas
router.post("/crear", ArticuloController.crear);
router.get("/articulos", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.obtenerPorId);
router.delete("/articulo/:id", ArticuloController.borrar);
router.patch("/articulo/:id", ArticuloController.actualizar);


module.exports = router;
