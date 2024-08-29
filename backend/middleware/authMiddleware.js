const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];  // Der Token wird nach 'Bearer ' extrahiert

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  if (!authHeader.includes('Bearer')) {
    return res.status(401).json({ message: 'Authorization header format is invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Speichere den entschlüsselten User in der Anfrage
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authMiddleware };