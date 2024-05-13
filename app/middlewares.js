const multer = require('multer');
const path = require('path');

function configurarUpload(req, res, next) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.UPLOAD_DIR || 'uploads/');
    },
    filename: (req, file, cb) => {
      const extensaoArquivo = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensaoArquivo}`);
    }
  });

  const upload = multer({ storage: storage });

  upload.single('imagem')(req, res, (err) => {
    if (err) {
      console.error('Erro durante o upload:', err);
      return res.status(500).json({ error: 'Erro ao processar o upload.' });
    }
    next();
  });
}

module.exports = { configurarUpload };