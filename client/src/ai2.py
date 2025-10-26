from llama_cpp import Llama

# Carregar modelo com CUDA
llm = Llama(
    model_path=r"C:\Users\fmbru\Desktop\AI\src\DeepSeek-R1-0528-Qwen3-8B-Q8_0.gguf",
    n_ctx=8192,
    n_gpu_layers=-1,   # usa GPU
    verbose=False
)

def generateQuestion(lang, content):
    messages = [
        {
            "role": "system",
            "content": (
                "És um gerador de perguntas. "
                "Deves gerar perguntas de escolha unica e não ambigua."
                "Apenas deves responder no formato especificado. "
                "Nunca expliques, nunca reveles pensamentos internos, nunca comentes, nunca digas nada fora do template."
            )
        },
        {
            "role": "user",
            "content": f"""
Responde em {lang}. Gera uma pergunta (de um parágrafo) com 4 opções e 1 solução.
O Tema é Programação em C e apenas podes usar a matéria: {content}.
Segue **estritamente** este formato:

Q:<q>
A:<a>
B:<b>
C:<c>
D:<d>
R:<r>

Exemplo:
Q: Qual destas opções é uma declaração válida de variável inteira em C?
A: int x;
B: int = 5;
C: integer x;
D: char x
R:A

Agora gera a tua própria pergunta seguindo o mesmo formato.
"""
        }
    ]

    output = llm.create_chat_completion(
        messages=messages,
        max_tokens=512,
        temperature=0.7,
    )

    print(output["choices"][0]["message"]["content"])

generateQuestion("PT-PT", "variáveis, loops, input e output")
