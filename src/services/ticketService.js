const ticketRepository = require("../repositories/ticketRepository")

class TicketService {
  constructor() {
    this.validStatus = [
      "PENDENTE",
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
      bibliotecarioResponsavel: null,
      arquivos: [],
      feedbacks: [],
      mensagens: [],
      historico: [
        {
          status: "PENDENTE",
          data: new Date()
        }
      ],
      createdAt: new Date()
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

    const historico = ticket.historico || []

    historico.push({
      status,
      data: new Date()
    })

    return await ticketRepository.update(id, {
      status,
      historico
    })
  }

  async assignBibliotecario(id, bibliotecario) {
    const ticket = await ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!bibliotecario) {
      throw new Error("Bibliotecário é obrigatório")
    }

    const historico = ticket.historico || []

    historico.push({
      acao: "ATRIBUICAO_BIBLIOTECARIO",
      bibliotecarioAnterior: ticket.bibliotecarioResponsavel || null,
      bibliotecarioNovo: bibliotecario,
      data: new Date()
    })

    return await ticketRepository.update(id, {
      bibliotecarioResponsavel: bibliotecario,
      historico
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

    const feedbacks = ticket.feedbacks || []

    const feedback = {
      id: Date.now(),
      bibliotecario: data.bibliotecario,
      comentario: data.comentario,
      createdAt: new Date()
    }

    feedbacks.push(feedback)

    await ticketRepository.update(id, {
      feedbacks,
      versao: (ticket.versao || 1) + 1
    })

    return feedback
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

    const arquivos = ticket.arquivos || []

    const versaoArquivo =
      arquivos.filter(arquivo => arquivo.tipo === "TCC").length + 1

    const arquivo = {
      id: Date.now(),
      tipo: "TCC",
      versao: versaoArquivo,
      nomeOriginal: file.originalname,
      nomeArquivo: file.filename,
      caminho: file.path,
      url: `/uploads/tccs/${file.filename}`,
      uploadedAt: new Date()
    }

    arquivos.push(arquivo)

    await ticketRepository.update(id, {
      arquivos,
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

    const arquivos = ticket.arquivos || []
    const feedbacks = ticket.feedbacks || []

    const versaoArquivo =
      arquivos.filter(arquivo => arquivo.tipo === "FEEDBACK").length + 1

    const arquivo = {
      id: Date.now(),
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

    arquivos.push(arquivo)

    if (data.comentario || data.bibliotecario) {
      feedbacks.push({
        id: Date.now() + 1,
        bibliotecario: data.bibliotecario || "Bibliotecário",
        comentario: data.comentario || "Arquivo de feedback enviado.",
        arquivoUrl: arquivo.url,
        createdAt: new Date()
      })
    }

    await ticketRepository.update(id, {
      arquivos,
      feedbacks
    })

    return arquivo
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