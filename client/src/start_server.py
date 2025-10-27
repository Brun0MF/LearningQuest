import ai_mng
import ipfs_mng
import logs_mng

def start():
    print("Starting Server!")
    ai_mng.init()
    ai_mng.generate_question("Programacao em C", "Loops,Condicoes","PT-PT")




start()
