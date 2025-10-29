import axios from "axios";

const url = 'http://localhost:8000/api/niveis/';

export const getNivelTopico = async (id_topico, pontos_max) => {
    try {
        const response = await axios.get(`${url}by-topico-e-pontos/?id_topico=${id_topico}&pontos_max=${pontos_max}`);
        return response.data;
    } catch(e) {
        console.log(e);
    }
}