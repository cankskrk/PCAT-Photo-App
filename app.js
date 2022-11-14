const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const app = express();
const port = 3000;
const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController');

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
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto); // Parametre ismi farketmiyor ama calismamiza uygun olmasi icin 'id' ismini verdik.
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);

// Listening PORT
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}...`);
});
