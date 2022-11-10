const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');

const app = express();
const port = 8000;
const Photo = require('./models/Photo');
const fs = require('fs');

// Connect DB
mongoose.connect('mongodb://127.0.0.1/pcat-db');

// Template Engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

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

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
}); // Parametre ismi farketmiyor ama calismamiza uygun olmasi icin 'id' ismini verdik.

app.post('/photos', (req, res) => {
  const uploadedPhotoDir = '/public/upload/';
  let uploadedImage = req.files.image;
  let uploadedImagePath = __dirname + uploadedPhotoDir + uploadedImage.name;
  console.log(uploadedImagePath);

  if (!fs.existsSync(uploadedPhotoDir)) {
    // fs.mkdir(uploadedPhotoDir);
    console.log('Yok!');
  }

  res.redirect('/');
});

// Listening PORT
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}...`);
});
