const express = require('express');
const { signup, login, getUserDetails } = require('../controllers/userController');
const { Middleware } = require('../utils/middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', Middleware, getUserDetails);

module.exports = router;
