const express = require("express")

const router = express.Router()

const ticketController =
  require("../controllers/ticketController")

const {
  auth,
  authorizeRoles
} = require("../middlewares/authMiddleware")

router.get(
  "/",
  auth,
  authorizeRoles("BIBLIOTECARIO", "ADMIN"),
  ticketController.getAll
)

router.get(
  "/:id",
  auth,
  authorizeRoles("ALUNO", "BIBLIOTECARIO", "ADMIN"),
  ticketController.getById
)

router.post(
  "/",
  auth,
  authorizeRoles("ALUNO", "ADMIN"),
  ticketController.create
)

router.patch(
  "/:id/status",
  auth,
  authorizeRoles("BIBLIOTECARIO", "ADMIN"),
  ticketController.updateStatus
)

router.patch(
  "/:id/assign",
  auth,
  authorizeRoles("ADMIN"),
  ticketController.assignBibliotecario
)

router.post(
  "/:id/feedback",
  auth,
  authorizeRoles("BIBLIOTECARIO", "ADMIN"),
  ticketController.addFeedback
)

router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  ticketController.delete
)

module.exports = router