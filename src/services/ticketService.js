const ticketRepository = require("../repositories/ticketRepository")

class TicketService {

  constructor() {
    this.validStatus = [
      "PENDENTE",
      "EM_REVISAO", // Adicionado para bater com o enum do seu Schema
      "EM_CORRECAO",
      "AJUSTES_NECESSARIOS",
      "APROVADO",
      "FECHADO"
    ]
  }

  // Adicionado async
  async getAllTickets() {
    return await ticketRepository.findAll()
  }

  // Adicionado async/await e correção de retorno
  async getTicketById(id) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    return ticket
  }

  // Reformulado para validar contra o banco de dados real
  async createTicket(data) {
    if (!data.titulo) {
      throw new Error("Título é obrigatório")
    }

    const allTickets = await ticketRepository.findAll()
    const existingTicket = allTickets.find(ticket =>
      ticket.aluno === data.aluno &&
      ticket.status !== "APROVADO" &&
      ticket.status !== "FECHADO"
    )

    if (existingTicket) {
      throw new Error("Aluno já possui um ticket em andamento")
    }

    // Passa apenas os campos limpos; o ID e as datas o MySQL gera sozinho
    return await ticketRepository.create({
      titulo: data.titulo,
      descricao: data.descricao,
      tema: data.tema,
      curso: data.curso,
      aluno: data.aluno,
      status: "PENDENTE",
      versao: 1
    })
  }

  // Atualizado para persistir o histórico diretamente no banco de dados
  async updateStatus(id, status) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (ticket.status === "FECHADO") {
      throw new Error("Ticket fechado não pode ser alterado")
    }

    if (ticket.status === status) {
      throw new Error("Ticket já está neste status")
    }

    if (!this.validStatus.includes(status)) {
      throw new Error("Status inválido")
    }

    // Atualiza o status e cria o registro de histórico de forma atômica
    return await ticketRepository.updateStatusWithHistory(id, status)
  }

  // Atualizado para salvar o responsável de forma assíncrona
  async assignBibliotecario(id, bibliotecario) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!bibliotecario) {
      throw new Error("Bibliotecário é obrigatório")
    }

    return await ticketRepository.update(id, {
      bibliotecarioResponsavel: bibliotecario
    })
  }

  // Atualizado para persistir o feedback e atualizar a versão de forma relacional
  async addFeedback(id, data) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (ticket.status === "FECHADO") {
      throw new Error("Não é possível adicionar feedback em ticket fechado")
    }

    if (!data.bibliotecario) {
      throw new Error("Bibliotecário é obrigatório")
    }

    if (!data.comentario) {
      throw new Error("Comentário é obrigatório")
    }

    // Cria o feedback e incrementa a versão do ticket (+1) diretamente
    return await ticketRepository.createFeedbackAndUpdateVersion(id, {
      bibliotecario: data.bibliotecario,
      comentario: data.comentario,
      novaVersao: ticket.versao + 1
    })
  }

  // Adicionado async/await
  async deleteTicket(id) {
    try {
      await ticketRepository.delete(id)
      return true
    } catch (error) {
      throw new Error("Ticket não encontrado")
    }
  }
}

module.exports = new TicketService()