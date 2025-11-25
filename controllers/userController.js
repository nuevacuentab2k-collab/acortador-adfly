const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if(!username || !email || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if(exists) return res.status(400).json({ error: "Usuario o email ya existe" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash: hash });
    res.json({ success: true, userId: user._id });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Error servidor" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const valid = await user.validatePassword(password);
    if(!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Error servidor" });
  }
};
