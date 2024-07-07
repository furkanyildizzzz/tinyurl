const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Bearer Token
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'undefined token' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).json({ error: error.message });

    req.user = user;
    next();
  });
};

module.exports = authenticate;
