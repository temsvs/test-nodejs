require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

if (!process.env.JWT_SECRET) {
  console.error('ОШИБКА: JWT_SECRET не установлен в .env файле');
  process.exit(1);
}

connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'Сервер работает нормально',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});