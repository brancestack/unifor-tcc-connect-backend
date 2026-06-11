const express = require("express")

const router = express.Router()

const chatController =
  require("../controllers/chatController")

const {
  auth,
  authorizeRoles
} = require("../middlewares/authMiddleware")

router.get(
  "/tickets/:ticketId/messages",
  auth,
  authorizeRoles("ALUNO", "BIBLIOTECARIO", "ADMIN"),
  chatController.getMessages
)

router.post(
  "/tickets/:ticketId/messages",
  auth,
  authorizeRoles("ALUNO", "BIBLIOTECARIO", "ADMIN"),
  chatController.sendMessage
)

module.exports = router