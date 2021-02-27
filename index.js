require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoute = require('./routes/authRoute')
const homeRoute = require('./routes/homeRoute')
const quizzRoute = require('./routes/quizzRoute')

const app = express()

app.set('port', process.env.PORT || 8079)

mongoose.connect(
  "mongodb+srv://master:Imaster@cluster0.r3eqn.mongodb.net/RCProject?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.set('useFindAndModify', false)

app.use(cors())
app.use(express.json());

app.use('/home', homeRoute)
app.use('/auth', authRoute)
app.use('/quizz', quizzRoute)

app.get('/', (req, res) => {
  res.send('server root :)')
})

app.listen(app.get('port'), err => {
  if (err) return console.log(`Ha ocurrido un error ${err}`)
  console.log(`server listening on ${app.get('port')}`)
})






