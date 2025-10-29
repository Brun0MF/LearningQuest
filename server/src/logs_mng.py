def print_error(title,text):
    print(f"\033[96m[\033[93m{title}\033[96m] \033[96m(\033[91mError\033[96m)\033[0m {text}")

def print_success(title,text):
    print(f"\033[96m[\033[93m{title}\033[96m] (\033[92mSuccess\033[96m)\033[0m {text}")

def print_info(title,text):
    print(f"\033[96m[\033[93m{title}\033[96m] (\033[94mInfo\033[96m)\033[0m {text}")

def print_default(title,text):
    print(f"\033[96m[\033[93m{title}\033[96m]\033[0m {text}")
