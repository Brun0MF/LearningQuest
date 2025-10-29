import axios from "axios";

const url = 'http://localhost:8000/api/utilizadores/';

export const getUtilizadores = async () => {
    const response = await axios.get(url);
    return response.data;
}

export const getPontuacaoUtilizador = async () => {
    const response = await axios.get(`${url}pontuacao/`);
    return response.data;
}

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${url}login/`, {
            email_utilizador: email,
            password_utilizador: password
        });

        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('id_user', response.data.user.id_utilizador);

        return response.data;
    } catch (error) {
        console.error('Erro no login:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (nome, email, password) => {
    try {
        const response = await axios.post(`${url}register/`, {
            nome_utilizador: nome,
            email_utilizador: email,
            password_utilizador: password
        });

        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('id_user', response.data.user.id_utilizador);


        return response.data;
    } catch (error) {
        console.error('Erro no registar nova conta:', error.response?.data || error.message);
        throw error;
    }
};

export const enviarCodigo = async (email) => {
    try {
        const response = await axios.post(`${url}codigo_email/`, {
            email_utilizador: email
        });

        localStorage.setItem('email_user', email);
        localStorage.setItem('codigo_2FA', response.data.codigo);

        return response.data;
    } catch (error) {
        console.error('Erro no registar nova conta:', error.response?.data || error.message);
        throw error;
    }
};

export const mudarPassword = async (password) => {
    try {
        const email = localStorage.getItem('email_user');
        const response = await axios.post(`${url}mudar_password/`, {
            email_utilizador: email,
            password_utilizador: password
        });

        localStorage.removeItem('email_user');
        localStorage.removeItem('codigo_2FA');

        return response.data;
    } catch (error) {
        console.error('Erro no registar nova conta:', error.response?.data || error.message);
        throw error;
    }
};

export const editarPerfil = async (nome, email, path, id_user) => {
    const response = await axios.patch(`${url}${id_user}/editar/`, {
        nome_utilizador: nome,
        email_utilizador: email,
        path_imagem: path,
    });
    return response.data;
}

export const getUtilizadorbyID = async (id_user) => {
    const response = await axios.get(`${url}${id_user}/`);
    return response.data;
}