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
        console.log("Mengirim data ke Supabase...");
        const { data, error } = await supabase
            .from('users')
            .insert([{ name: name, phone_number: username, password_hash: hashedPassword }])
            .select();

        if (error) {
            if (error.code === '23505') return res.status(409).json({ success: false, message: 'Nomor telepon sudah terdaftar.' });
            throw error;
        }
        console.log("Supabase Return Data:", JSON.stringify(data, null, 2));

        // Pastikan kita mengambil ID yang benar (biasanya user_id)
        const newUser = data[0];
        res.status(201).json({ 
            success: true, 
            message: 'Registrasi berhasil',
            data: {
                // Pastikan key ini konsisten. Supabase mengembalikan 'user_id', bukan 'id'
                id: newUser.user_id, 
                name: newUser.name,
                phone: newUser.phone_number
            }
        });

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

exports.submitComplaint = async (req, res) => {
    try {
        const { phone, category, subject, message } = req.body;

        // 1. Validasi Input
        if (!phone || !category || !subject || !message) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
        }

        // SANITASI NOMOR HP (Hapus spasi, strip, dll)
        // Ubah 08... jadi 628... jika database Anda pakai 62
        // Atau biarkan raw jika database Anda pakai 08
        // Disini kita hanya hapus karakter non-digit agar pencarian akurat
        const cleanPhone = phone.replace(/\D/g, ''); 
        // Opsional: Standarisasi ke 08...
        const standardizedPhone = cleanPhone.startsWith('62') ? '0' + cleanPhone.slice(2) : cleanPhone;

        console.log(`Menerima keluhan dari: ${phone} (Clean: ${standardizedPhone})`);

        // 2. Cari User ID
        // Kita cari dengan "LIKE" atau beberapa kemungkinan format agar lebih flexible
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_id')
            // Coba cari exact match dulu.
            // PENTING: Pastikan kolom di DB adalah 'phone_number' (sesuai SQL user table Anda)
            .eq('phone_number', standardizedPhone) 
            .maybeSingle();

        if (userError) console.error("Error finding user:", userError);

        let userIdToInsert = null;

        if (userData) {
            userIdToInsert = userData.user_id;
            console.log(`User ditemukan: ${userIdToInsert}`);
        } else {
            console.warn(`User dengan nomor ${standardizedPhone} tidak ditemukan di tabel users.`);
            // KEPUTUSAN KRUSIAL:
            // Jika tabel complaint mewajibkan user_id (NOT NULL), kita tidak bisa lanjut sebagai Guest.
            // Kita harus return error ke frontend.
            return res.status(404).json({ 
                success: false, 
                message: 'Nomor telepon tidak terdaftar sebagai member. Silakan registrasi terlebih dahulu.' 
            });
        }

        // 3. Insert ke Tabel Complaint
        const { error: insertError } = await supabase
            .from('complaint')
            .insert([
                {
                    user_id: userIdToInsert, // Sekarang dijamin tidak null
                    phone_number: standardizedPhone,
                    kategori_masalah: category,
                    judul_laporan: subject,
                    detail_kendala: message,
                    tanggal: new Date()
                }
            ]);

        if (insertError) {
            console.error("Insert Complaint Error:", insertError);
            throw insertError;
        }

        // 4. Update Complaint Count (+1)
        if (userIdToInsert) {
            // Ambil data profile saat ini
            const { data: profile } = await supabase
                .from('customer_profiles')
                .select('complaint_count')
                .eq('user_id', userIdToInsert)
                .maybeSingle();

            // Jika profil ada, update count
            if (profile) {
                const newCount = (profile.complaint_count || 0) + 1;
                await supabase
                    .from('customer_profiles')
                    .update({ 
                        complaint_count: newCount,
                        last_updated: new Date()
                    })
                    .eq('user_id', userIdToInsert);
                    
                console.log(`Complaint count updated to ${newCount}`);
            }
        }

        res.status(200).json({ success: true, message: 'Laporan berhasil dikirim.' });

    } catch (error) {
        console.error('Complaint Error:', error);
        // Kirim pesan error spesifik jika database menolak (misal foreign key violation)
        const msg = error.message || "Terjadi kesalahan internal server.";
        res.status(500).json({ success: false, message: msg });
    }
};