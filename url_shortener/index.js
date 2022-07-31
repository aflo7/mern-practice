require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { response } = require('express');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// array of objects
// [
//   { original_url: 'https://google.com', short_url: 1 },
//   { original_url: 'https://heilind.com', short_url: 2 }
// ]
urls = []

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// ex. going to /api/2 will redirect you to heilind.com
app.get('/api/:shorturl', function(req, res) {
  for (let i = 0; i < urls.length; i++) {
    if (urls[i].short_url == req.params.shorturl) {
      return res.redirect(urls[i].original_url)
    }
  }
  return res.send('could not find short url')

})

app.post('/api/shorturl', function(req, res) { 
  let r = {original_url: req.body.original, short_url: urls.length + 1}
  urls.push(r)
  // console.log(urls)
  return res.json(r)
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
