const mongoose = require('mongoose')

const usuariosSchema = mongoose.Schema({
  _id: {type: String},
  password: {type: String},
})

const usuariosModel = mongoose.model("usuario", usuariosSchema)
module.exports = usuariosModel
