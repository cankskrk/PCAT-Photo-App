const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const app = express();
const port = 3000;
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
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'], // Delete metodunda sorun yasadik delete metodunu get metodunun ustune yazamadigi icin ayni sayfada donup duruyor.
  })
); // Bazı tarayıcılarda PUT ve DELETE metodları çalışmıyor dolayısıyla bu gibi paketleri kullanıyoruz.

// Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated'); // Oluşturulma tarihine göre sıraladık. "-" nin amacı en son oluşturulanın ilk başa geçmesini sağlamaktır.
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

app.get('/photo/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});

app.post('/photos', (req, res) => {
  const uploadedPhotoDir = 'public/uploads/'; // Sorgu için.
  let uploadedImage = req.files.image;
  let uploadedImagePath = __dirname + '/public/uploads/' + uploadedImage.name;

  if (!fs.existsSync(uploadedPhotoDir)) {
    // Senkron yapmamızın sebebi önemli olması kontrol yaptıktan sonra diğer işleme geçmesi gerek.
    fs.mkdirSync('public/uploads/');
  }

  uploadedImage.mv(uploadedImagePath, async () => {
    await Photo.create({
      ...req.body,
      image: `/uploads/${uploadedImage.name}`,
    });
  });

  res.redirect('/');
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImagePath = __dirname + '/public/uploads/' + photo.image;
  if (fs.existsSync(deletedImagePath)) {
    fs.unlinkSync(deletedImagePath);
  }
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

// Listening PORT
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}...`);
});
