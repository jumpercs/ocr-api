const path = require('path');

function validarExtensaoArquivo(arquivo) {
  const extensoesPermitidas = ['.png', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp'];
  const extensaoArquivo = path.extname(arquivo.originalname).toLowerCase();
  return extensoesPermitidas.includes(extensaoArquivo);
}

module.exports = { validarExtensaoArquivo };