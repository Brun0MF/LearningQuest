import axios from "axios";

const url = 'http://localhost:8000/api/categorias';

export const getCategorias = async () => {
    const response = await axios.get(url);
    return response.data;
}