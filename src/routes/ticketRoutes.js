const express = require("express")

const router = express.Router()

const ticketController =
  require("../controllers/ticketController")

const {
  auth,
  authorizeRoles
} = require("../middlewares/authMiddleware")

const upload = require("../middlewares/uploadMiddleware")

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

router.post(
  "/:id/upload-tcc",
  auth,
  authorizeRoles("ALUNO", "ADMIN"),
  (req, res, next) => {
    req.uploadTipo = "TCC"
    next()
  },
  upload.single("arquivo"),
  ticketController.uploadTcc
)

router.post(
  "/:id/upload-feedback",
  auth,
  authorizeRoles("BIBLIOTECARIO", "ADMIN"),
  (req, res, next) => {
    req.uploadTipo = "FEEDBACK"
    next()
  },
  upload.single("arquivo"),
  ticketController.uploadFeedbackFile
)

router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  ticketController.delete
)

module.exports = router