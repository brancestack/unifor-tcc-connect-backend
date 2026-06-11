const ticketRepository = require("../repositories/ticketRepository")

class ChatService {

  getMessages(ticketId) {
    const ticket = ticketRepository.findById(ticketId)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!ticket.mensagens) {
      ticket.mensagens = []
    }

    return ticket.mensagens
  }

  sendMessage(ticketId, data, user) {
    const ticket = ticketRepository.findById(ticketId)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (ticket.status === "FECHADO") {
      throw new Error("Não é possível enviar mensagem em ticket fechado")
    }

    if (!data.mensagem) {
      throw new Error("Mensagem é obrigatória")
    }

    if (!ticket.mensagens) {
      ticket.mensagens = []
    }

    const message = {
      id: Date.now(),
      ticketId,
      autorId: user.id,
      autorRole: user.role,
      mensagem: data.mensagem,
      createdAt: new Date()
    }

    ticket.mensagens.push(message)

    return message
  }
}

module.exports = new ChatService()