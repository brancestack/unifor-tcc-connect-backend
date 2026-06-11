const jwt = require("jsonwebtoken")

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "unifor_tcc_connect_secret"

function auth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado"
    })
  }

  const parts = authHeader.split(" ")

  if (parts.length !== 2) {
    return res.status(401).json({
      message: "Token mal formatado"
    })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      message: "Formato de token inválido"
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    req.user = decoded

    return next()
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado"
    })
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado"
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Acesso negado para este perfil"
      })
    }

    return next()
  }
}

module.exports = {
  auth,
  authorizeRoles
}