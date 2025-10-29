import logs_mng
import requests
import subprocess
import sys
import time
import platform
import json

OLLAMA_HOST = "http://localhost:11434"
MODEL_NAME = "dolphin-llama3:latest"

def start_ollama_daemon():
    system = platform.system().lower()
    logs_mng.print_info("AI", "Starting Ollama daemon in background...")

    if "windows" in system:
        si = subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            startupinfo=si,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )
    else:
        subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

def wait_for_ollama_ready(timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get(f"{OLLAMA_HOST}/api/version", timeout=2)
            if r.status_code == 200:
                logs_mng.print_success("AI", "Ollama API is ready.")
                return True
        except requests.exceptions.RequestException:
            pass
        time.sleep(1)

    logs_mng.print_error("AI", "Ollama daemon did not respond in time.")
    return False

def ensure_ollama_running():
    try:
        r = requests.get(f"{OLLAMA_HOST}/api/version", timeout=2)
        if r.status_code == 200:
            logs_mng.print_success("AI", "Ollama API already running.")
            return
    except requests.exceptions.RequestException:
        logs_mng.print_info("AI", "Ollama API not reachable, starting daemon...")
        start_ollama_daemon()
        if not wait_for_ollama_ready():
            sys.exit(1)


def check_model(model_name):
    try:
        r = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5)
        r.raise_for_status()
        tags = r.json().get("models", [])
        installed_models = [m["name"] for m in tags]
        if model_name not in installed_models:
            logs_mng.print_info("AI", f"Model {model_name} not found. Pulling...")
            pull = requests.post(f"{OLLAMA_HOST}/api/pull", json={"name": model_name}, timeout=120)
            if pull.status_code == 200:
                logs_mng.print_success("AI", f"Model {model_name} installed successfully.")
            else:
                logs_mng.print_error("AI", f"Failed to pull model {model_name}. {pull.text}")
                sys.exit(1)
        else:
            logs_mng.print_success("AI", "Model Ready!")
    except requests.exceptions.RequestException as e:
        logs_mng.print_error("AI", f"Failed to check or install model. {e}")
        sys.exit(1)

def init():
    ensure_ollama_running()
    check_model(MODEL_NAME)

def generate_question(topic, content, language):
    json_exemplo = '{"pergunta":"Qual o tipo de variavel para armazenar numeros inteiros?","opcao_a":"float","opcao_b":"char","opcao_c":"int","opcao_d":"string","resposta":"C"}'
    prompt = f"""
    És um gerador de perguntas de escolha múltipla sobre {topic}.
    Deves escrever em {language}.
    O conteúdo das perguntas deve basear-se em: {content}.

    Regras obrigatorias:
    1. Gera exatamente 1 pergunta e 4 opções de resposta (opcao_a, opcao_b, opcao_c, opcao_d).
    2. Apenas uma opção deve ser totalmente correta e inequívoca.
    3. As restantes três opções devem estar claramente incorretas.
    4. A pergunta e as respostas não podem gerar dúvidas, interpretações ambíguas ou ter mais de uma resposta possível.
    5. Não adiciones explicações, textos adicionais ou comentários.
    Formata a resposta APENAS como um JSON com exatamente estas chaves:
    "pergunta", "opcao_a", "opcao_b", "opcao_c", "opcao_d", "resposta"
    Na chave "resposta", coloca apenas a letra correspondente à opção correta (exemplo: "A", "B", "C" ou "D").
    Exemplo:
    {json_exemplo}
    """

    REQUIRED_KEYS = ["pergunta", "opcao_a", "opcao_b", "opcao_c", "opcao_d", "resposta"]
    for x in range(1,4):
        try:
            logs_mng.print_info("AI", f"Generating question with model '{MODEL_NAME}'...")
            response = requests.post(
                f"{OLLAMA_HOST}/api/generate",
                json={"model": MODEL_NAME, "prompt": prompt,"stream": False},
                timeout=300,
            )
            if response.status_code == 200:
                data = response.json()
                text = data.get("response", "").strip()
                try:
                    json_output = json.loads(text.replace("\n",""))
                    missing_keys = [k for k in REQUIRED_KEYS if k not in json_output]
                    if missing_keys:
                        logs_mng.print_info("AI",f"Failed to generate a valid question. Trying again({x})...")
                        time.sleep(1)
                        continue
                    return json_output
                except json.JSONDecodeError as e:
                    logs_mng.print_info("AI",f"Failed to generate a valid question. Trying again({x})...")
                    time.sleep(1)
                    continue
            else:
                logs_mng.print_error("AI", f"Failed to generate question. {response.text}")
                sys.exit(1)
        except requests.exceptions.RequestException as e:
            logs_mng.print_error("AI", f"HTTP error: {e}")
            sys.exit(1)
    logs_mng.print_error("AI","Failed to generate a valid question after multiple attempts.")
    return None
