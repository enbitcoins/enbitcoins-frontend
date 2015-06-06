var express = require('express'),
    serveStatic = require('serve-static'),
    app = express();

var port = 8080;

app.use(serveStatic(__dirname + '/public'));

app.get('*', function(req, res) {
  if (req.originalUrl !== '/') {
    res.redirect('/#' + req.originalUrl);
  }
});

app.listen(port, function() {
  console.log('Server launched. Port ' + port);
});
