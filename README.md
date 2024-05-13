# OCR API com Tesseract.js

Este projeto consiste em uma API Node.js que utiliza a biblioteca Tesseract.js para realizar o reconhecimento óptico de caracteres (OCR) em imagens. A API recebe uma imagem e um texto como entrada, extrai o texto da imagem usando OCR e verifica se ele coincide com o texto fornecido.

## Funcionalidades

- Realiza o upload de uma imagem e extrai o texto presente.
- Compara o texto extraído da imagem com um texto fornecido como entrada.
- Retorna o resultado da comparação, indicando se os textos coincidem.

## Tecnologias Utilizadas

- Node.js
- Express.js
- Tesseract.js
- Multer
- Jest
- Docker
- Nginx

## Inicialização e Execução

A maneira mais fácil de iniciar a aplicação é utilizando Docker Compose.

1. Clone o repositório:

```bash
git clone https://github.com/jumpercs/ocr-api.git
```

2. Navegue até o diretório do projeto:

```bash
cd ocr-api
```

3. Inicie a aplicação com Docker Compose:

```bash
docker-compose up -d
```

4. Acesse a API em http://localhost:8080.

## Rotas da API

- **POST /upload**

  - Endpoint para enviar a imagem e o texto para comparação.
  - Parâmetros:
    - `imagem`: Arquivo de imagem (PNG, JPG, JPEG).
    - `texto`: Texto a ser comparado com o texto extraído da imagem.
  - Resposta:
    - `texto`: Texto fornecido como entrada.
    - `textoExtraido`: Texto extraído da imagem.
    - `coincidencia`: Booleano indicando se os textos coincidem.



## Testes

Testes unitários e de integração foram escritos usando Jest. Para executar os testes:

```bash
docker-compose run --rm ocr-api npm test
```

## Estrutura do Projeto

- **`server.js`**: Contém a lógica principal do servidor Express.
- **`routes.js`**: Define as rotas da API.
- **`controllers.js`**: Contém a lógica de processamento das requisições.
- **`middlewares.js`**: Contém a configuração do Multer para lidar com o upload de arquivos.
- **`ocr.js`**: Contém a função para realizar o OCR com Tesseract.js.
- **`utils.js`**: Contém funções utilitárias, como a validação de extensão de arquivo.
- **`Dockerfile`**: Define a imagem Docker da aplicação.
- **`docker-compose.yml`**: Define os serviços da aplicação com Docker Compose, incluindo o proxy reverso Nginx.
- **`nginx.conf`**: Define a configuração do servidor proxy Nginx.

## Observações

- Certifique-se de ter o Docker e o Docker Compose instalados em seu sistema.
- O Docker Compose irá criar automaticamente a pasta uploads dentro do container.

## Licença

Este projeto está sob a licença MIT.