const express = require("express")

const router = express.Router()

const dashboardController =
  require("../controllers/dashboardController")

const {
  auth,
  authorizeRoles
} = require("../middlewares/authMiddleware")

router.get(
  "/",
  auth,
  authorizeRoles("ADMIN"),
  dashboardController.getAnalytics
)

module.exports = router