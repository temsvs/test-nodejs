const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error.message);
    console.log('Убедитесь, что MongoDB запущена на localhost:27017');
    process.exit(1);
  }
};

module.exports = connectDB;