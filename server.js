'use strict';

var express = require('express'),
    serveStatic = require('serve-static'),
    path = require('path'),
    app = express();

var port = 8080;

app.use(serveStatic(path.join(__dirname, 'public')));

app.get('*', function (req, res) {
  if (req.originalUrl !== '/') {
    res.redirect('/#' + req.originalUrl);
  }
});

app.listen(port, function () {
  console.log('Server launched. Port ' + port);
});
