const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// --- SETUP SUPABASE ---
let supabase;
try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
        throw new Error("Supabase URL atau Key belum diset di file .env");
    }
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} catch (err) {
    console.error("FATAL ERROR: Gagal inisialisasi Supabase Client:", err.message);
}

// --- REGISTER (Logika Sebelumnya) ---
exports.registerUser = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from('users')
            .insert([{ name: name, phone_number: username, password_hash: hashedPassword }])
            .select();

        if (error) {
            if (error.code === '23505') return res.status(409).json({ success: false, message: 'Nomor telepon sudah terdaftar.' });
            throw error;
        }

        res.status(201).json({ success: true, message: 'Registrasi berhasil', data: data[0] });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// --- LOGIN (Logika Baru) ---
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Validasi Input
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Nomor HP dan Password wajib diisi.' });
        }

        console.log(`Login Attempt: ${username}`);

        // 2. Cari User berdasarkan Phone Number
        // Menggunakan .maybeSingle() agar tidak error jika data kosong (mengembalikan null)
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone_number', username)
            .maybeSingle();

        if (error) throw error;

        // 3. Cek apakah user ditemukan
        if (!user) {
            return res.status(401).json({ success: false, message: 'Nomor telepon tidak terdaftar.' });
        }

        // 4. Verifikasi Password (Hash Comparison)
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password salah.' });
        }

        // 5. Sukses
        console.log(`Login Success: ${username}`);
        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                id: user.user_id,
                name: user.name,
                phone: user.phone_number
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};