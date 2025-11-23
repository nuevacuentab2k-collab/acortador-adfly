require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// Configurar Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas del acortador
const linkRoutes = require("./routes/linkRoutes");
app.use("/", linkRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📌 Conectado a MongoDB"))
  .catch((err) => console.log("❌ Error en MongoDB:", err));

// Rutas
app.get("/", (req, res) => {
  res.render("index");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor funcionando en puerto ${PORT}`));
