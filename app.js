const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middlewares
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  console.log('Received Data!');
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}...`);
});
