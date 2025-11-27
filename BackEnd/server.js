const http = require('http');
const { predictChurn } = require('./controller'); // Import controller tadi

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Header CORS (Supaya frontend nanti bisa akses)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight Request (Penting untuk browser)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- ROUTING MANUAL ---
    
    // Route untuk Prediksi
    if (req.url === '/api/predict' && req.method === 'POST') {
        return predictChurn(req, res);
    }

    // Route Default
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Route tidak ditemukan" }));
});

server.listen(PORT, () => {
    console.log(`Server Telco berjalan di http://localhost:${PORT}`);
});