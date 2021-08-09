const router = require('express').Router()
const validateJWT = require('../middleware/validate-jwt')
const { LogModel } = require('../models')

/*=============
* log CREATE *
==============*/
router.post('/', validateJWT, async (req, res) => {
  const { description, definition, result } = req.body.log
  const { id } = req.user

  const logEntry = { description, definition, result, owner_id: id }
  try {
    const newLog = await LogModel.create(logEntry)
    res.status(200).json({ message: 'Log created successfully.', newLog })
  } catch (err) {
    res.status(500).json({ message: 'Log was not created.', error: err })
  }
})

/*======================
* log GET ALL BY USER *
========================*/
router.get('/', validateJWT, async (req, res) => {
  const { id } = req.user

  try {
    const userLogs = await LogModel.findAll({ where: { owner_id: id } })
    userLogs.length === 0
      ? res.status(404).json({ message: 'No logs found. Try creating one.' })
      : res.status(200).json(userLogs)
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving logs.', error: err })
  }
})

/*================
* log GET BY ID *
==================*/
// 'lid' so we know it's the log's id and not a user id
router.get('/:lid', async (req, res) => {
  const { lid } = req.params

  try {
    const one = await LogModel.findOne({ where: { id: lid } })
    one.length === 0
      ? res.status(404).json({ message: 'No log found! Try creating one.' })
      : res.status(200).json(one)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

/*=============
* log UPDATE *
===============*/
router.put('/:lid', validateJWT, async (req, res) => {
  const { description, definition, result } = req.body.log
  const logId = req.params.lid
  const userId = req.user.id

  const query = { where: { id: logId, owner_id: userId } }

  const updatedLog = {
    description: description,
    definition: definition,
    result: result,
  }

  try {
    const update = await LogModel.update(updatedLog, query)
    update[0] === 0
      ? res.status(404).json({ message: 'No entries found.' })
      : res
          .status(200)
          .json({ message: 'Your log has been updated.', updatedLog })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

/*=============
* log DELETE *
==============*/
router.delete('/:lid', validateJWT, async (req, res) => {
  const userId = req.user.id
  const logId = req.params.lid

  try {
    const query = { where: { id: logId, owner_id: userId } }
    const result = await LogModel.destroy(query)
    query === 0
      ? res.status(404).json({ message: 'No logs found.' })
      : res.status(200).json({ message: 'Your log has been removed.', result })
  } catch (err) {
    res.status(500).json({ error: err })
    console.log(err)
  }
})

module.exports = router
