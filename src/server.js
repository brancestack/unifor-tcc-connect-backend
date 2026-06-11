const express = require("express")
const cors = require("cors")
const path = require("path")

const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const ticketRoutes = require("./routes/ticketRoutes")
const authRoutes = require("./routes/authRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
)

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Unifor TCC Connect API",
      version: "1.0.0",
      description: "Sistema de Gestão de Revisões Normativas de TCC"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
}

const specs = swaggerJsdoc(options)

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
)

app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/dashboard", dashboardRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Unifor TCC Connect API"
  })
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})