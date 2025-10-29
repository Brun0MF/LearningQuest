import axios from "axios";

const url = 'http://localhost:8000/api/topicos/';

export const getTopicos = async () => {
    const response = await axios.get(url);
    return response.data;
}

export const getPontuacaoTopico = async (id_topico) => {
    const response = await axios.get(`${url}${id_topico}/ranking/`);
    return response.data;
}