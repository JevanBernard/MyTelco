const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const router = require('./router');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Izinkan akses dari Frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
// Endpoint akan menjadi: http://localhost:3000/api/register
app.use('/api', router);

// Health Check
app.get('/', (req, res) => {
    res.send('MyTelco Backend Service is Running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});