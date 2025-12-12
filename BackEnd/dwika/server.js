const http = require('http');
const { predictChurn } = require('./controller');
const { loginUser, registerUser } = require('./controllers/auth'); // Import registerUser

const PORT = 3000;

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- ROUTING ---

    // 1. Login
    if (req.url === '/api/login' && req.method === 'POST') {
        return loginUser(req, res);
    }

    // 2. Register (TAMBAHAN BARU)
    if (req.url === '/api/register' && req.method === 'POST') {
        return registerUser(req, res);
    }

    // 3. Predict AI
    if (req.url === '/api/predict' && req.method === 'POST') {
        return predictChurn(req, res);
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Route tidak ditemukan" }));
});

server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});