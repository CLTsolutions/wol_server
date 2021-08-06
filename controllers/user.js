const router = require('express').Router()
const { UniqueConstraintError } = require('sequelize/lib/errors')
const { UserModel } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

/*************
 * REGISTER *
 ************/
router.post('/register', async (req, res) => {
  let { username, passwordhash } = req.body.user

  try {
    const User = await UserModel.create({
      username,
      passwordhash: bcrypt.hashSync(passwordhash, 13),
    })

    let token = jwt.sign(
      { id: User.id, passwordhash: bcrypt.hashSync(passwordhash, 13) },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 24 }
    )
    res.status(201).json({
      message: 'User successfully created.',
      user: User,
      sessionToken: token,
    })
  } catch (err) {
    err instanceof UniqueConstraintError
      ? res.status(409).json({
          message: 'Username already in use',
        })
      : res.status(500).json({
          message: 'Failed to register user',
          error: err,
        })
  }
})

/***********
 * LOGIN *
 **********/
router.post('/login', async (req, res) => {
  let { username, passwordhash } = req.body.user

  try {
    const loginUser = await UserModel.findOne({
      where: { username: username },
    })
    if (loginUser) {
      let passwordComparison = await bcrypt.compare(
        passwordhash,
        loginUser.passwordhash
      )

      if (passwordComparison) {
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        })
        res.status(200).json({
          message: 'Login successful.',
          user: loginUser,
          sessionToken: token,
        })
      } else {
        res.status(401).json({
          message: 'Incorrect username or password',
        })
      }
    } else {
      res.status(401).json({ message: 'Login failed. User not found.' })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Failed to login user',
      error: err,
    })
  }
})

module.exports = router
