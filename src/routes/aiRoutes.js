const express = require("express")

const router = express.Router()

const aiController =
  require("../controllers/aiController")

const {
  auth,
  authorizeRoles
} = require("../middlewares/authMiddleware")

router.post(
  "/analisar-documento",
  auth,
  authorizeRoles("BIBLIOTECARIO", "ADMIN"),
  aiController.analisarDocumento
)

module.exports = router