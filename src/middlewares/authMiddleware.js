function auth(req, res, next) {
  /*
    Middleware reservado para autenticação JWT.

    Futuramente:
    1. Ler o token do header Authorization
    2. Validar com jsonwebtoken
    3. Adicionar o usuário em req.user
    4. Liberar a rota com next()
  */

  return next()
}

module.exports = auth