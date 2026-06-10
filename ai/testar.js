import { GeminiService } from './GeminiService.js';

async function rodarTesteMultimodal() {
  const geminiService = new GeminiService();

  // Parâmetro 1: O prompt de texto digitado na caixinha da tela
  const promptDoUsuario = `
    Analise o TCC em anexo e faça uma avaliação crítica focando em:
    1. Clareza dos objetivos apresentados.
    2. Estrutura geral do documento.
    Deixe sua resposta formatada em tópicos claros.
  `;
  
  // Parâmetro 2: O caminho do arquivo PDF que queremos analisar
  const caminhoDoPdf = './teste.pdf'; 

  console.log('--- TESTANDO INTEGRAÇÃO MULTIMODAL (TEXTO + PDF) ---');
  console.log(`Prompt: "${promptDoUsuario.trim()}"`);
  console.log(`Arquivo alvo: ${caminhoDoPdf}\n`);
  console.log('Iniciando processamento...');

  try {
    // Chamada do método passando estritamente o prompt e o arquivo
    const respostaIa = await geminiService.analisarDocumentoComIA(promptDoUsuario, caminhoDoPdf);
    
    console.log('\n=== RESULTADO RETORNADO PELA IA ===\n');
    console.log(respostaIa);
    console.log('\n===================================\n');
  } catch (erro) {
    console.error('Ocorreu um erro ao rodar o teste:', erro.message);
  }
}

rodarTesteMultimodal();