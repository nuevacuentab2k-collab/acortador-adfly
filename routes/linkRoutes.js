const express = require("express");
const { shortenLink, redirectIntermediate } = require("../controllers/linkController");
const auth = require("../middleware/auth");

const router = express.Router();

// Crear enlace
router.post("/shorten", auth, shortenLink);

// Redirección intermedia
router.get("/r/:code", redirectIntermediate);

// Redirección directa (para compatibilidad)
router.get("/:code", redirectIntermediate);

module.exports = router;
