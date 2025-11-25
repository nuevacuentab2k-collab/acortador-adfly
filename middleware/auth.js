const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token requerido" });
  const token = header.split(" ")[1];
  if(!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
