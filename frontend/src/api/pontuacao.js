import axios from "axios";

const url = 'http://localhost:8000/api/pontuacoes/';

export const getPontuacao_user_topico = (id_user, id_topico) => {
    try {
        const response = axios.get(`${url}by-user-topic/?id_utilizador=${id_user}&id_topico=${id_topico}`);
        return response;
    } catch(e) {
        console.log(e);
    }
}