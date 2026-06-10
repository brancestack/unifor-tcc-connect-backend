const express = require("express")

const router = express.Router()

const ticketController =
  require("../controllers/ticketController")

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Gerenciamento de TCCs
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Listar todos os tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista de tickets
 */
router.get(
  "/",
  ticketController.getAll
)

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Buscar ticket por ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket não encontrado
 */
router.get(
  "/:id",
  ticketController.getById
)

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Criar ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: TCC sobre IA
 *               descricao:
 *                 type: string
 *                 example: Primeira submissão do TCC
 *               tema:
 *                 type: string
 *                 example: Inteligência Artificial
 *               curso:
 *                 type: string
 *                 example: Ciência da Computação
 *               aluno:
 *                 type: string
 *                 example: Nicolas
 *     responses:
 *       201:
 *         description: Ticket criado
 *       400:
 *         description: Erro de validação
 */
router.post(
  "/",
  ticketController.create
)

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   patch:
 *     summary: Alterar status do ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: EM_CORRECAO
 *                 enum: [PENDENTE, EM_CORRECAO, AJUSTES_NECESSARIOS, APROVADO, FECHADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Ticket não encontrado
 */
router.patch(
  "/:id/status",
  ticketController.updateStatus
)

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   patch:
 *     summary: Atribuir bibliotecário responsável
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bibliotecario:
 *                 type: string
 *                 example: Maria
 *     responses:
 *       200:
 *         description: Bibliotecário atribuído
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Ticket não encontrado
 */
router.patch(
  "/:id/assign",
  ticketController.assignBibliotecario
)

/**
 * @swagger
 * /api/tickets/{id}/feedback:
 *   post:
 *     summary: Adicionar feedback ao ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bibliotecario:
 *                 type: string
 *                 example: Maria
 *               comentario:
 *                 type: string
 *                 example: Corrigir referências ABNT e sumário.
 *     responses:
 *       201:
 *         description: Feedback criado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Ticket não encontrado
 */
router.post(
  "/:id/feedback",
  ticketController.addFeedback
)

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Excluir ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Ticket excluído
 *       404:
 *         description: Ticket não encontrado
 */
router.delete(
  "/:id",
  ticketController.delete
)

module.exports = router