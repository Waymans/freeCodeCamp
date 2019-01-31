const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const crypto = require('crypto')
const cors = require('cors')

const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track', { useMongoClient: true })

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//schema model
var Schema = mongoose.Schema;
var personSchema = new Schema({
  username: String,
  exercises: [{
    description: String,
    duration: Number,
    date: Date
  }],
  count: Number
})
var Person = mongoose.model('Person', personSchema)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//post username and id
app.post('/api/exercise/new-user', (req, res) => {
  var user = req.body.username;
  Person.findOne({username: user}, (err, data) => {
    if (data) {res.send('Username is taken.')}
    else {
      var person = ({ username: user, exercises: [], count: 0 });
      Person.create(person, (err, data) => {
        if (err) throw err
        res.send({ username: data.username, _id: data._id})
      });
    }
  });
});

//get array of all users with username/id
app.get('/api/exercise/users', (req,res) => {
  Person.find({ username: /[A-z0-9]/g }, 'username _id', (err, data) => {
    if (err) throw err
    res.send(data)
  });
});

//add exercise - current date if no date added - return user object
app.post('/api/exercise/add', (req,res) => {
  var user = req.body.userId,
      desc = req.body.description,
      dura = req.body.duration,
      date = req.body.date ? new Date((req.body.date).replace(/-/g,',')): new Date(Date.now());
  Person.findByIdAndUpdate(user, { $push: { exercises: {description: desc, duration: dura, date: date} } }, (err, data) => {
    if (err) throw err
    data.count = data.count +1;
    data.save( err => {if (err) throw err})
    res.send({
      username: data.username,
      exercise: {
        description: desc,
        duration: dura,
        date: date
      }
    });
  });
});

//get exercise log of user using id
// can use paramaters from, to, and limit. 
app.get('/api/exercise/log?', (req,res) => {
  var userId = req.query.userId,
      from = new Date(req.query.from).getTime(),
      to = new Date(req.query.to).getTime(),
      limits = Number(req.query.limit);
  if (userId) {  
    Person.findById({ _id: userId }, (err,data) => { //var db - redundancy?
      var db = {
          username: data.username,
          count: data.count,
          exercises: data.exercises 
        } 
      if (from && to) {
        db.exercises = db.exercises.filter(item => {return item.date.getTime() >= from && item.date.getTime() <= to})
      };
      if (from) { 
        db.exercises = db.exercises.filter(item => {return item.date.getTime() >= from})
      };
      if (to) {         
        db.exercises = db.exercises.filter(item => {return item.date.getTime() <= to})
      };
      if (limits) { 
        db.exercises = db.exercises.slice(0, limits);
      }
      res.send(db)
    });
  } else {
    res.send('UserId required. e.g. [url]/api/exercise/log?userId=3fwe88tgh923gbg3&limit=3')
  }
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

