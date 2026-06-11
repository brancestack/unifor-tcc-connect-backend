const ticketService = require("../services/ticketService")

class TicketController {

  async getAll(req, res) {
    try {
      const tickets = await ticketService.getAllTickets()
      return res.status(200).json(tickets)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getById(req, res) {
    try {
      const ticket = await ticketService.getTicketById(Number(req.params.id))
      return res.status(200).json(ticket)
    } catch (error) {
      return res.status(404).json({ message: error.message })
    }
  }

  async create(req, res) {
    try {
      const ticket = await ticketService.createTicket(req.body)
      return res.status(201).json(ticket)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  async updateStatus(req, res) {
    try {
      const ticket = await ticketService.updateStatus(
        Number(req.params.id),
        req.body.status
      )
      return res.status(200).json(ticket)
    } catch (error) {
      const status = error.message.includes("não encontrado") ? 404 : 400
      return res.status(status).json({ message: error.message })
    }
  }

  async assignBibliotecario(req, res) {
    try {
      const ticket = await ticketService.assignBibliotecario(
        Number(req.params.id),
        req.body.bibliotecario
      )
      return res.status(200).json(ticket)
    } catch (error) {
      const status = error.message.includes("não encontrado") ? 404 : 400
      return res.status(status).json({ message: error.message })
    }
  }

  async addFeedback(req, res) {
    try {
      const feedback = await ticketService.addFeedback(
        Number(req.params.id),
        req.body
      )
      return res.status(201).json(feedback)
    } catch (error) {
      const status = error.message.includes("não encontrado") ? 404 : 400
      return res.status(status).json({ message: error.message })
    }
  }

  async delete(req, res) {
    try {
      await ticketService.deleteTicket(Number(req.params.id))
      return res.status(204).send()
    } catch (error) {
      return res.status(404).json({ message: error.message })
    }
  }
}

module.exports = new TicketController()