const fs = require('fs');
const path = require('path');

// Fungsi Login
const loginUser = (req, res) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { username, password } = JSON.parse(body);

            // 1. Baca database users.json
            const dbPath = path.join(__dirname, '../database/users.json');
            const usersRaw = fs.readFileSync(dbPath);
            const users = JSON.parse(usersRaw);

            // 2. Cari user yang cocok
            const foundUser = users.find(u => u.username === username && u.password === password);

            if (foundUser) {
                // Login Berhasil
                const responseData = {
                    success: true,
                    message: "Login Berhasil!",
                    user: {
                        id: foundUser.id,
                        name: foundUser.name,
                        quota: foundUser.quota
                    }
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData));
            } else {
                // Login Gagal
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Username atau Password salah!" }));
            }

        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "Terjadi kesalahan server" }));
        }
    });
};

module.exports = { loginUser };