require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");
const linkRoutes = require("./routes/linkRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Limiter básico
app.use(rateLimit({ windowMs: 60*1000, max: 200 }));

// Archivos estáticos (public/)
app.use(express.static(path.join(__dirname, "public")));

// API
app.use("/api/links", linkRoutes);
app.use("/api/users", userRoutes);

// Rutas admin (auth incluido dentro de adminRoutes)
app.use("/admin", adminRoutes);

// Compatibilidad: /:code -> redirección intermedia (ruta en linkRoutes usa /r/:code)
// Si quieres que usuarios puedan usar short domain.com/abc123 directamente:
app.get("/:code", (req, res) => {
  const code = req.params.code;
  // Redirigimos a la ruta intermedia /r/:code (que está definida en linkRoutes)
  return res.redirect(`/r/${code}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
