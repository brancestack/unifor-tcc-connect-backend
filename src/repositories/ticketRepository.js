// src/repositories/ticketRepository.js

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

class TicketRepository {

  async findAll() {
    return await prisma.ticket.findMany({
      include: {
        feedbacks: true,
        historico: true,
        historicoArquivos: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  }

  async findById(id) {
    return await prisma.ticket.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        feedbacks: true,
        historico: true,
        historicoArquivos: true
      }
    })
  }

  async create(ticketData) {
    return await prisma.ticket.create({
      data: {
        titulo: ticketData.titulo,
        descricao: ticketData.descricao,
        tema: ticketData.tema,
        curso: ticketData.curso,
        aluno: ticketData.aluno,
        status: ticketData.status,
        versao: ticketData.versao,
        bibliotecarioResponsavel:
          ticketData.bibliotecarioResponsavel || null,

        historico: {
          create: {
            status: ticketData.status
          }
        }
      },
      include: {
        feedbacks: true,
        historico: true,
        historicoArquivos: true
      }
    })
  }

  async update(id, cleanData) {
    return await prisma.ticket.update({
      where: {
        id: Number(id)
      },
      data: cleanData,
      include: {
        feedbacks: true,
        historico: true,
        historicoArquivos: true
      }
    })
  }

  async updateStatusWithHistory(id, novoStatus) {
    return await prisma.ticket.update({
      where: {
        id: Number(id)
      },
      data: {
        status: novoStatus,

        historico: {
          create: {
            status: novoStatus
          }
        }
      },
      include: {
        feedbacks: true,
        historico: true,
        historicoArquivos: true
      }
    })
  }

  async createArquivoHistorico(id, arquivo) {
    return await prisma.historicoTicket.create({
      data: {
        ticketId: Number(id),
        versao: arquivo.versao,
        tipo: arquivo.tipo,
        nomeArquivo: arquivo.nomeArquivo,
        nomeOriginal: arquivo.nomeOriginal || null,
        caminho: arquivo.caminho || null,
        url: arquivo.url || null,
        observacoes: arquivo.comentario || null
      }
    })
  }

  async createFeedbackAndUpdateVersion(
    id,
    {
      bibliotecario,
      comentario,
      arquivoUrl,
      novaVersao
    }
  ) {

    const feedback = await prisma.feedback.create({
      data: {
        bibliotecario,
        comentario,
        arquivoUrl: arquivoUrl || null,

        ticket: {
          connect: {
            id: Number(id)
          }
        }
      }
    })

    await prisma.ticket.update({
      where: {
        id: Number(id)
      },
      data: {
        versao: novaVersao
      }
    })

    return feedback
  }

  async delete(id) {
    return await prisma.ticket.delete({
      where: {
        id: Number(id)
      }
    })
  }
}

module.exports = new TicketRepository()