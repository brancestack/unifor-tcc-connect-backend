const ticketRepository = require("../repositories/ticketRepository")

class DashboardService {

  getAnalytics() {
    const tickets = ticketRepository.findAll()

    return {
      totalTickets: tickets.length,
      pendentes: tickets.filter(t => t.status === "PENDENTE").length,
      emCorrecao: tickets.filter(t => t.status === "EM_CORRECAO").length,
      ajustesNecessarios: tickets.filter(t => t.status === "AJUSTES_NECESSARIOS").length,
      aprovados: tickets.filter(t => t.status === "APROVADO").length,
      fechados: tickets.filter(t => t.status === "FECHADO").length,
      totalArquivosTcc: tickets.reduce(
        (total, ticket) =>
          total + ticket.arquivos.filter(a => a.tipo === "TCC").length,
        0
      ),
      totalArquivosFeedback: tickets.reduce(
        (total, ticket) =>
          total + ticket.arquivos.filter(a => a.tipo === "FEEDBACK").length,
        0
      ),
      totalFeedbacks: tickets.reduce(
        (total, ticket) => total + ticket.feedbacks.length,
        0
      )
    }
  }
}

module.exports = new DashboardService()