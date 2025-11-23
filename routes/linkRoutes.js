const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");

// Página principal (formulario)
router.get("/", (req, res) => {
  res.render("index");
});

// Crear enlace corto
router.post("/create", linkController.createShortLink);

// Redirigir a enlace original
router.get("/:code", linkController.redirect);

module.exports = router;
