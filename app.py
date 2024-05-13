
import pytesseract 
from PIL import Image
import io
from flask import Flask, render_template, request, send_file
import base64 # Importar a biblioteca base64
import cv2 
import numpy as np




# Configurar o Tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"



# Função para verificar palavra com OCR
def verificar_palavra(imagem, palavra_correta):
    print(palavra_correta)
    texto_ocr = pytesseract.image_to_string(imagem, lang="por", config="--psm 6", output_type=pytesseract.Output.STRING, timeout=10)
    texto_ocr_dict = pytesseract.image_to_data(imagem, lang="por", config="--psm 6", output_type=pytesseract.Output.DICT, timeout=10)

    print(texto_ocr_dict)

    print(texto_ocr)
    
    # Armazenar a imagem em um arquivo PNG na pasta ./imagens
    nome_arquivo = "imagem_ocr.png"
    # imagem.save(f"./imagens/{nome_arquivo}")

    # Verificar se a palavra correta está no texto OCR
    if palavra_correta in texto_ocr:
        return True
    else:
        return False
    


app = Flask(__name__)

    
@app.route("/verificar", methods=["POST"])
def verificar():
    imagem_base64 = request.get_json()["imagem"]
    imagem_bytes = base64.b64decode(imagem_base64)
    imagem = Image.open(io.BytesIO(imagem_bytes))
    palavra_correta = request.get_json()["palavra"]
    index_palavra = request.get_json()["index"]
    if verificar_palavra(imagem, palavra_correta):
        nome_arquivo = f"imagem_{index_palavra}.png"
        imagem.save(f"imagens/{nome_arquivo}")

        # Retirar as partes inúteis da imagem, como o fundo
        imagem = cv2.cvtColor(np.array(imagem), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)
        _, threshold = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        imagem = Image.fromarray(cv2.cvtColor(imagem, cv2.COLOR_BGR2RGB))
        texto_ocr_dict = pytesseract.image_to_data(imagem, lang="por", config="--psm 6", output_type=pytesseract.Output.DICT, timeout=10)
        print(texto_ocr_dict)
        text_ocr = pytesseract.image_to_string(imagem, lang="por", config="--psm 6", output_type=pytesseract.Output.STRING, timeout=10)
        # antes de salvar, adicionar uma borda verde em volta de onde realmente há um texto na imagem
        # Encontrar a área que contém o texto
        text_boxes = []
        for i in range(len(texto_ocr_dict["text"])):
            if texto_ocr_dict["text"][i] != "":
                print(texto_ocr_dict["text"][i])
                x, y, w, h = texto_ocr_dict["left"][i], texto_ocr_dict["top"][i], texto_ocr_dict["width"][i], texto_ocr_dict["height"][i]
                text_boxes.append((x, y, x + w, y + h))
        
        # Encontrar as coordenadas do retângulo que contém todos os textos
        min_x = min([box[0] for box in text_boxes])
        min_y = min([box[1] for box in text_boxes])
        max_x = max([box[2] for box in text_boxes])
        max_y = max([box[3] for box in text_boxes])
        
        # Adicionar um padding mínimo para conter apenas o texto
        #avoid black padding
        min_x = max(0, min_x - 10)
        min_y = max(0, min_y - 10)
        max_x = min(imagem.width, max_x + 10)
        max_y = min(imagem.height, max_y + 10)

        # Recortar a imagem
        cropped_image = imagem.crop((min_x, min_y, max_x, max_y))

        #inverter as cores
        # cropped_image = ImageOps.invert(cropped_image)
        
        # Salvar a imagem recortada
        cropped_image.save(f"imagens/{nome_arquivo}")
        print(f"imagens/{nome_arquivo}")
        # return json
        jsonReponse = {
            "status": "ok",
            "index": index_palavra,
            "imagem": nome_arquivo
        }
        return jsonReponse
    else:
        return {
            "status": "erro",
            "index": index_palavra,
            "identified_text": text_ocr,
            "palavra_correta": palavra_correta
        }


if __name__ == "__main__":
    app.run(debug=True)