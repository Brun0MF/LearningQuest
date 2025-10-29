import axios from "axios";

const url = 'http://localhost:8000/api/categorias/';

export const getCategorias = async () => {
    const response = await axios.get(url);
    return response.data;
}

export const getTopicos_categoria = async (id_categoria) => {
    const response = await axios.get(`${url}${id_categoria}/topicos/`);
    return response.data;
}