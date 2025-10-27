import logs_mng
import subprocess
import sys
from ollama import generate

model_name = "dolphin-llama3"


def check_ollama_installed():
    try:
        subprocess.run(["ollama", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logs_mng.print_success("AI","Ollama Found.")
    except FileNotFoundError:
        logs_mng.print_error("AI","Ollama is not installed.")
        sys.exit(1)
    except subprocess.CalledProcessError:
        logs_mng.print_error("AI","Failed to run Ollama.")
        sys.exit(1)

def check_ollama_running():
    try:
        result = subprocess.run(["ollama", "list"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logs_mng.print_success("AI","Ollama is Running!")
    except subprocess.CalledProcessError:
        logs_mng.print_error("AI","Ollama is not running or failed to respond.")
        sys.exit(1)

def check_model(model_name):
    try:
        result = subprocess.run(["ollama", "list"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if model_name not in result.stdout:
            logs_mng.print_error("AI",f"Model {model_name} not found. Installing...")
            install_result = subprocess.run(["ollama", "pull", model_name], check=True)
        logs_mng.print_success("AI","Model Ready!")
    except subprocess.CalledProcessError:
        logs_mng.print_error("AI",f"Failed to check or install model {model_name}.")
        sys.exit(1)


def init():
    check_ollama_installed()
    check_ollama_running()
    check_model(model_name)

def generate_question(topic, content, language):
    prompt = f'''
        És um gerador de Perguntas e Respostas sobre {topic}.
        Deves gerar as perguntas e respostas em {language}.
        Deves focar a seguinte materia letiva: {content}.
        Só pode haver uma resposta certa. Não pode haver pergunta com resposta multipla ou que gerem dúvidas.
        Só deves gerar 1 pergunta com 4 respostas.
        Deves responder APENAS com um JSON contendo APENAS as seguintes chaves: pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta.
        Na chave resposta, deve vir a letra correspondente(Exemplo: opcao_a A, opcao_b B,...).
        NOVAMENTE, APENAS DEVES RESPONDER COM O JSON E COM AQUELAS CHAVES, NADA MAIS, NADA MENOS.
    '''

    try:
        response = generate(model_name, prompt)
        logs_mng.print_default("AI",response['response'])
    except Exception as e:
        logs_mng.print_error("AI",f"Failed to generate response. {e}")
        sys.exit(1)


