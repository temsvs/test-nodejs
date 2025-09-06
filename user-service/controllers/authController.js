const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { fio, dob, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const user = new User({ fio, dob, email, password });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        fio: user.fio,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const user = await User.findOne({ email });
    
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Пользователь заблокирован' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user._id,
        fio: user.fio,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ message: 'Ошибка сервера при авторизации' });
  }
};

module.exports = {
  register,
  login
};