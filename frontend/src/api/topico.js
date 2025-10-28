import axios from "axios";

const url = 'http://localhost:8000/api/topicos/';

export const getTopicos = async () => {
    const response = await axios.get(url);
    return response.data;
}