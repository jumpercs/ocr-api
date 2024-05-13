const fs = require('fs');
const { validarExtensaoArquivo } = require('./utils');
const { extrairTextoDaImagem } = require('./ocr');

async function uploadImagem(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado.' });
    }

    if (!validarExtensaoArquivo(req.file)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Extensão de arquivo inválida. São permitidos apenas arquivos PNG, JPG e JPEG.' });
    }

    let { texto } = req.body;

    if (!texto) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'O campo "texto" é obrigatório.' });
    }

    if (typeof texto !== 'string') {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'O campo "texto" deve ser uma string.' });
    }

    if (texto.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'O campo "texto" não pode ser vazio.' });
    }

    if (texto.length > 100) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'O campo "texto" deve ter no máximo 100 caracteres.' });
    }

    const { path: imagePath } = req.file;

    console.log(`Processando imagem: ${imagePath}`);

    const palavraExtraida = await extrairTextoDaImagem(imagePath);

    const palavraOriginalMinuscula = texto.trim().toLowerCase();
    const coincidencia = palavraExtraida === palavraOriginalMinuscula;

    fs.unlinkSync(imagePath);

    res.json({
      texto,
      textoExtraido: palavraExtraida,
      coincidencia
    });

  } catch (error) {
    console.error('Erro ao processar OCR:', error);
    if (error.code === 'ENOENT') {
      return res.status(400).json({ error: 'Arquivo de imagem não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao processar OCR.' });
  }
}

module.exports = { uploadImagem };