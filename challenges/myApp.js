const mongoose = require("mongoose")
require("dotenv").config()
url =
  "mongodb+srv://aflo7:November2000@cluster0.gppnw.mongodb.net/fcc-mongodb-and-mongoose?retryWrites=true&w=majority"

mongoose.connect(url)

let personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  favoriteFoods: { type: [String], required: true }
})

let Person = mongoose.model("Person", personSchema) // models can be created from mongoose schemas

let bill = new Person({
  name: "Bill",
  age: 40,
  favoriteFoods: ["fettucine", "bread"]
})
let harper = new Person({ name: "Harper", age: 18, favoriteFoods: ["apples"] })

let grace = new Person({ name: "Grace", age: 100, favoriteFoods: ["nutella"] })
let roman = new Person({ name: "Roman", age: 10, favoriteFoods: ["apple"] })
let josh = new Person({ name: "Josh", age: 8, favoriteFoods: ["candy"] })
let mary = new Person({ name: "Mary", age: 24, favoriteFoods: ["burrito"] })
let mark = new Person({
  name: "Mark",
  age: 33,
  favoriteFoods: ["burrito", "orange"]
})
let yousef = new Person({
  name: "Yousef",
  age: 3,
  favoriteFoods: ["doritos", "burrito", "kitkat"]
})
let zane = new Person({ name: "zane", age: 3, favoriteFoods: ["burrito"] })
let wayne = new Person({
  name: "wayne",
  age: 22,
  favoriteFoods: ["burrito", "pizza"]
})
let pab = new Person({ name: "pablo", age: 33, favoriteFoods: ["kitkat"] })
let oldguy = new Person({ name: "max", age: 33, favoriteFoods: ["jellybeans"] })
arrayOfPeople = [pab, oldguy]

const createAndSavePerson = () => {
  console.log("creating" + " " + janeFonda.name)
  janeFonda.save(function (err) {
    if (err) return console.error(err)
  })
}

const deleteAll = () => {
  Person.collection.drop()
}
const createManyPeople = (arrayOfPeople) => {
  Person.insertMany(arrayOfPeople)
}

// createManyPeople(arrayOfPeople)
// deleteAll()

const findPeopleByName = (personName, done) => {
  done(null /*, data*/)
}

const findOneByFood = (food, done) => {
  done(null /*, data*/)
}

const findPerson = (personName) => {
  Person.find({ name: personName }, function (err, personFound) {
    if (err) return console.log(err)
    console.log(personFound)
  })
}
const findPersonById = (id) => {
  Person.findById(id, function (err, personFound) {
    if (err) return console.log(err)
    console.log(typeof personFound)
    console.log(personFound)
  })
}

// findPersonById('62e4a723efa9c990b4edb765')

const findEditThenSave = (personId) => {
  const foodToAdd = "kitkat"

  Person.findById(personId, function (err, personFound) {
    if (err) return console.log(err)

    // console.log(typeof personFound)
    personFound.favoriteFoods.push(foodToAdd)

    personFound.save(function (err, updatedPerson) {
      if (err) return console.error(err)
    })
  })
}

// findEditThenSave('62e4a723efa9c990b4edb765')

function findAndUpdate(personName) {
  const ageToSet = 19
  const filter = { name: "Felix" }
  const update = { age: ageToSet }

  Person.findOneAndUpdate(
    filter,
    update,
    {
      new: true
    },
    (err, updatedDoc) => {
      if (err) return console.log(err)
      console.log(updatedDoc)
    }
  )
}
// findAndUpdate('Felix')

const removeById = (_id) => {
  Person.findByIdAndRemove(_id, function (err, res) {
    if (err) return console.log(err)
    console.log("res..." + res)
  })
}

// removeById('62e54c4bce41a2d076a59ac9')

const removeManyPeople = () => {
  const nameToRemove = "Mary"
  Person.deleteMany({ name: nameToRemove }, function (err, res) {
    if (err) return console.error(err)
    console.log(res)
  })
}

const queryChain = () => {
  const foodToSearch = "burrito"
  // find people who like burritos, sort them by name, and hide their age

  Person.find().exec(function (err, res) {
    if (err) console.err(err)

    peopleWhoLikeBurrito = res.filter((element) => {
      if (element.favoriteFoods.includes("burrito")) {
        return element
      }
    })

    // console.log(peopleWhoLikeBurrito)

    // // res is an array of objects.
    peopleWhoLikeBurrito.sort((a, b) => a.name.localeCompare(b.name)) // sort the array of objects alphabetically by name
    // console.log(peopleWhoLikeBurrito)
    for (let i = 0; i < peopleWhoLikeBurrito.length; i++) {
      console.log(peopleWhoLikeBurrito[i].name)
      console.log(peopleWhoLikeBurrito[i])
    }
  })
}

// find all, find people aged 33, sort in ascending order by name, only show two first entries
const queryChain2 = () => {
  Person.find({ age: 33 })
    .sort({ name: 1 })
    .limit(2)
    .exec(function (err, res) {
      if (err) console.error(err)
      console.log("res.." + res)
    })
}
// queryChain2()


//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person
exports.createAndSavePerson = createAndSavePerson
exports.findPeopleByName = findPeopleByName
exports.findOneByFood = findOneByFood
exports.findPersonById = findPersonById
exports.findEditThenSave = findEditThenSave
exports.findAndUpdate = findAndUpdate
exports.createManyPeople = createManyPeople
exports.removeById = removeById
exports.removeManyPeople = removeManyPeople
exports.queryChain = queryChain
