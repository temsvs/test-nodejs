const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Пользователь заблокирован' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный токен' });
  }
};

module.exports = auth;