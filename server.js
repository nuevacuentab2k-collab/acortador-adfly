require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const linkRoutes = require("./routes/linkRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
connectDB();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/links", linkRoutes);
app.use("/api/users", userRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
