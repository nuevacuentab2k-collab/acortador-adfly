const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = auth;
