import axios from "axios";

const url = 'http://localhost:8000/api/utilizadores/';

export const getUtilizadores = async () => {
    const response = await axios.get(url);
    return response.data;
}