const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// File untuk menggabungkan data input ke file books.json
const booksFilePath = path.join(__dirname, '../data/books.json');

// Fungsi untuk membaca data buku dari books.json
function readBooks() {
  try {
    const data = fs.readFileSync(booksFilePath, 'utf-8');
    return JSON.parse(data); // Mengembalikan data dalam bentuk objek JSON
  } catch (err) {
    return [];  
  }
}

// Fungsi untuk menulis data buku ke books.json
function writeBooks(data) {
  fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 2)); // Menyimpan data ke file JSON
}

// Fungsi untuk menambahkan buku dengan ID 
function addBookWithId(book) {
  const books = readBooks();
  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1; 

  // Membuat objek buku baru dengan ID di bagian atas
  const bookWithId = { id: newId, ...book };

  // Menambahkan buku dengan ID ke dalam array dan menyimpan ke file
  books.push(bookWithId);
  writeBooks(books);

  return bookWithId;
}

// Mendapatkan semua buku
router.get('/', (req, res) => {
  const books = readBooks();
  res.json(books); 
});

// Menambahkan buku baru
router.post('/', (req, res) => {
  const newBook = req.body;
  
  // Menambahkan ID ke buku baru dan menyimpannya
  const bookWithId = addBookWithId(newBook);

  // Mengirimkan respons dengan buku yang sudah memiliki ID
  res.status(201).json(bookWithId);
});

// Mengupdate data buku berdasarkan ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  const books = readBooks();
  const index = books.findIndex(book => book.id === parseInt(id));

  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook }; 
    writeBooks(books); 
    res.json(books[index]); 
  } else {
    res.status(404).json({ message: 'Book not found' }); 
  }
});

// Menghapus buku berdasarkan ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let books = readBooks();
  books = books.filter(book => book.id !== parseInt(id)); 
  writeBooks(books); 
  res.status(204).end(); 
});

module.exports = router; 
