const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");
const auth = require("../middleware/auth");

// Crear enlace (protegido por JWT si quieres que solo usuarios registrados creen)
// Si quieres permitir invitados: quita `auth` y ajusta.
router.post("/shorten", auth, linkController.shortenLink);

// Info del link (útil para admin/user frontend)
router.get("/info/:code", linkController.info);

// Redirección intermedia (ruta pública)
router.get("/r/:code", linkController.redirectIntermediate);

module.exports = router;
