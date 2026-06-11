class UserRepository {

  constructor() {

    this.users = [
      {
        id: 1,
        nome: "Aluno Teste",
        email: "aluno@unifor.br",
        senha: "123",
        role: "ALUNO"
      },
      {
        id: 2,
        nome: "Bibliotecário Teste",
        email: "bibliotecario@unifor.br",
        senha: "123",
        role: "BIBLIOTECARIO"
      },
      {
        id: 3,
        nome: "Administrador",
        email: "admin@unifor.br",
        senha: "123",
        role: "ADMIN"
      }
    ]
  }

  findAll() {
    return this.users
  }

  findByEmail(email) {
    return this.users.find(
      user => user.email === email
    )
  }

  findById(id) {
    return this.users.find(
      user => user.id === id
    )
  }

  create(user) {
    this.users.push(user)
    return user
  }
}

module.exports = new UserRepository()