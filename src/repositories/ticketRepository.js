// src/repositories/ticketRepository.js
const prisma = require('../../prisma.config');

class TicketRepository {
  
  async findAll() {
    return await prisma.ticket.findMany({
      include: {
        feedbacks: true,
        historico: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        feedbacks: true,
        historico: true
      }
    });
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
        // Cria automaticamente o histórico inicial na tabela 'historico_status'
        historico: {
          create: {
            status: ticketData.status
          }
        }
      },
      include: {
        feedbacks: true,
        historico: true
      }
    });
  }

  async update(id, cleanData) {
    return await prisma.ticket.update({
      where: { id: Number(id) },
      data: cleanData,
      include: {
        feedbacks: true,
        historico: true
      }
    });
  }

  // Método específico para atualizar Status e gerar o histórico na tabela simultaneamente
  async updateStatusWithHistory(id, novoStatus) {
    return await prisma.ticket.update({
      where: { id: Number(id) },
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
        historico: true
      }
    });
  }

  // Método específico para adicionar feedback e subir a versão do ticket no banco
  async createFeedbackAndUpdateVersion(id, { bibliotecario, comentario, novaVersao }) {
    return await prisma.feedback.create({
      data: {
        bibliotecario,
        comentario,
        ticket: {
          connect: { id: Number(id) }
        }
      }
    }).then(async (feedback) => {
      // Sincroniza e incrementa a versão do Ticket pai
      await prisma.ticket.update({
        where: { id: Number(id) },
        data: { versao: novaVersao }
      });
      return feedback;
    });
  }

  async delete(id) {
    return await prisma.ticket.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = new TicketRepository();