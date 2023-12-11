const path = require('path');
const express = require('express');
const app = express();

const startClientApp = () => {
  const port = 8080;
  app.use(express.static('public'));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  
  app.listen(port, () => {
    console.log(`Client application URL http://localhost: ${port}`);
  });
};

module.exports = startClientApp;