const express = require("express");
const jwt = require("jsonwebtoken");
const Link = require("../models/Link");

const router = express.Router();

// POST /admin/auth  => validar credenciales admin y devolver token
router.post("/auth", (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_SECRET;
  if (!username || !password) return res.status(400).json({ success:false, error: "Faltan datos" });
  if (username !== adminUser || password !== adminPass) return res.status(401).json({ success:false, error: "Credenciales incorrectas" });

  const token = jwt.sign({ admin: true }, adminPass, { expiresIn: "7d" });
  res.json({ success: true, token });
});

// Middleware admin
function adminAuth(req, res, next) {
  const header = req.headers["authorization"];
  if(!header) return res.status(401).json({ error: "Token admin requerido" });
  const token = header.split(" ")[1];
  try {
    jwt.verify(token, process.env.ADMIN_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token admin inválido" });
  }
}

// Listar todos los links
router.get("/links", adminAuth, async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch(err) { res.status(500).json({ error: "Error servidor" }); }
});

// Borrar enlace por id
router.delete("/links/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Link.findByIdAndDelete(id);
    if(!removed) return res.status(404).json({ error: "No encontrado" });
    res.json({ success: true });
  } catch(err) { res.status(500).json({ error: "Error servidor" }); }
});

// Estadísticas generales
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalLinks = await Link.countDocuments();
    const agg = await Link.aggregate([{ $group: { _id: null, clicks: { $sum: "$clicks" } } }]);
    res.json({ totalLinks, totalClicks: agg[0]?.clicks || 0 });
  } catch(err){ res.status(500).json({ error: "Error servidor" }); }
});

module.exports = router;
