const userService = require("../services/userService")

class UserController {

  getAll(req, res) {
    try {
      const users = userService.getAllUsers()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  getById(req, res) {
    try {
      const user = userService.getUserById(Number(req.params.id))
      return res.status(200).json(user)
    } catch (error) {
      return res.status(404).json({ message: error.message })
    }
  }

  create(req, res) {
    try {
      const user = userService.createUser(req.body)
      return res.status(201).json(user)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  update(req, res) {
    try {
      const user = userService.updateUser(
        Number(req.params.id),
        req.body
      )

      return res.status(200).json(user)
    } catch (error) {
      const status = error.message.includes("não encontrado") ? 404 : 400
      return res.status(status).json({ message: error.message })
    }
  }

  delete(req, res) {
    try {
      userService.deleteUser(Number(req.params.id))
      return res.status(204).send()
    } catch (error) {
      return res.status(404).json({ message: error.message })
    }
  }
}

module.exports = new UserController()