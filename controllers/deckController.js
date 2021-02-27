const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const deckModel = require('../models/deckModel')
const AuthController = require('./authController')
const ResponseMessages = require('../assets/responseMessages')
const ResponseBuilder = require('../assets/responseBuilder')

function crearDeck(req, res) {

  const usuario = req.body.user
  const deck = req.body.deck

  if (usuario.username === undefined || deck.name === undefined || deck.colorKey === undefined || deck.bannerKey === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (usuario.token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(usuario.token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }

  else {

    deck._id = uuid.v4()
    deck.shareCode = uuid.v4()
    deck.cards = []

    let newDeck = new deckModel({
      _id: deck._id,
      owner: usuario.username,
      name: deck.name,
      colorKey: deck.colorKey,
      bannerKey: deck.bannerKey
    })

    newDeck.save((error) => {
      if (error) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
      }
      else {
        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.createDeckSuccess, deck)
      }
    })
  }
}

function importDeck(req, res) {

  const usuario = req.body.user
  const deckShareCode = req.body.deckShareCode

  if (usuario.username === undefined || deckShareCode === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (usuario.token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(usuario.token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }

  else {
    deckModel.findOne({ shareCode: deckShareCode }).exec((error, deck) => {
      if (error) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
      }
      else {
        deck._id = uuid.v4()
        deck.shareCode = uuid.v4()
        deck.name = deck.name + " (importado)"
        deck.owner = usuario.username

        deckModel.insertMany(deck)

        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.importDeckSuccess, deck)
      }
    })
  }
}

function getDecks(req, res) {

  const username = req.params.username
  const token = req.params.token
  if (username === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }
  else {    
    deckModel.find({ owner: username }).then((decksDB) => {
      ResponseBuilder.sendSuccessResponse(res, "", decksDB)
    }).catch(error => {
      ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
    })
  }
}

function updateDeck(req, res) {

  const usuario = req.body.user
  const deck = req.body.deck

  if (usuario.username === undefined || deck.name === undefined || deck.colorKey === undefined || deck.bannerKey === undefined || deck._id === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (usuario.token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(usuario.token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }

  else {

    deckModel.findOneAndUpdate({ _id: deck._id }, { $set: deck }, { new: true }).exec((error, deck) => {
      if (error) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
      }
      else {
        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.updateDeckSucces, deck)
      }
    })
  }
}

function deleteDeck(req, res) {

  const username = req.params.username
  const token = req.params.token
  const deckId = req.params.deckId

  if (username === undefined || deckId === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }
  else {
    deckModel.deleteOne({ _id: deckId, owner: username }).then((result) => {
      if (result.deletedCount === 0) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.deleteDeckError)
      }
      else {
        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.deleteDeckSuccess)
      }
    }).catch(error => {
      ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
    })
  }
}

function createCard(req, res) {

  const deckId = req.body.deckId
  const card = req.body.card
  const usuario = req.body.user

  if (usuario.username === undefined || deckId === undefined || card.name === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (usuario.token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(usuario.token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }

  else {

    card._id = uuid.v4()

    deckModel.updateOne({ _id: deckId, owner: usuario.username }, { $push: { cards: card } }).then((result) => {
      if (result.nModified === 0) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.createCardError)
      }
      else {
        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.createCardSuccess, card)
      }
    }).catch(error => {
      ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
    })
  }
}

function updateCard(req, res) {

  const deckId = req.body.deckId
  const card = req.body.card
  const usuario = req.body.user

  if (usuario.username === undefined || deckId === undefined || card.name === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (usuario.token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(usuario.token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }

  else {
    deckModel.updateOne({ _id: deckId, owner: usuario.username, "cards._id": card._id }, { $set: { "cards.$": card } }).then((result) => {
      if (result.nModified === 0) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.updateCardError)
      }
      else {
        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.updateCardSuccess, card)
      }
    }).catch(error => {
      ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
    })
  }
}

function deleteCard(req, res) {

  const username = req.params.username
  const token = req.params.token
  const deckId = req.params.deckId
  const cardId = req.params.cardId

  if (username === undefined || deckId === undefined || cardId === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }
  else {
    deckModel.updateOne({ _id: deckId, owner: username }, { $pull: { cards: { _id: cardId } } }).then((result) => {
      if (result.deletedCount === 0) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.deleteCardError)
      }
      else {
        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.deleteCardSuccess)
      }
    }).catch(error => {
      console.log(error)
      ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
    })
  }
}


module.exports = {
  crearDeck, getDecks, updateDeck, deleteDeck, createCard, updateCard, deleteCard, importDeck
}



