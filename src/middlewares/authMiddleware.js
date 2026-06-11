<<<<<<< HEAD
const jwt = require("jsonwebtoken")

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "unifor_tcc_connect_secret"

function auth(req, res, next) {

  const authHeader =
    req.headers.authorization

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

    const decoded =
      jwt.verify(token, JWT_SECRET)

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
=======
// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// Chave secreta para assinar o token (garanta que ela exista no seu arquivo .env)
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";

async function auth(req, res, next) {
  // 1. Ler o token do header 'Authorization'
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token de acesso não fornecido." });
  }

  // O header geralmente vem no formato: "Bearer <TOKEN>", precisamos separar
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Padrão de token inválido (use Bearer)." });
  }

  const token = parts[1];

  try {
    // 2. Validar o token com o jsonwebtoken
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Buscar o usuário correspondente no banco MySQL para garantir que ele ainda existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        status: true
      }
    });

    if (!usuario) {
      return res.status(401).json({ message: "Usuário associado a este token não existe." });
    }

    if (usuario.status === "INATIVO") {
      return res.status(403).json({ message: "Este usuário está inativo no sistema." });
    }

    // 4. Adicionar o usuário em req.user para que os controllers saibam quem fez a requisição
    req.user = usuario;

    // 5. Liberar a rota para continuar
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

module.exports = auth;
>>>>>>> origin/feature/database
