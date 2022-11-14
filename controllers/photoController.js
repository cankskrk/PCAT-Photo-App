const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated'); // Oluşturulma tarihine göre sıraladık. "-" nin amacı en son oluşturulanın ilk başa geçmesini sağlamaktır.
  res.render('index', {
    photos, // photos: photos seklinde yazmaya gerek yok.
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = (req, res) => {
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
  let deletedImagePath = __dirname + '/../public/uploads/' + photo.image; // MVC duzenlemesinden dolayi dosya dizini degisti o yuzdenn '..' kullandik.
  if (fs.existsSync(deletedImagePath)) {
    fs.unlinkSync(deletedImagePath);
  }
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
