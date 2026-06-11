const express = require("express")

const router = express.Router()

const userController =
  require("../controllers/userController")

const {
  auth,
  authorizeRoles
} = require("../middlewares/authMiddleware")

router.get(
  "/",
  auth,
  authorizeRoles("ADMIN"),
  userController.getAll
)

router.get(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  userController.getById
)

router.post(
  "/",
  auth,
  authorizeRoles("ADMIN"),
  userController.create
)

router.put(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  userController.update
)

router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  userController.delete
)

module.exports = router