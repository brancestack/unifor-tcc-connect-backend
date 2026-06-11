const aiService = require("../ai/AIService")

class AIController {

  async analisarDocumento(req, res) {
    try {
      const { prompt, caminhoArquivo } = req.body

      if (!prompt) {
        return res.status(400).json({
          message: "Prompt é obrigatório"
        })
      }

      if (!caminhoArquivo) {
        return res.status(400).json({
          message: "Caminho do arquivo é obrigatório"
        })
      }

      const resposta = await aiService.analisarDocumentoComIA(
        prompt,
        caminhoArquivo
      )

      return res.status(200).json({
        resposta
      })
    } catch (error) {
      return res.status(500).json({
        message: error.message
      })
    }
  }
}

module.exports = new AIController()