# OCR API com Tesseract.js

Este projeto consiste em uma API Node.js que utiliza a biblioteca Tesseract.js para realizar o reconhecimento óptico de caracteres (OCR) em imagens. A API recebe uma imagem e um texto como entrada, extrai o texto da imagem e verifica se ele coincide com o texto fornecido.

## Funcionalidades

* Faz upload de uma imagem e extrai o texto contido nela.
* Compara o texto extraído da imagem com um texto fornecido como entrada.
* Retorna o resultado da comparação, indicando se os textos coincidem.

## Tecnologias Utilizadas

* Node.js
* Express.js
* Tesseract.js
* Multer
* Jest

## Instalação e Execução

1. Clone o repositório:

``git clone https://github.com/jumpercs/ocr-verify``

2. Instale as dependências:

`npm install`

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

PORT=7000
UPLOAD_DIR=uploads/


4. Inicie o servidor:

`npm start`
## Rotas da API

**POST /upload**

* Faz upload de uma imagem e extrai o texto contido nela.
* Parâmetros:
    * `imagem`: Arquivo de imagem (PNG, JPG, JPEG).
    * `texto`: Texto a ser comparado com o texto extraído da imagem.

* Resposta:
    * `texto`: Texto fornecido como entrada.
    * `textoExtraido`: Texto extraído da imagem.
    * `coincidencia`: Booleano indicando se os textos coincidem.

## Testes

Os testes unitários e de integração foram escritos usando Jest. Para executar os testes:

npm test
## Estrutura do Projeto

* **`server.js`**: Contém a lógica principal do servidor Express.
* **`routes.js`**: Define as rotas da API.
* **`controllers.js`**: Contém a lógica de processamento das requisições.
* **`middlewares.js`**: Contém a configuração do Multer para lidar com o upload de arquivos.
* **`ocr.js`**: Contém a função para realizar o OCR com Tesseract.js.
* **`utils.js`**: Contém funções utilitárias, como a validação de extensão de arquivo.

## Observações

* Certifique-se de ter o Tesseract OCR instalado em seu sistema.
* A pasta `uploads` deve ser criada manualmente na raiz do projeto.


## Licença

Este projeto está sob a licença MIT.