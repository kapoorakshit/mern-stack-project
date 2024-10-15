const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, 'your-secret-key'); 
    req.userId = decoded.userId; 
    console.log("Decoded user info:", decoded); 
    next(); 
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;
