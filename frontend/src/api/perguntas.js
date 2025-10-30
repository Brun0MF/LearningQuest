import axios from "axios";

const url = 'http://localhost:8000/api/perguntas/';

export const getPerguntasNivel = async (id_topico, id_nivel) => {
    try {
        const response = await axios.get(`${url}get_level_questions/?topico=${id_topico}&nivel=${id_nivel}`);
        return response.data;
    } catch (e) {
        console.log(e);
    }
}