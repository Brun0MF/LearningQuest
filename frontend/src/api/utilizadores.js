import axios from "axios";

const url = 'http://localhost:8000/api/utilizadores/';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${url}login/`, {
            email_utilizador: email,
            password_utilizador: password
        });

        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);

        return response.data;
    } catch (error) {
        console.error('Erro no login:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (nome, email, password) => {
    try {
        const response = await axios.post(`${url}register/`, {
            nome_utilizador: user,
            email_utilizador: email,
            password_utilizador: password
        });

        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);

        return response.data;
    } catch (error) {
        console.error('Erro no registar nova conta:', error.response?.data || error.message);
        throw error;
    }
};
