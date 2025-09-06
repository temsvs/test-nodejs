const requireRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
    }
    next();
  };
  
  module.exports = requireRole;