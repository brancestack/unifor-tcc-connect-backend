import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// CORREÇÃO: Nome da classe alterado para AIService
export class AIService {
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
      console.log(`1. Fazendo upload do PDF (${caminhoArquivoPdf}) para os servidores do Gemini...`);
      
      const uploadResult = await this.ai.files.upload({
        file: caminhoArquivoPdf,
        mimeType: 'application/pdf',
      });

      console.log(`Upload concluído! URI temporária do arquivo: ${uploadResult.uri}`);
      console.log('2. Enviando o prompt junto com o arquivo para análise do modelo...');

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          {
            fileData: {
              fileUri: uploadResult.uri,
              mimeType: uploadResult.mimeType,
            },
          },
          promptTexto,
        ],
      });

      console.log('3. Resposta gerada com sucesso.');
      return response.text;

    } catch (error) {
      console.error('Erro na integração multimodal do Gemini:', error);
      throw new Error('Falha ao processar arquivo e texto na IA: ' + error.message);
    }
  }
}