// index.js
// where your node app starts
// timestamp microservice

// init project
var express = require("express")
var app = express()
var bodyParser = require("body-parser")

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors")
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

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

// example valid date: 2015-12-25
// invalid dates: 'andres', '93939393848444332'
// a successful response: {unix: 28384884823, utc: Jan 25 2000 11:000:2....}
app.get("/api/:date", function (req, res) {
  if (req.params.date == "date") { // if date is just 'date', then return the current time
    let curr = new Date()
    let unix = Math.floor(curr.getTime() / 1000)
    let utc = curr.toUTCString()
    res.json({ unix: unix, utc: utc })
    return
  }
  let date = new Date(req.params.date)

  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    if (isNaN(date)) {
      res.send("date cannot be a string")
    } else {
      let unix = Math.floor(date.getTime() / 1000)
      let utc = date.toUTCString()
      res.json({ unix: unix, utc: utc })
    }
  } else {
    res.send("invalid date")
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port)
})
