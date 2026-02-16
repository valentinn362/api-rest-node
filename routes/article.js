const express = require("express");
const router = express.Router();

const ArticuloController = require("../controllers/article");

// Rutas
router.post("/crear", ArticuloController.crear);

module.exports = router;
