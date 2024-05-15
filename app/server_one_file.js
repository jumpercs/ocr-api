const Tesseract = require('tesseract.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Carregue as variáveis de ambiente do .env

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do multer para o upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/'); // Use UPLOAD_DIR do .env
  },
  filename: (req, file, cb) => {
    const extensaoArquivo = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensaoArquivo}`);
  }
});
const upload = multer({ storage: storage });

// Função para validar a extensão do arquivo
const validarExtensaoArquivo = (arquivo) => {
  const extensoesPermitidas = ['.png', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp'];
  const extensaoArquivo = path.extname(arquivo.originalname).toLowerCase();
  return extensoesPermitidas.includes(extensaoArquivo);
};

app.post('/upload', upload.single('imagem'), async (req, res) => {
  try {
    // Validações
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

    // OCR
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'por',
      { logger: m => console.log(`Tesseract: ${m}`) }
    );
    const palavraExtraida = text.trim().toLowerCase();
    const palavraOriginalMinuscula = texto.trim().toLowerCase();
    const coincidencia = palavraExtraida === palavraOriginalMinuscula;

    // Remover o arquivo após o processamento (opcional)
    // fs.unlinkSync(imagePath);

    res.json({
      texto,
      textoExtraido: palavraExtraida,
      coincidencia
    });
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('Erro ao processar OCR:', error);
    if (error.code === 'ENOENT') {
      return res.status(400).json({ error: 'Arquivo de imagem não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao processar OCR.' });
  }
});

// Rota para servir arquivos estáticos (imagens)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads/')); // Use UPLOAD_DIR do .env

const PORT = process.env.PORT || 7000; // Use PORT do .env
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}!`);
});

module.exports = app;