const mongoose = require('mongoose')

const decksSchema = mongoose.Schema({
  _id: {type: String},
  shareCode: {type: String},
  owner: {type: String},
  name: {type: String},
  colorKey:{type: Number},
  bannerKey:{type: Number},
  cards: {type: Array, default: []}
})

const decksModel = mongoose.model("deck", decksSchema)
module.exports = decksModel
