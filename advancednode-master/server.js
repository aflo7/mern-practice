"use strict"
const dotenv = require("dotenv").config()
const express = require("express")
const myDB = require("./connection")
const fccTesting = require("./freeCodeCamp/fcctesting.js")
const session = require("express-session")
const passport = require("passport")
const ObjectID = require("mongodb").ObjectID
const app = express()
const LocalStrategy = require("passport-local")


app.set("view engine", "pug")
app.set("views", __dirname + "/views/pug")
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
)

fccTesting(app) //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

// all of the routes inside this function depend on the connection to the database
myDB(async (client) => {
  const myDataBase = await client.db("advancednode").collection("users")

  // Be sure to change the title
  app.route("/").get((req, res) => {
    //Change the response to render the Pug template
    res.render("index", {
      title: "Connected to Database",
      message: "Please login",
      showLogin: true,
      showRegistration: true
    })
  })

  app
    .route("/login")
    .post(
      passport.authenticate("local", { failureRedirect: "/" }),
      function (req, res) {
        // If the authentication was successful, the user object will be saved in req.user
        console.log(req.user.username+ " has logged in")
        res.redirect("/profile")
      }
    )

  app.route("/profile").get(ensureAuthenticated, function (req, res) {
    let o = {
      username: req.user.username,
      tasks: req.user.tasks
    }
    res.render("profile", o)
  })

  app.route("logout").get(function (req, res) {
    console.log('logging out' + req)
    req.logout()
    res.redirect("/")
  })

  app.route("/register").post(
    (req, res, next) => {
      myDataBase.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
          next(err)
        } else if (user) {
          res.redirect("/")
        } else {
          myDataBase.insertOne(
            {
              username: req.body.username,
              password: req.body.password,
              tasks: []
            },
            (err, doc) => {
              if (err) {
                res.redirect("/")
              } else {
                // The inserted document is held within
                // the ops property of the doc
                console.log(
                  "new User registered ====>" + JSON.stringify(doc.ops[0])
                )
                next(null, doc.ops[0])
              }
            }
          )
        }
      })
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      res.redirect("/profile")
    }
  )

  // input string comes from profile.pug, updates the users task[string] array
  app.post(
    "/addtask",
    function (req, res, next) {
      const taskToBeAdded = req.body.taskString
      let userStr = req.body.username
      userStr = JSON.parse(userStr)
      userStr = userStr.username

      myDataBase.findOne(
        { username: userStr },
        function (err, personThatWasFound) {
          if (err) {
            res.redirect('/profile')
          }
          // update the tasks array of personThatWasFound, then save to the database
          personThatWasFound.tasks.push(taskToBeAdded)
          myDataBase.updateOne(
            { username: userStr },
            { $set: personThatWasFound }
          )
          next()
        }
      )
    },
    function (req, res) {
      res.redirect("/profile")
    }
  )

  app.use((req, res, next) => {
    res.status(404).render("404.pug")
  })

  // Serialization and deserialization here...
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc)
    })
  })

  passport.use(
    new LocalStrategy(function (username, password, done) {
      myDataBase.findOne({ username: username }, function (err, user) {
        console.log("User " + username + " attempted to log in.")
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false)
        }
        if (password !== user.password) {
          return done(null, false)
        }

        return done(null, user)
      })
    })
  )

  // Be sure to add this...
}).catch((e) => {
  app.route("/").get((req, res) => {
    res.render("index", { title: e, message: "Unable to login" })
  })
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/")
}
// app.listen out here...

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Listening on port " + PORT)
})
