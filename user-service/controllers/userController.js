const User = require('../models/User');

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json({
      message: 'Пользователь найден',
      user
    });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении пользователя' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      message: 'Пользователи получены',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении пользователей' });
  }
};

const toggleActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: user.isActive ? 'Пользователь разблокирован' : 'Пользователь заблокирован',
      user: {
        id: user._id,
        fio: user.fio,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Ошибка изменения статуса:', error);
    res.status(500).json({ message: 'Ошибка сервера при изменении статуса пользователя' });
  }
};

module.exports = {
  getUser,
  getUsers,
  toggleActive
};