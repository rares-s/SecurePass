const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extrahiere den Token
  try {
    const decoded = jwt.verify(token, 'deinGeheimesToken'); // Verwende dasselbe Secret
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
