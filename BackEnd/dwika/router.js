const express = require('express');
const router = express.Router();
const controller = require('./controller');
// URL: /api/register
router.post('/register', controller.registerUser);
// URL: /api/login
router.post('/login', controller.loginUser);

router.post('/complaint', controller.submitComplaint);

module.exports = router;