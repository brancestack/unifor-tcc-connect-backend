const ticketRepository = require("../repositories/ticketRepository")

class TicketService {
  constructor() {
    this.validStatus = [
      "PENDENTE",
      "EM_REVISAO",
      "EM_CORRECAO",
      "AJUSTES_NECESSARIOS",
      "APROVADO",
      "FECHADO"
    ]
  }

  async getAllTickets() {
    return await ticketRepository.findAll()
  }

  async getTicketById(id) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    return ticket
  }

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

    const ticket = {
      titulo: data.titulo,
      descricao: data.descricao,
      tema: data.tema,
      curso: data.curso,
      aluno: data.aluno,
      status: "PENDENTE",
      versao: 1,
      bibliotecarioResponsavel: null
    }

    return await ticketRepository.create(ticket)
  }

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

    return await ticketRepository.updateStatusWithHistory(
      id,
      status
    )
  }

  async assignBibliotecario(id, bibliotecario) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!bibliotecario) {
      throw new Error("Bibliotecário é obrigatório")
    }

    return await ticketRepository.update(id, {
      bibliotecarioResponsavel: bibliotecario,
      dataAtribuicao: new Date()
    })
  }

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

    return await ticketRepository.createFeedbackAndUpdateVersion(id, {
      bibliotecario: data.bibliotecario,
      comentario: data.comentario,
      arquivoUrl: null,
      novaVersao: (ticket.versao || 1) + 1
    })
  }

  async uploadTccFile(id, file) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!file) {
      throw new Error("Arquivo PDF é obrigatório")
    }

    if (ticket.status === "FECHADO") {
      throw new Error("Não é possível enviar arquivo para ticket fechado")
    }

    const arquivos = ticket.historicoArquivos || []

    const versaoArquivo =
      arquivos.filter(arquivo => arquivo.tipo === "TCC").length + 1

    const arquivo = {
      tipo: "TCC",
      versao: versaoArquivo,
      nomeOriginal: file.originalname,
      nomeArquivo: file.filename,
      caminho: file.path,
      url: `/uploads/tccs/${file.filename}`,
      uploadedAt: new Date()
    }

    await ticketRepository.createArquivoHistorico(id, arquivo)

    await ticketRepository.update(id, {
      versao: versaoArquivo
    })

    return arquivo
  }

  async uploadFeedbackFile(id, file, data) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!file) {
      throw new Error("Arquivo PDF de feedback é obrigatório")
    }

    if (ticket.status === "FECHADO") {
      throw new Error("Não é possível enviar feedback para ticket fechado")
    }

    const arquivos = ticket.historicoArquivos || []

    const versaoArquivo =
      arquivos.filter(arquivo => arquivo.tipo === "FEEDBACK").length + 1

    const arquivo = {
      tipo: "FEEDBACK",
      versao: versaoArquivo,
      bibliotecario: data.bibliotecario || null,
      comentario: data.comentario || null,
      nomeOriginal: file.originalname,
      nomeArquivo: file.filename,
      caminho: file.path,
      url: `/uploads/feedbacks/${file.filename}`,
      uploadedAt: new Date()
    }

    await ticketRepository.createArquivoHistorico(id, arquivo)

    let feedback = null

    if (data.comentario || data.bibliotecario) {
      feedback = await ticketRepository.createFeedbackAndUpdateVersion(id, {
        bibliotecario: data.bibliotecario || "Bibliotecário",
        comentario: data.comentario || "Arquivo de feedback enviado.",
        arquivoUrl: arquivo.url,
        novaVersao: ticket.versao || 1
      })
    }

    return {
      ...arquivo,
      feedback
    }
  }

  async deleteTicket(id) {
    const deleted = await ticketRepository.delete(id)

    if (!deleted) {
      throw new Error("Ticket não encontrado")
    }

    return true
  }
}

module.exports = new TicketService()