const chatService = require("../services/chatService")

class ChatController {

  getMessages(req, res) {
    try {
      const messages = chatService.getMessages(
        Number(req.params.ticketId)
      )

      return res.status(200).json(messages)
    } catch (error) {
      const status = error.message.includes("não encontrado") ? 404 : 400
      return res.status(status).json({ message: error.message })
    }
  }

  sendMessage(req, res) {
    try {
      const message = chatService.sendMessage(
        Number(req.params.ticketId),
        req.body,
        req.user
      )

      return res.status(201).json(message)
    } catch (error) {
      const status = error.message.includes("não encontrado") ? 404 : 400
      return res.status(status).json({ message: error.message })
    }
  }
}

module.exports = new ChatController()