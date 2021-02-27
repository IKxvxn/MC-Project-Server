const unknownError = "Ha ocurrido un problema en el servidor. Inténtelo más tarde"
const dataError = "Los datos proporcionados presentan problemas"
const loginError = "La cuenta no existe o la contraseña proporcionada es incorrecta"
const tokenError = "Acceso denegado, es necesario que inicie sesión"
const tokenExpired = "La sesión ha expirado, por favor, vuelva a ingresar"
const deleteDeckError = "El mazo no ha podido ser eliminado"
const createCardError = "No se pudo crear la carta"
const updateCardError = "No se pudo modificar la carta"
const deleteCardError = "La carta no ha podido ser eliminada"
const noCardsProvided = "No se ha podido generar el quiz porque no se han suministrado cartas. Verifica que los mazos utilizados no están vacíos"
const zeroQuestionsError = "No se pudo crear el quiz. Aunque los mazos tenían cartas, estas no compartían atributos en común"

const importDeckSuccess = "Mazo importado con éxito"
const quizzCreatedSuccessfully = "Quiz listo, ¿preparado?"
const createAccountSuccess = "La cuenta se ha creado exitosamente"
const deleteDeckSuccess = "El mazo ha sido eliminado"
const deleteCardSuccess = "La carta ha sido eliminado"
const createDeckSuccess = "Mazo creado con éxito"
const createCardSuccess = "Carta creada con éxito"
const updateCardSuccess = "Carta modificada con éxito"
const updateDeckSucces = "Mazo modificado con éxito"
const loginSuccess = "Bienvenido nuevamente, "

const mongoMessages = {
    11000: "No se pudo crear la cuenta porque el nombre de usuario ya existe"
}

function getMongoMessageByErrorCode(code) {
    let message = mongoMessages[code]

    if (!message) { return unknownError }
    return message
}


module.exports = {
    getMongoMessageByErrorCode, importDeckSuccess, zeroQuestionsError, quizzCreatedSuccessfully, noCardsProvided, updateCardError, updateCardSuccess, deleteCardError, deleteCardSuccess, createCardError, unknownError, createAccountSuccess, dataError, loginError, loginSuccess, tokenError, createDeckSuccess, updateDeckSucces, deleteDeckError, deleteDeckSuccess, tokenExpired, createCardSuccess
}