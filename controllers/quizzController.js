const mongoose = require('mongoose')
const deckModel = require('../models/deckModel')
const AuthController = require('./authController')
const ResponseMessages = require('../assets/responseMessages')
const ResponseBuilder = require('../assets/responseBuilder')
const Tools = require('../assets/tools')

function createQuizz(req, res) {

  const mazos = req.body.mazos
  let numDePreguntas = req.body.numDePreguntas
  const usuario = req.body.user


  if (usuario.username === undefined || mazos === undefined || numDePreguntas === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.dataError)
  }

  else if (usuario.token === undefined) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenError)
  }

  else if (!AuthController.autentificarAccion(usuario.token)) {
    ResponseBuilder.sendErrorResponse(res, ResponseMessages.tokenExpired)
  }

  else {
    deckModel.aggregate([
      { "$match": { _id: { $in: Object.keys(mazos) } } },
      { "$unwind": "$cards" },
      { "$project": { "_id": 0, "deckId": "$_id", "deckName": "$name", "cardId": "$cards._id", "cardDetails": "$cards.details", "cardName": "$cards.name" } },
      { "$unwind": "$cardDetails" },
    ]).then((allDecksCards) => {
      if (allDecksCards.length === 0) {
        ResponseBuilder.sendErrorResponse(res, ResponseMessages.noCardsProvided)
      }
      else {

        let possibleAnswers = getPossibleAnswers(allDecksCards)
        let filteredCards = getFilteredCards(allDecksCards, mazos)
        let questions = []

        while (numDePreguntas !== 0 && filteredCards.length !== 0) {
          let card = filteredCards.pop()

          if(possibleAnswers[card.cardDetails.fact].size<=1) {continue}

          questions.push(getQuestionForCard(card, possibleAnswers))

          numDePreguntas --
        }

        if(questions.length ===0 ) {
          ResponseBuilder.sendErrorResponse(res, ResponseMessages.zeroQuestionsError(error.code))
        }

        ResponseBuilder.sendSuccessResponse(res, ResponseMessages.quizzCreatedSuccessfully, questions)
      }
    }).catch(error => {
      console.log(error)
      ResponseBuilder.sendErrorResponse(res, ResponseMessages.getMongoMessageByErrorCode(error.code))
    })
  }
}

function getQuestionForCard(card, possibleAnswers) {
  let numOptions = 3
  let options = [{correct:true, fact:card.cardDetails.fact, description:card.cardDetails.description}]
  let addedValues = []
  let setItems = Tools.shuffle(Array.from(possibleAnswers[card.cardDetails.fact].values()))

  while(numOptions !== 0) {
    let actualOption = setItems.pop()

    if(actualOption === undefined) {break}

    if(!Tools.compareAbsolute(card.cardDetails.description, actualOption, addedValues)) {
      options.push({correct:false, fact:card.cardDetails.fact, description:actualOption})
      addedValues.push(actualOption)
      numOptions --
    }

  }

  return {
    deckId: card.deckId, 
    deckName: card.deckName, 
    cardId: card.cardId,
    cardName: card.cardName, 
    options: Tools.shuffle(options)
  }
}

function getPossibleAnswers(allDecksCards) {

  possibleAnswers = {}
  allDecksCards.map(card => {
    possibleAnswers[card.cardDetails.fact] = possibleAnswers[card.cardDetails.fact] || new Set()
    possibleAnswers[card.cardDetails.fact].add(card.cardDetails.description)
  })

  return possibleAnswers
}

function getFilteredCards(allDecksCards, mazos) {
  let keys = []

  Object.keys(mazos).map(key => mazos[key] === true ? keys.push(key) : keys.push(...mazos[key]))

  return Tools.shuffle(allDecksCards.filter(card => keys.includes(card.deckId) || keys.includes(card.cardId)))
}

module.exports = {
  createQuizz
}

