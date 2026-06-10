// CORREÇÃO: Agora importamos o AIService.js
import { AIService } from './AIService.js';

async function rodarTesteMultimodal() {
  // CORREÇÃO: Instanciamos a classe com o novo nome
  const aiService = new AIService();

  const promptDoUsuario = `
    Analise o TCC em anexo e faça uma avaliação crítica focando em:
    1. Clareza dos objetivos apresentados.
    2. Estrutura geral do documento.
    Deixe sua resposta formatada em tópicos claros.
  `;
  
  // ATENÇÃO: Como o teste vai rodar de dentro de src/ai, ele precisa achar o PDF.
  // Garanta que existe um arquivo chamado 'teste.pdf' dentro da pasta 'src/ai/'
  const caminhoDoPdf = './teste.pdf'; 

  console.log('--- TESTANDO INTEGRAÇÃO MULTIMODAL (TEXTO + PDF) ---');
  console.log(`Prompt: "${promptDoUsuario.trim()}"`);
  console.log(`Arquivo alvo: ${caminhoDoPdf}\n`);
  console.log('Iniciando processamento...');

  try {
    // CORREÇÃO: Chamamos o método usando o novo objeto aiService
    const respostaIa = await aiService.analisarDocumentoComIA(promptDoUsuario, caminhoDoPdf);
    
    console.log('\n=== RESULTADO RETORNADO PELA IA ===\n');
    console.log(respostaIa);
    console.log('\n===================================\n');
  } catch (erro) {
    console.error('Ocorreu um erro ao rodar o teste:', erro.message);
  }
}

rodarTesteMultimodal();