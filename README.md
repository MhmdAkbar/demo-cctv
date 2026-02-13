### Smart CCTV Demo – AI Object & Fire Detection

Proyek ini merupakan Proof of Concept (PoC) aplikasi CCTV berbasis web. Sistem dirancang untuk mendeteksi manusia, objek tertentu (misalnya tas dan ponsel), serta api secara real-time melalui kamera. Ketika terdeteksi, sistem otomatis mengirim notifikasi beserta snapshot (bukti foto) ke Telegram.

### Fitur Utama

1. Hybrid AI Detection
Menggunakan dua model AI yang berjalan paralel.

2. Deteksi Manusia & Objek
Mengidentifikasi manusia dan objek seperti backpack, cell phone, dan laptop.

3. Deteksi Api
Menggunakan model klasifikasi kustom untuk mengenali pola visual api.

4. Notifikasi Telegram
Mengirim pesan peringatan secara otomatis ke chat Telegram.

5. Auto Snapshot
Mengambil gambar saat objek berisiko terdeteksi dan mengirimkannya sebagai lampiran.

6. Anti-Spam Mechanism
Tersedia mekanisme cooldown untuk mencegah pengiriman notifikasi berulang dalam waktu singkat.

### Teknologi yang Digunakan

Sistem dirancang ringan, mudah di-deploy, dan sepenuhnya berbasis ekosistem JavaScript (Fullstack JS).

1. Backend

- Node.js
Runtime utama untuk menjalankan server.

- Express.js
Framework minimalis untuk membangun API dan melayani file statis frontend.

- node-telegram-bot-api
Library untuk integrasi dengan Telegram Bot API.

- dotenv
Manajemen environment variables untuk menjaga keamanan kredensial.

2. Frontend

- HTML5 & Vanilla JavaScript
Digunakan tanpa framework tambahan untuk menjaga performa rendering kamera.

- MediaDevices API
API browser (navigator.mediaDevices.getUserMedia) untuk mengakses webcam secara aman (HTTPS/Localhost).

- Machine Learning / AI (Edge Computing)

Pemrosesan dilakukan di sisi klien (browser) untuk meminimalkan latensi jaringan.

- TensorFlow.js dengan model COCO-SSD
Model pra-latih ringan untuk mendeteksi ±80 kategori objek secara real-time.

- Google Teachable Machine
Digunakan untuk melatih model klasifikasi gambar kustom dalam mendeteksi api.

### Instalasi & Menjalankan Aplikasi
1. Prasyarat

Pastikan tersedia:

- Node.js versi 14 atau lebih baru

- Browser modern (Chrome, Edge, atau Firefox)

- Aplikasi Telegram

2. Setup Bot Telegram

- Buka Telegram dan cari BotFather.
- Gunakan perintah /newbot untuk membuat bot dan simpan HTTP API Token.

- Cari userinfobot lalu jalankan /start untuk mendapatkan Chat ID.

- Buka chat dengan bot yang telah dibuat dan klik START agar bot dapat mengirim pesan.

3. Setup Proyek

- Clone atau unduh repository.

- Buka terminal dan arahkan ke root directory proyek.

- Instal dependency:

npm install


- Buat file .env di root project:

PORT=3000
TELEGRAM_TOKEN=MASUKKAN_TOKEN_BOT_ANDA_DI_SINI
CHAT_ID=MASUKKAN_CHAT_ID_ANDA_DI_SINI

4. Menjalankan Server
ketik di terminal :
node server.js

Jika berhasil, akan muncul:

Server berjalan di http://localhost:3000

5. Memulai Monitoring

Buka browser dan akses:

http://localhost:3000


Izinkan akses kamera saat diminta.

Tunggu hingga model AI selesai dimuat.

Sistem siap digunakan.

Untuk pengujian:

Berdiri di depan kamera sambil membawa tas/HP.

Tampilkan gambar api ke arah kamera.

Periksa Telegram untuk melihat notifikasi dan snapshot yang dikirim.

📁 Struktur Folder
/
├── public/
│   ├── index.html
│   └── script.js
├── .env
├── package.json
└── server.js


public/ → Frontend (akses kamera dan proses AI)

.env → Kredensial rahasia

server.js → Backend dan integrasi Telegram

Proyek ini dibuat sebagai demonstrasi arsitektur Edge AI dan integrasi Node.js dengan sistem notifikasi eksternal.