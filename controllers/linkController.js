const { nanoid } = require("nanoid");
const validator = require("validator");
const Link = require("../models/Link");

// Crear enlace acortado (si user autenticado, req.userId estará presente)
exports.shortenLink = async (req, res) => {
  const { target } = req.body;
  const userId = req.userId || null;

  if (!target || !validator.isURL(target, { require_protocol: true })) {
    return res.status(400).json({ error: "URL inválida. Incluye http:// o https://" });
  }

  try {
    const code = nanoid(6);
    const link = await Link.create({ code, target, userId });

    const baseUrl = process.env.NODE_ENV === "production"
      ? process.env.BASE_URL
      : `http://localhost:${process.env.PORT || 3000}`;

    // Short URL apunta a la ruta intermedia /r/:code
    res.json({
      success: true,
      shortUrl: `${baseUrl}/r/${code}`,
      code,
      target
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando el enlace" });
  }
};

// Ruta que devuelve info del link (útil para admin/frontend)
exports.info = async (req, res) => {
  const { code } = req.params;
  try {
    const link = await Link.findOne({ code }).lean();
    if(!link) return res.status(404).json({ error: "No encontrado" });

    // también añadimos shortUrl para conveniencia
    const baseUrl = process.env.NODE_ENV === "production"
      ? process.env.BASE_URL
      : `http://localhost:${process.env.PORT || 3000}`;

    link.shortUrl = `${baseUrl}/r/${link.code}`;
    res.json(link);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Error servidor" });
  }
};

// Redirección intermedia: incrementa click y redirige al HTML que hace timer
exports.redirectIntermediate = async (req, res) => {
  const { code } = req.params;
  try {
    const link = await Link.findOne({ code });
    if(!link) return res.status(404).send("Enlace no encontrado");

    // incrementamos clics y última vez
    link.clicks = (link.clicks || 0) + 1;
    link.lastAccess = new Date();
    await link.save();

    // redirigimos a redirect.html con target en query (el cliente lee target y ejecuta timer)
    return res.redirect(`/redirect.html?target=${encodeURIComponent(link.target)}`);
  } catch(err) {
    console.error(err);
    return res.status(500).send("Error servidor");
  }
};
