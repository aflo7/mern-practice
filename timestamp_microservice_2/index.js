// index.js
// where your node app starts

// init project
var express = require("express")
var app = express()

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors")
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html")
})

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" })
})

// /api/2022-7-30
app.get("/api/:date", function (req, res) {
  if (req.params.date == "date") { // return the current date
    const d = new Date()
    return res.json({ unix: Math.floor(d.getTime() / 1000), utc: d.toString() })
  }

  const d = new Date(req.params.date)
  if (isNaN(d)) {
    return res.json({ error: "Invalid Date" })
  }

  const unix = Math.floor(d.getTime() / 1000)
  res.json({ unix: unix, utc: d.toString() })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port)
})
