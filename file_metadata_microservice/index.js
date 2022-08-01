var express = require("express")
var cors = require("cors")
require("dotenv").config()
const bodyParser = require("body-parser")
var app = express()
var fileupload = require("express-fileupload")
const multer = require("multer")

// let upload = multer({ dest: '/files'})
var filestorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: filestorageEngine, dest: "/files" })


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.use(cors())
app.use("/public", express.static(process.cwd() + "/public"))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

// get the files metadata.. file name, size, type
// upload the file to /files
app.post("/api/fileupload", upload.single("andresfile"), function (req, res) {
  let j = {
    name: req.file.filename,
    size: req.file.size,
    type: req.file.mimetype
  }

  return res.json(j)
})

// challenge: load files into 'files' folder?
const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log("Your app is listening on port " + port)
})
