const { GoogleGenAI } = require("@google/genai")
require("dotenv").config()

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não configurada no .env")
    }

    this.ai = new GoogleGenAI({
      apiKey
    })

    this.modelName = "gemini-2.5-flash"
  }

  async analisarDocumentoComIA(promptTexto, caminhoArquivoPdf) {
    try {
      const uploadResult = await this.ai.files.upload({
        file: caminhoArquivoPdf,
        mimeType: "application/pdf"
      })

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          {
            fileData: {
              fileUri: uploadResult.uri,
              mimeType: uploadResult.mimeType
            }
          },
          promptTexto
        ]
      })

      return response.text
    } catch (error) {
      console.error("Erro na integração multimodal do Gemini:", error)

      if (
        error.message.includes("503") ||
        error.message.includes("UNAVAILABLE")
      ) {
        return `
Análise temporariamente indisponível devido à alta demanda do Gemini.

Sugestões simuladas para revisão:
1. Verificar se o sumário segue a estrutura exigida pela ABNT.
2. Conferir se as referências estão padronizadas.
3. Revisar margens, espaçamento e fonte.
4. Confirmar se citações diretas e indiretas estão formatadas corretamente.
5. Validar capa, folha de rosto e elementos pré-textuais.
`
      }

      throw new Error(
        "Falha ao processar arquivo e texto na IA: " + error.message
      )
    }
  }
}

module.exports = new AIService()