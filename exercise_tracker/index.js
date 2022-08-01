const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cors())
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")
require("dotenv").config()
mongoose.connect(
  "mongodb+srv://aflo7:November2000@cluster0.gppnw.mongodb.net/exercise_project?retryWrites=true&w=majority"
)

const User = new mongoose.Schema({
  username: { type: String, required: true },
  log: [{ desc: String, duration: Number, date: String }],
  exerciseCount: { type: Number, default: 0 }
})
const UserModel = mongoose.model("UserModel", User)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

// find a user by name, and return that users information. using user.ejs template
app.get("/api/users/displaydata/:username", function (req, res) {
  UserModel.findOne(
    { username: req.params.username },
    function (err, userThatWasFound) {
      if (err) {
        return console.error(err)
      }
      if (!userThatWasFound) {
        return res.sendFile(__dirname + "/views/404.html")
      }

      const username = userThatWasFound.username
      const exerciseCount = userThatWasFound.exerciseCount
      const log = userThatWasFound.log

      return res.render("user.ejs", { u: username, e: exerciseCount, l: log })
      // return res.send(username)
    }
  )
})

// create a new user. pass a username to the body, using postman
app.post("/api/users", function (req, res) {
  if (!req.body.username) {
    return res.json({ error: "USERNAME CANNOT BE EMPTY" })
  }
  let u = req.body.username
  console.log(u)
  const newUser = new UserModel({ username: u })
  newUser.save(function (err) {
    if (err) {
      return console.error(err)
    }
  })

  return res.send("success")
})

// adding exercises to the logs array of a user
// 62e624c0bc9e626f026888b1 pablo
app.post("/api/users/id/exercises", function (req, res) {
  const id = req.body._id
  const desc = req.body.description
  const date = req.body.date
  const duration = req.body.duration
  if (!desc || !duration || !date || !id) {
    return res.json({ error: "ALL FIELDS MUST EXIST" })
  }

  let d = new Date(date) // make sure that date is a number. does not check if date format is valid..
  if (isNaN(d)) {
    return res.json({ error: "date is not a number" })
  }
  toUTC = d.toUTCString() // ex. convert '1900-10-20' to 'Sat, 20 Oct 1900 00:00:00 GMT'

  const exercise = {
    desc: desc,
    date: toUTC,
    duration: duration
  }
  // findById document matching the given _id, in order to retrieve the current state of the log array
  UserModel.findOne({ _id: id }, function (err, userThatWasFound) {
    if (err) {
      return console.error(err)
    }

    userThatWasFound.log.push(exercise)
    // console.log(exercise)
    userThatWasFound.exerciseCount = userThatWasFound.log.length
    userThatWasFound.save()

    return res.send("updated the logs array of " + userThatWasFound.username)
  })
})

// retrieve a user's (search by id) exercises from date1 to date2
// http://localhost:3000/api/users/fromto/62e725d783e74b9da58acbff/2000-1-1/2000-1-2
// the above gets Bobs logged exercises from january 1 to january 2
app.get("/api/users/fromto/:_id/:from/:to", function (req, res) {
  let id = req.params._id
  let from = req.params.from
  let to = req.params.to

  UserModel.findOne({ _id: id }, function (err, personThatWasFound) {
    if (err) {
      return console.error(err)
    }

    if (!personThatWasFound) {
      return res.sendFile(__dirname + "/views/404.html")
    }
    let parseFrom = Date.parse(from) // ex. going from '2000-1-1' to the number of milliseconds
    let parseTo = Date.parse(to)

    // we will iterate through the logs array, checking if each log is within the millisecond boundary
    console.log(personThatWasFound.log)
    console.log(parseFrom + " " + parseTo)

    const output = personThatWasFound.log.filter(function (
      currentValue,
      index
    ) {
      const toMilliseconds = Date.parse(currentValue.date)
      console.log(toMilliseconds)
      if (toMilliseconds >= parseFrom && toMilliseconds <= parseTo) {
        return currentValue
      }
    })
    if (output.length == 0) {
      return res.send("no entries between " + from + " and " + to)
    }
    return res.json(output)
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
