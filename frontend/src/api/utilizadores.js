import axios from "axios";

const url = 'http://localhost:8000/api/utilizadores';

export const login = async () => {
    const response = await axios.post(`${url}/login/`, {
        email_utilizador: email,
        password_utilizador: password
    });

    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
}