const Tesseract = require('tesseract.js');

async function extrairTextoDaImagem(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'por',
      { logger: m => console.log(`Tesseract: ${m}`) }
    );
    return text.trim().toLowerCase();
  } catch (error) {
    console.error('Erro ao processar OCR:', error);
    throw error; 
  }
}

module.exports = { extrairTextoDaImagem }; 