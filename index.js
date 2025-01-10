const WebSocket = require('ws');
const db = require('./db'); // Import koneksi database

// Mendefinisikan WebSocket server pada port 3000
const wss = new WebSocket.Server({ port: 3000 });

let lastTimestamp = null; // Simpan timestamp terakhir yang sudah dikirim

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Kirim data hanya jika ada perubahan
    const sendDataIfUpdated = () => {
        const query = 'SELECT * FROM logs WHERE timestamp > ? ORDER BY timestamp DESC';
        db.query(query, [lastTimestamp || '1970-01-01 00:00:00'], (err, results) => {
            if (err) {
                console.error('Gagal membaca data dari database:', err);
                ws.send(JSON.stringify({ error: 'Gagal membaca data dari database' }));
                return;
            }

            if (results.length > 0) {
                // Update timestamp terakhir
                lastTimestamp = results[0].timestamp;

                // Kirim data ke klien
                ws.send(JSON.stringify({
                    message: 'Data terbaru dari database',
                    data: results
                }));

                // Cek notifikasi untuk keyword 'alert'
                results.forEach((log) => {
                    if (log.message.includes('alert')) {
                        ws.send(JSON.stringify({ 
                            notification: '⚠️ Notifikasi: Pesan mengandung kata "alert"!',
                            log: log 
                        }));
                    }
                });
            }
        });
    };

    // Jalankan pengecekan setiap 3 detik
    const interval = setInterval(sendDataIfUpdated, 3000);

    ws.on('message', (message) => {
        console.log(`Pesan dari client: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

console.log('WebSocket server berjalan di ws://localhost:3000');
