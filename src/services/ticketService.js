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

  getAllTickets() {
    return ticketRepository.findAll()
  }

  getTicketById(id) {
    const ticket = ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    return ticket
  }

  createTicket(data) {
    if (!data.titulo) {
      throw new Error("Título é obrigatório")
    }

    const existingTicket = ticketRepository
      .findAll()
      .find(ticket =>
        ticket.aluno === data.aluno &&
        ticket.status !== "APROVADO" &&
        ticket.status !== "FECHADO"
      )

    if (existingTicket) {
      throw new Error("Aluno já possui um ticket em andamento")
    }

    const ticket = {
      id: Date.now(),
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
      historico: [
        {
          status: "PENDENTE",
          data: new Date()
        }
      ],
      createdAt: new Date()
    }

    return ticketRepository.create(ticket)
  }

  updateStatus(id, status) {
    const ticket = ticketRepository.findById(id)

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

    ticket.historico.push({
      status,
      data: new Date()
    })

    return ticketRepository.update(id, { status })
  }

  assignBibliotecario(id, bibliotecario) {
    const ticket = ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!bibliotecario) {
      throw new Error("Bibliotecário é obrigatório")
    }

    return ticketRepository.update(id, {
      bibliotecarioResponsavel: bibliotecario
    })
  }

  addFeedback(id, data) {
    const ticket = ticketRepository.findById(id)

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

    const feedback = {
      id: Date.now(),
      bibliotecario: data.bibliotecario,
      comentario: data.comentario,
      createdAt: new Date()
    }

    ticket.feedbacks.push(feedback)

    ticket.versao += 1

    return feedback
  }

  uploadTccFile(id, file) {
    const ticket = ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!file) {
      throw new Error("Arquivo PDF é obrigatório")
    }

    if (ticket.status === "FECHADO") {
      throw new Error("Não é possível enviar arquivo para ticket fechado")
    }

    const versaoArquivo =
      ticket.arquivos.filter(arquivo => arquivo.tipo === "TCC").length + 1

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

    ticket.arquivos.push(arquivo)
    ticket.versao = versaoArquivo

    return arquivo
  }

  uploadFeedbackFile(id, file, data) {
    const ticket = ticketRepository.findById(id)

    if (!ticket) {
      throw new Error("Ticket não encontrado")
    }

    if (!file) {
      throw new Error("Arquivo PDF de feedback é obrigatório")
    }

    if (ticket.status === "FECHADO") {
      throw new Error("Não é possível enviar feedback para ticket fechado")
    }

    const versaoArquivo =
      ticket.arquivos.filter(arquivo => arquivo.tipo === "FEEDBACK").length + 1

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

    ticket.arquivos.push(arquivo)

    if (data.comentario || data.bibliotecario) {
      ticket.feedbacks.push({
        id: Date.now() + 1,
        bibliotecario: data.bibliotecario || "Bibliotecário",
        comentario: data.comentario || "Arquivo de feedback enviado.",
        arquivoUrl: arquivo.url,
        createdAt: new Date()
      })
    }

    return arquivo
  }

  deleteTicket(id) {
    const deleted = ticketRepository.delete(id)

    if (!deleted) {
      throw new Error("Ticket não encontrado")
    }

    return true
  }
}

module.exports = new TicketService()