class TicketRepository {
  constructor() {
    this.tickets = []
  }

  findAll() {
    return this.tickets
  }

  findById(id) {
    return this.tickets.find(ticket => ticket.id === id)
  }

  create(ticket) {
    this.tickets.push(ticket)
    return ticket
  }

  update(id, data) {
    const ticket = this.findById(id)

    if (!ticket) return null

    Object.assign(ticket, data)

    return ticket
  }

  delete(id) {
    const index = this.tickets.findIndex(
      ticket => ticket.id === id
    )

    if (index === -1) return false

    this.tickets.splice(index, 1)

    return true
  }
}

module.exports = new TicketRepository()