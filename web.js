const express = require('express');
const bodyParser = require('body-parser');
const packageInfo = require('./package.json');


const app = express();
app.use(bodyParser.json());

app.get('/command', function (req, res) {




  res.json({ version: packageInfo.version });
});

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});

var server = app.listen(process.env.PORT, "0.0.0.0", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Web server started at http://%s:%s', host, port);
});

module.exports = (bot) => {
  app.post('/command', function (req, res) {
const id = req.body.user;

    bot.sendMessage(id, 'Чтобы подтвердить посещение отправьте локацию.').then(() => {
      // reply sent!
    });

    res.json({ version: packageInfo.version });
  });
  app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
