const Link = require("../models/Link");
const { nanoid } = require("nanoid");

// Crear enlace corto
exports.createShortLink = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Debes enviar un enlace" });
    }

    // Generar código único
    const shortCode = nanoid(6);

    const newLink = new Link({
      originalUrl,
      shortCode,
    });

    await newLink.save();

    // URL final del acortador
    const shortUrl = `${req.headers.host}/${shortCode}`;

    res.json({
      ok: true,
      shortUrl,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear enlace" });
  }
};

// Redirigir a la URL original
exports.redirect = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ shortCode: code });

    if (!link) return res.status(404).send("Enlace no encontrado");

    // Contador de visitas
    link.visits += 1;
    await link.save();

    // Redirigir al enlace original
    res.redirect(link.originalUrl);

  } catch (error) {
    res.status(500).send("Error interno");
  }
};
