import logs_mng
import subprocess
import sys
import time
import platform
import requests
import os
import json

IPFS_API = "http://127.0.0.1:5001/api/v0"
IPFS_BIN = "ipfs.exe" if platform.system().lower() == "windows" else "ipfs"

def check_ipfs_installed():
    if not os.path.exists(IPFS_BIN):
        logs_mng.print_error("IPFS", f"{IPFS_BIN} not found in project folder.")
        sys.exit(1)

    try:
        result = subprocess.run([IPFS_BIN, "--version"], capture_output=True, text=True, check=True)
        logs_mng.print_success("IPFS", f"Found: {result.stdout.strip()}")
    except subprocess.CalledProcessError:
        logs_mng.print_error("IPFS", "Failed to execute IPFS binary.")
        sys.exit(1)

def start_ipfs_daemon():
    system = platform.system().lower()
    logs_mng.print_info("IPFS", "Starting IPFS daemon in background...")

    if "windows" in system:
        si = subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        subprocess.Popen(
            [IPFS_BIN, "daemon"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            startupinfo=si,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )
    else:
        subprocess.Popen(
            [IPFS_BIN, "daemon"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def wait_for_ipfs_ready(timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.post(f"{IPFS_API}/version", timeout=2)
            if r.status_code == 200:
                logs_mng.print_success("IPFS", "IPFS API is ready.")
                return True
        except requests.exceptions.RequestException:
            pass
        time.sleep(1)

    logs_mng.print_error("IPFS", "IPFS daemon did not respond in time.")
    return False


def ensure_ipfs_running():
    try:
        r = requests.post(f"{IPFS_API}/version", timeout=2)
        if r.status_code == 200:
            logs_mng.print_success("IPFS", "IPFS API already running.")
            return
    except requests.exceptions.RequestException:
        logs_mng.print_info("IPFS", "IPFS API not reachable, starting daemon...")
        start_ipfs_daemon()
        if not wait_for_ipfs_ready():
            sys.exit(1)



def ipfs_add_json(data,filename="data.json"):
    try:
        res = requests.post(
            f"{IPFS_API}/add",
            files={"file": (filename, json.dumps(data))},
            timeout=15,
        )
        res.raise_for_status()
        cid = res.json().get("Hash")
        logs_mng.print_success("IPFS", f"Added JSON({filename}) with CID: {cid}")
        return cid
    except Exception as e:
        logs_mng.print_error("IPFS", f"Failed to add JSON({filename}): {e}")
        return None


def ipfs_get_json(cid):
    try:
        res = requests.post(f"{IPFS_API}/cat", params={"arg": cid}, timeout=15)
        res.raise_for_status()
        return json.loads(res.text)
    except Exception as e:
        logs_mng.print_error("IPFS", f"Failed to retrieve JSON: {e}")
        return None



def init():
    check_ipfs_installed()
    ensure_ipfs_running()




