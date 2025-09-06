const express = require('express');
const { getUser, getUsers, toggleActive } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/:id', getUser);
router.get('/', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Требуются права администратора' });
  }
  getUsers(req, res);
});
router.patch('/:id/toggle-active', toggleActive);

module.exports = router;