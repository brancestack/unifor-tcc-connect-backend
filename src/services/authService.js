const jwt = require("jsonwebtoken")

const userRepository =
  require("../repositories/userRepository")

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "unifor_tcc_connect_secret"

class AuthService {

  register(data) {

    const existingUser =
      userRepository.findByEmail(
        data.email
      )

    if (existingUser) {
      throw new Error(
        "Email já cadastrado"
      )
    }

    const user = {
      id: Date.now(),
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      role: data.role || "ALUNO"
    }

    return userRepository.create(user)
  }

  login(email, senha) {

    const user =
      userRepository.findByEmail(email)

    if (!user) {
      throw new Error(
        "Credenciais inválidas"
      )
    }

    if (user.senha !== senha) {
      throw new Error(
        "Credenciais inválidas"
      )
    }

    const token =
      jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        JWT_SECRET,
        {
          expiresIn: "2h"
        }
      )

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    }
  }
}

module.exports = new AuthService()