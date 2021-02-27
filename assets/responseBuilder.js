function sendErrorResponse(res, message="") {
    res.status(500)
    res.send({ error: true, message: message })
}

function sendSuccessResponse(res, message="", data={}) {
    res.status(200)
    res.send({ error: false, message: message, data: data })
}

module.exports = {
    sendErrorResponse, sendSuccessResponse
}