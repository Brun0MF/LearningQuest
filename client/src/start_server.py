import ai_mng
import ipfs_mng
import logs_mng
from datetime import datetime
from flask import Flask, jsonify, request 

app = Flask(__name__)

def start():
    logs_mng.print_info("Server","Starting Server!")
    ai_mng.init()
    ipfs_mng.init()
    app.run(port=5000,debug=True)    
    logs_mng.print_info("Server","Stopping Server!")


#Gerar Pergunta(Devolve CID da pergunta)
@app.route("/generate_question", methods=["GET"])
def generate_question_route():
    logs_mng.print_info("API","Sending Request to AI")
    dnow = datetime.now()
    timestamp = dnow.strftime("%d%m%Y_%H%M%S")
    top = request.args.get("topic")
    cont = request.args.get("content")
    lang = request.args.get("lang")
    if(top is None):
        return None
    if(cont is None):
        return None
    if(lang is None):
        return None
    ai_output = ai_mng.generate_question(top, cont, lang)
    logs_mng.print_info("API","Sending JSON to IPFS")
    fname = f"question_{timestamp}.json"
    cid = ipfs_mng.ipfs_add_json(ai_output, filename=fname)
    return jsonify({"cid": cid})


#Obter JSON do IPFS(Devolve conteudo do JSON)
@app.route("/get_question", methods=["GET"])
def get_question_route():
    logs_mng.print_info("API","Getting JSON from IPFS")
    cid = request.args.get("cid")
    if(cid is None):
        return None
    file_json = ipfs_mng.ipfs_get_json(cid)
    return file_json


#Conectar a Rede P2P
@app.route("/connect", methods=["POST"])
def connect_route():
    addr = request.args.get("address")
    if(addr is None):
        return None
    conn = ipfs_mng.ipfs_connect(addr)
    return conn

#Endereco a Rede P2P
@app.route("/address", methods=["GET"])
def address_route():
    address = ipfs_mng.ipfs_get_address();
    return address


start()
