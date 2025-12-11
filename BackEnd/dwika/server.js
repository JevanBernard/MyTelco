const http = require('http');
const { predictChurn } = require('./controller'); // Controller Python (yg sudah ada)
const { loginUser } = require('./controllers/auth'); // Controller Login (Baru)

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 1. Setup CORS (Agar frontend bisa akses backend)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight Request (Browser check)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- ROUTING MANUAL ---

    // A. Route untuk Login
    if (req.url === '/api/login' && req.method === 'POST') {
        return loginUser(req, res);
    }

    // B. Route untuk Prediksi AI
    if (req.url === '/api/predict' && req.method === 'POST') {
        return predictChurn(req, res);
    }

    // Route Default / 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Route tidak ditemukan di API MyTelco" }));
});

server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`   - Login API:   http://localhost:${PORT}/api/login`);
    console.log(`   - Predict API: http://localhost:${PORT}/api/predict`);
});