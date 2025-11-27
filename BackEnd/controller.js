const { spawn } = require('child_process');
const path = require('path');

const predictChurn = (req, res) => {
    let body = '';

    // 1. Terima data dari Frontend
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        // Contoh data dari frontend: { "internet": 60, "call": 20 }
        const inputData = body; 

        // 2. Tentukan lokasi script Python
        // '..' artinya naik satu folder dari BackEnd, lalu masuk ML_Engine
        const pythonScriptPath = path.join(__dirname, '../ML_Engine/predict.py');

        // 3. Jalankan Python (Spawn process)
        // Kita kirim inputData sebagai argumen
        const pythonProcess = spawn('python', [pythonScriptPath, inputData]);
        // CATATAN: Jika di komputer kamu harus ketik 'python3', ganti 'python' jadi 'python3'

        let resultData = '';

        // 4. Tangkap apa yang di-print oleh Python
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        // 5. Tangkap error jika Python gagal jalan
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        // 6. Saat Python selesai, kirim hasil ke Frontend
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Gagal memproses prediksi" }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                // resultData sudah berupa JSON string dari Python
                res.end(resultData);
            }
        });
    });
};

module.exports = { predictChurn };