const express = require('express');

const router = express.Router();
const { register, login } = require('../controllers/login');

router.post('/register', register);
router.post('/', login);

module.exports = router;
