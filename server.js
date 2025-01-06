const fs = require('node:fs')
const express = require('express')
const { json: jsonBodyParser } = require('body-parser')
const { get } = require('lodash')
const { Sequelize, DataTypes } = require('@sequelize/core')
const { PostgresDialect } = require('@sequelize/postgres')
const { usersRevenue } = require('./dataProcessor') //code reuse to avoid odd files


const app = express()

const port = process.env.PORT

const receivedEventsFilePath = process.env.RECEIVED_EVENTS_FILE_PATH

//since not all the routes should be protected, we will create a function that will run the handler only if the request is authorized
const runWithAuthorization = async (req, res, handler) => {
  const authHeader =  get(req, 'headers.authorization')
  if (!authHeader || authHeader !== 'secret') {
    res.status(401).send('Unauthorized')
  } else {
    handler()
  }
}

app.use(jsonBodyParser())

app.get('/userEvents/:userid', async (req, res) => {
  try{
    const userId = req.params.userid
    const userEventsRes = await usersRevenue.findByPk(userId)
    const userEvents = get(userEventsRes, 'dataValues', {})
    res.send(JSON.stringify(userEvents))
  } catch (error) {
    console.error(error)
    res.status(500)
    res.send('Error occurred')
  }
})


app.post('/liveEvent', async (req, res) => {
  await runWithAuthorization(req, res, () => {
    try {
      const newLine = req.body
      const newLineText = JSON.stringify(newLine) + '\n'
      if(fs.existsSync(receivedEventsFilePath)){
        fs.appendFileSync(receivedEventsFilePath, newLineText )
      } else {
        fs.writeFileSync( receivedEventsFilePath, newLineText )
      }
      res.send('Event received')
    } catch (error) {
      console.error(error)
      res.status(500)
      res.send('Error occurred')
    }
  })
})




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})