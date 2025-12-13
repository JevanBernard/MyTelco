const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Register Route
// URL: /api/register
router.post('/register', controller.registerUser);

// Login Route (WAJIB DITAMBAHKAN)
// URL: /api/login
router.post('/login', controller.loginUser);

module.exports = router;