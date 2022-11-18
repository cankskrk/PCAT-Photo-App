const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1; // query olmazsa 1 olacak
  const photosPerPage = 3; // Her sayfada  kac tane icerik olacak
  const totalPhotos = await Photo.find().countDocuments(); // Dokuman sayisi beirleme

  const photos = await Photo.find({}) // Goruntulemek icin tum dokumanlari al
    .sort('-dateCreated') // Oluşturulma tarihine göre sıraladık. "-" nin amacı en son oluşturulanın ilk başa geçmesini sağlamaktır.
    .skip((page - 1) * photosPerPage) // 4 tane dokumani gececek
    .limit(photosPerPage);

  res.render('index', {
    photos, // photos: photos seklinde yazmaya gerek yok.
    current: page, // Anlik sayfa
    pages: Math.ceil(totalPhotos / photosPerPage), // Tum dokuman sayisi / Sayfa basina dokuman // Asagi yuvarlarsak son sayfada kalan ve sayfayi doldurmayan dokumanlar gozukmez.
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = (req, res) => {
  // Fotograf yolunu veritabanina aktarma ve uploads dosyasina gelen jpg dosyalarini koyma.
  const uploadedPhotoDir = 'public/uploads/'; // Sorgu için.
  let uploadedImage = req.files.image;
  let uploadedImagePath =
    __dirname + '/../public/uploads/' + uploadedImage.name; // MVC duzenlemesinden dolayi dosya dizini degisti o yuzdenn '..' kullandik.

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
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImagePath = __dirname + '/../public/' + photo.image; // MVC duzenlemesinden dolayi dosya dizini degisti o yuzdenn '..' kullandik.
  if (fs.existsSync(deletedImagePath)) {
    fs.unlinkSync(deletedImagePath);
  }
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
