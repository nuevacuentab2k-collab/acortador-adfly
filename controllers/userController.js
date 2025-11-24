const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, passwordHash: hash });
    res.json({ success: true, userId: newUser._id });
  } catch (err) {
    res.status(400).json({ error: "Usuario o email ya existe" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: "Error de servidor" });
  }
};
