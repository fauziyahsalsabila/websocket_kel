const mysql = require('mysql');

//konfigurasi koneksi mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //ganti dengan password mysql anda
    database: 'websocket_db'
});

//koneksi ke database
db.connect ((err)=> {
    if (err){
        console.error('Error koneksi MYSQL : ',
        err);
    } else {
        console.log('Terhubung ke MYQL');
    }
    });

    module.exports = db;