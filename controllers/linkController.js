const { nanoid } = require("nanoid");
const validator = require("validator");
const Link = require("../models/Link");

// Crear enlace acortado
exports.shortenLink = async (req, res) => {
  const { target } = req.body;
  const userId = req.userId || null;

  if (!target || !validator.isURL(target, { require_protocol: true })) {
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    const code = nanoid(6);
    const baseUrl = process.env.NODE_ENV === "production"
      ? process.env.BASE_URL
      : `http://localhost:${process.env.PORT || 3000}`;

    const newLink = await Link.create({ code, target, userId });
    res.json({
      success: true,
      shortUrl: `${baseUrl}/r/${code}`,  // nota el /r/ para redirección intermedia
      code,
      target
    });
  } catch (err) {
    res.status(500).json({ error: "Error al crear el enlace" });
  }
};

// Redirección intermedia (AdFly)
exports.redirectIntermediate = async (req, res) => {
  const { code } = req.params;
  try {
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).send("❌ Enlace no encontrado");

    link.clicks++;
    link.lastAccess = new Date();
    await link.save();

    // Mostrar redirect.html con query target
    res.sendFile(`${__dirname}/../public/redirect.html`);
  } catch (err) {
    res.status(500).send("Error del servidor");
  }
};
