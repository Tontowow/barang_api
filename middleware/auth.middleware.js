// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

module.exports = {
  isLoggedIn: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

    if (token == null) {
      return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden. Invalid token.' });
      }
      req.user = user;
      next();
    });
  },
};