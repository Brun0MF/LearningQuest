#pip install gpt4all
from gpt4all import GPT4All
import os

model_path = r"C:\Users\fmbru\Desktop\AI\src\DeepSeek-R1-0528-Qwen3-8B-Q8_0.gguf"
model = GPT4All(model_path, allow_download=False)

def generateQuestion(lang, content):
    prompt = f'''
Responde em {lang}. Gera uma pergunta (de um parágrafo) com 4 opções e 1 solução.
O Tema é Programação em C e apenas podes usar a matéria: {content}.
Deves entender o seguinte:
       <q> -> pergunta
       <a> -> opção A
       <b> -> opção B
       <c> -> opção C 
       <d> -> opção D
       <r> -> letra correspondente à resposta certa 
A tua resposta deve seguir o seguinte template, nada além do template é permitido, não deves gerar nada além do pedido e fora do formato.
       Template de Resposta: Q:<q>\nA:<a>\nB:<b>\nC:<c>\nD:<d>\nR:<r>
NADA ALEM DO TEMPLATE, APENAS SUBSTITUI AS TAGS PELOS RESPETIVOS CAMPOS DA PERGUNTA QUE VAIS GERAR! NAO DEVES RESPONDER COM MAIS NADA!
'''
    
    with model.chat_session():
        response = model.generate(prompt, max_tokens=1024)
        print(response)

generateQuestion("PT-PT", "variáveis, loops, input e output")
