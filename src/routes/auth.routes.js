const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validate, registerSchema, loginSchema } = require('../validators/auth.validator');

// Auth Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getMe);

module.exports = router;
