const authService = require("../services/authService")

class AuthController {

  register(req, res) {

    try {

      const user =
        authService.register(req.body)

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role
        }
      })

    } catch (error) {

      return res.status(400).json({
        message: error.message
      })

    }
  }

  login(req, res) {

    try {

      const { email, senha } = req.body

      const result =
        authService.login(email, senha)

      return res.status(200).json(result)

    } catch (error) {

      return res.status(401).json({
        message: error.message
      })

    }
  }

  me(req, res) {

    return res.status(200).json({
      user: req.user
    })
  }
}

module.exports = new AuthController()