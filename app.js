const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;

// Template Engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}...`);
});
