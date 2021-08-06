require('dotenv').config()
const Express = require('express')
const app = Express()
const db = require('./db')

app.use(require('./middleware/headers'))

const controllers = require('./controllers')

app.use(Express.json())

app.use('/user', controllers.User)
app.use('/log', controllers.Log)

db.authenticate()
  .then(() => db.sync())
  // .then(() => db.sync({ force: true }))
  .then(() => {
    app.listen(
      process.env.PORT,
      console.log(`[Server]: listening on localhost:${process.env.PORT}`)
    )
  })
  .catch(err => {
    console.log(`[Server]: Server crashed.`)
    console.log(err)
  })
