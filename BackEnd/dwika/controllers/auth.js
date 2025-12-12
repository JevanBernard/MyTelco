const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/users.json');

// Helper untuk membaca user
const getUsers = () => {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

// 1. LOGIN
const loginUser = (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const { username, password } = JSON.parse(body);
            const users = getUsers();
            
            const foundUser = users.find(u => u.username === username && u.password === password);

            if (foundUser) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: "Login Berhasil", user: { name: foundUser.name, id: foundUser.id } }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Username atau Password salah!" }));
            }
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "Server Error" }));
        }
    });
};

// 2. REGISTER (BARU)
const registerUser = (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const { name, username, password } = JSON.parse(body);
            const users = getUsers();

            // Cek apakah username sudah ada
            if (users.find(u => u.username === username)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Nomor HP sudah terdaftar!" }));
                return;
            }

            // Buat user baru
            const newUser = {
                id: users.length + 1,
                username: username, // Pakai No HP sebagai username
                password: password,
                name: name,
                quota: 0
            };

            users.push(newUser);

            // Simpan ke file JSON
            fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "Registrasi Berhasil" }));

        } catch (e) {
            console.error(e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "Gagal menyimpan data" }));
        }
    });
};

module.exports = { loginUser, registerUser };