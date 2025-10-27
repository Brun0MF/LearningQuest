import ai_mng
import ipfs_mng
import logs_mng

def start():
    logs_mng.print_info("Server","Starting Server!")
    ai_mng.init()
    logs_mng.print_default("Server","Sending Request to AI")
    ai_mng.generate_question("Programacao em C", "Loops,Condicoes","PT-PT")
    logs_mng.print_info("Server","Stopping Server!")



start()
