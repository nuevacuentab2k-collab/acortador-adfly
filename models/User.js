const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  linksCreated: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Validar contraseña
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
