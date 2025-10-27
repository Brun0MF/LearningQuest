import subprocess
import sys
from ollama import generate

def check_ollama_installed():
    try:
        subprocess.run(["ollama", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        print("Error: Ollama is not installed.")
        sys.exit(1)
    except subprocess.CalledProcessError:
        print("Error: Failed to run Ollama.")
        sys.exit(1)

def check_ollama_running():
    try:
        result = subprocess.run(["ollama", "list"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # Se correr sem erros, assume-se que o serviço está a correr
    except subprocess.CalledProcessError:
        print("Error: Ollama is not running or failed to respond.")
        sys.exit(1)

def check_model(model_name):
    try:
        result = subprocess.run(["ollama", "list"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if model_name not in result.stdout:
            print(f"Model {model_name} not found. Installing...")
            install_result = subprocess.run(["ollama", "pull", model_name], check=True)
    except subprocess.CalledProcessError:
        print(f"Error: Failed to check or install model {model_name}.")
        sys.exit(1)

def main():
    model_name = "dolphin-llama3"
    
    check_ollama_installed()
    check_ollama_running()
    check_model(model_name)

    try:
        response = generate(model_name, "Olá. Tudo bem?")
        print(response['response'])
    except Exception as e:
        print(f"Error: Failed to generate response. {e}")
        sys.exit(1)


main()
