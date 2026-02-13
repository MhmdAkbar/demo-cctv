import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

if (!process.env.TELEGRAM_TOKEN || !process.env.CHAT_ID) {
    console.error('Environment variable TELEGRAM_TOKEN atau CHAT_ID belum di-set');
    process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN.trim(), { polling: false });

app.post('/api/alert', async (req, res) => {
    const { tipe, info, image } = req.body;
    const detail = Array.isArray(info) ? info.join(', ') : '';

    let pesan = '';
    if (tipe === 'KEBAKARAN') {
        pesan = '🔥 **BAHAYA: TERDETEKSI API!** Segera cek lokasi!';
    } else {
        pesan = `⚠️ **CCTV ALERT:** Terdeteksi orang membawa: *${detail}*`;
    }

    try {
        if (image) {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');

            await bot.sendPhoto(process.env.CHAT_ID.trim(), imageBuffer, {
                caption: pesan,
                parse_mode: 'Markdown'
            });

            console.log(`Foto dan pesan berhasil dikirim: ${tipe}`);
        } else {
            await bot.sendMessage(process.env.CHAT_ID.trim(), pesan, {
                parse_mode: 'Markdown'
            });

            console.log(`Pesan teks berhasil dikirim: ${tipe}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Gagal mengirim ke Telegram:', error.message);
        res.status(500).json({ success: false });
    }
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
