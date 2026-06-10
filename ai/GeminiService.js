import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: apiKey });
    this.modelName = 'gemini-2.5-flash'; 
  }

  /**
   * Método principal: Recebe o comando do bibliotecário e o caminho local de um PDF.
   */
  async analisarDocumentoComIA(promptTexto, caminhoArquivoPdf) {
    try {
      console.log(`Fazendo upload do PDF (${caminhoArquivoPdf}) para os servidores do Gemini...`);
      
      const uploadResult = await this.ai.files.upload({
        file: caminhoArquivoPdf,
        mimeType: 'application/pdf',
      });

      console.log(`Upload concluído! URI temporária do arquivo: ${uploadResult.uri}`);
      console.log('Enviando o prompt junto com o arquivo para análise do modelo...');

      // CORREÇÃO AQUI: Passamos a referência em formato estruturado que o novo SDK exige
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          {
            fileData: {
              fileUri: uploadResult.uri,
              mimeType: uploadResult.mimeType,
            },
          },
          promptTexto, // O seu texto de comando
        ],
      });

      console.log('Resposta gerada com sucesso.');
      return response.text;

    } catch (error) {
      console.error('Erro na integração multimodal do Gemini:', error);
      throw new Error('Falha ao processar arquivo e texto na IA: ' + error.message);
    }
  }
}