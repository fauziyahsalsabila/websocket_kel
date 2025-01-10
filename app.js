const WebSocket = require('ws');
const db = require('./db'); // Import koneksi database

// Koneksi ke WebSocket Server
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Terhubung ke WebSocket server');

    // Kirim pesan ke server
    ws.send('Halo Server! Ini dari Client');
});

// Terima data dari WebSocket server
ws.on('message', (data) => {
    const jsonString = data.toString(); // Ubah Buffer ke String
    console.log('Data diterima dari server:', jsonString);

    // Parsing JSON
    try {
        const jsonData = JSON.parse(jsonString);
        console.log('Data terkonversi ke JSON:', jsonData);

        // Simpan data ke MySQL
        const query = 'INSERT INTO logs (message, timestamp) VALUES (?, ?)';
        const values = [jsonData.message, jsonData.timestamp];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Gagal menyimpan data ke MySQL:', err);
            } else {
                console.log('Data berhasil disimpan ke database, ID:', result.insertId);
            }
        });
    } catch (err) {
        console.error('Error parsing JSON:', err.message);
    }
});

// Handle error
ws.on('error', (err) => {
    console.error('Error WebSocket:', err);
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
});
