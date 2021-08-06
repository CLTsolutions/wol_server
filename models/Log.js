const { DataTypes } = require('sequelize')
const db = require('../db')

const Log = db.define('log', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter a description.',
      },
    },
  },
  definition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  result: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner_id: {
    type: DataTypes.INTEGER,
  },
})

module.exports = Log
