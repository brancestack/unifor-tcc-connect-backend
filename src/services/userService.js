const userRepository = require("../repositories/userRepository")

class UserService {

  getAllUsers() {
    return userRepository.findAll().map(user => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role
    }))
  }

  getUserById(id) {
    const user = userRepository.findById(id)

    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role
    }
  }

  createUser(data) {
    if (!data.nome) {
      throw new Error("Nome é obrigatório")
    }

    if (!data.email) {
      throw new Error("Email é obrigatório")
    }

    if (!data.senha) {
      throw new Error("Senha é obrigatória")
    }

    const existingUser = userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new Error("Email já cadastrado")
    }

    const user = {
      id: Date.now(),
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      role: data.role || "ALUNO"
    }

    const createdUser = userRepository.create(user)

    return {
      id: createdUser.id,
      nome: createdUser.nome,
      email: createdUser.email,
      role: createdUser.role
    }
  }

  updateUser(id, data) {
    const user = userRepository.findById(id)

    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    Object.assign(user, data)

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role
    }
  }

  deleteUser(id) {
    const users = userRepository.findAll()

    const index = users.findIndex(user => user.id === id)

    if (index === -1) {
      throw new Error("Usuário não encontrado")
    }

    users.splice(index, 1)

    return true
  }
}

module.exports = new UserService()