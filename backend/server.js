const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Mengaktifkan middleware CORS untuk mengizinkan akses dari port 3000 atau lainnya
app.use(cors());

// Middleware untuk memproses body request menjadi format JSON
app.use(express.json());

// Mengimpor router books dari file books.js untuk mengelola rute buku
const booksRouter = require('./routes/books');

// Menghubungkan router books ke semua rute yang diawali dengan /api/books
app.use('/api/books', booksRouter);

// Menjalankan server di port 5000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

