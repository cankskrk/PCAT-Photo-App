const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
const port = 3000;
const Photo = require('./models/Photo');

// Connect DB
mongoose.connect('mongodb://127.0.0.1/pcat-db');

// Template Engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', {
    photos, // photos: photos seklinde yazmaya gerek yok.
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/');
});

// Listening PORT
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}...`);
});
