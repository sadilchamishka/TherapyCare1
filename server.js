var express = require('express');
const path = require('path');

var app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
  }

app.listen(process.env.PORT || 8080);