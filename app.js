const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const photo = {
    id: 1,
    name: 'Photo Name',
    description: 'Photo Description',
  };

  res.send(photo);
  console.log('Received Data!');
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}...`);
});
